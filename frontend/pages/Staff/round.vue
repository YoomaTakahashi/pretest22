<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                       
                        <h1 class="text-center text-h5">จัดการรอบการประเมิน </h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่เปิดรอบการประเมิน" v-model="form.day_open" :error-messages="error.day_open" type="date"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่ปิดรอบการประเมิน" v-model="form.day_out" :error-messages="error.day_out" type="date"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รอบการประเมิน" v-model="form.round_sys" :error-messages="error.round_sys" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ปีการประเมิน" v-model="form.year_sys" :error-messages="error.year_sys" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทตัวเลือก" v-model="form.status_sys" :error-messages="error.status_sys" :items="[{title:'เปิด',value:'y'},{title:'ปิด',value:'n'}]"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" type="submit" color="primary">{{ form.id_sys ? 'อัปเดต':'บันทึก' }}</v-btn>
                                        <v-btn class="text-center ma-2" type="reset" color="error">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <!-- <v-text-field class="mt-3" v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field> -->
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">วันที่เปิดรอบการประเมิน</th>
                                    <th class="border text-center">วันที่ปิดรอบการประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">ปีการประเมิน</th>
                                    <th class="border text-center">สถาะการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_open) }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_out) }}</td>
                                    <td class="border text-center">{{ items.round_sys }}</td>
                                    <td class="border text-center">{{ items.year_sys }}</td>
                                    <td class="border text-center">{{ items.status_sys === 'y' ? 'เปิด':'ปิด' }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn class="text-center text-white ma-2" size="small" color="error" @click="del(items.id_sys)">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" v-if="result.length ===0" colspan="12"></td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const search = ref('')
const result = ref([])
const topics = ref([])
const form = ref({
    id_sys:null,
    day_open:'',
    day_out:'',
    round_sys:'',
    year_sys:'',
    status_sys:''

})
const reset = ()=>{

    form.value = {
        id_sys:null,
        day_open:'',
        day_out:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }

}
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    const f = form.value
    error.value = {}
    if(!f.day_open)error.value.day_open = 'กรุณาเลือกวันที่เปิดรอบการประเมินผล'
    if(!f.day_out)error.value.day_out = 'กรุณาเลือกวันที่ปิดรอบการประเมินผล'
    if(!f.round_sys)error.value.round_sys = 'กรุณากรอกรอบการประเมิน'
    if(!f.year_sys)error.value.year_sys = 'กรุณากรอกปีการประเมิน'
    if(!f.status_sys)error.value.status_sys = 'กรุณาเลือกสถานะการประเมิน'
    return Object.keys(error.value).length === 0
}
const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    try {
        f.id_sys
        ? await axios.put(`${staff}/system/update/${f.id_sys}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/system/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
        alert('ทำรายการสำเร็จ')
    } catch (error) {
        console.error("error save",error);
        
    }

}

const fetch = async()=>{

    try {
        const res = await axios.get(`${staff}/system/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }

}

// const result = computed(()=>{
//     if(!search.value)return dataResult.value
//     const s = search.value.toLowerCase()
//     return dataResult.value.filter((items:any)=>{
//         items.name_indicate?.toLowerCase().includes(s)
//     })
// })

const formatDate = (dateStr:string)=>{

    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`

}

const edit = (items:any)=>{
    form.value = {...items}
}

const del = async(id_sys:any)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${staff}/system/delete/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
    } catch (error) {
        console.error("Error delete",error);
        
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>