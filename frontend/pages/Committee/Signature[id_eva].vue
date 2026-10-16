<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                       
                        <h1 class="text-center text-h5">เอกสารหรือคู่มือการรประเมิน </h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                
                                <v-col cols="12" md="12">
                                    <v-file-input label="เอกสาร" v-model="file" :error-messages="error.file" accept=".pdf" hint="รองรับเฉพาะไฟล์ PDF ขนาด 10MB เท่านั้น" persistent-hint></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" type="submit" color="primary">บันทึก</v-btn>
                                        <v-btn class="text-center ma-2" type="reset" color="error">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-table v-else class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">เอกสาร</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border text-center">{{ 1 }}</td>
                                    <td class="border text-center">{{ result.signature }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" size="small" color="warning" @click="view(result.signature)">เปิดดู</v-btn>
                                            <v-btn class="text-center text-white ma-2" size="small" color="error" @click="del(id_eva)">ลบ</v-btn>
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
import { api, commit, staff } from '~/API/base'

const file = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const search = ref('')
const dataResult = ref([])
const name_doc = ref('')
const id_eva = useRoute().params.id_eva
const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{

    if(!name_doc.value && !file.value)return alert('กรอกข้อมูลให้ครบถ้วน')
    const maxSize = 10*1024*1024
    if(file.value?.size > maxSize){

        alert("ไฟล์มีขาดเกิน 10MB")

    }
    const formdata = new FormData
    formdata.append('name_doc',name_doc.value)
    formdata.append('file',file.value!)
    try {
        
        await axios.post(`${commit}/signature/${id_eva}`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        alert('ทำรายการสำเร็จ')
        name_doc.value = ''
        file.value = null
    } catch (error) {
        console.error("error save",error);
        
    }

}

const fetch = async()=>{

    try {
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }

}

const result = ref([])


const del = async(id_eva:any)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    } catch (error) {
        console.error("Error delete",error);
        
    }
}

const view = (filename:string)=>{

    const url = new URL(`/uploads/signature/${filename}`,commit).href
    window.open(url,'_blank')

}

onMounted(fetch)

</script>

<style scoped>

</style>