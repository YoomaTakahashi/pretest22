<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>      
                        <h1 class="text-center text-h5">สถานะการประเมินกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field class="mt-3" v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมินผล</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">สถาะการประเมิน</th>
                                    <th class="border text-center">รายละเอียด</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="border text-center">รอบการประเมินที่:{{ items.round_sys }} ปี:{{ items.year_sys }}</td>                  
                                    <td class="border text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="border text-center"><v-btn class="text-center text-white" :color="bg(items.status_eva)" size="small">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง': items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ' }}</v-btn></td>
                                    <td class="border text-center"> <v-btn class="text-center text-white ma-2" size="small" color="info" @click="go(items.id_eva)">รายละเอียด</v-btn></td>
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
const dataResult = ref([])


const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async()=>{

    try {
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }

}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()
    return dataResult.value.filter((items:any)=>{
        return(
            items.fname?.toLowerCase().includes(s) || 
            items.lname?.toLowerCase().includes(s) 
        )
        
    })
})
const formatDate = (dateStr:string)=>{

    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`

}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/status2-${id_eva}`})
}

const bg = (status_eva)=>{
    if(status_eva===1)return 'error'
    else if(status_eva===2)return 'warning'
    else if(status_eva===3)return 'success'
}

onMounted(fetch)

</script>

<style scoped>

</style>