<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">คู่มือการรประเมิน </h1>
                    </v-card-title>
                    <v-card-text>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อเอกสาร</th>
                                    <th class="border text-center">วันที่ออกเอกสาร</th>
                                    <th class="border text-center">เอกสาร</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_doc }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_doc) }}</td>
                                    <td class="border text-center"><v-btn class="text-center text-white ma-2" size="small" color="info" prepend-icon="mdi-eye" @click="view(items.file)">เปิดดู</v-btn></td>
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
import { api, staff,eva } from '~/API/base'

const file = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const search = ref('')
const dataResult = ref([])
const name_doc = ref('')
const token = import.meta.client ? localStorage.getItem('token'):null


const fetch = async()=>{

    try {
        const res = await axios.get(`${eva}/docnoe/`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }

}

const result = ref([])

const formatDate = (dateStr:string)=>{

    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`

}

// const edit = (items:any)=>{
//     form.value = {...items}
// }



const view = (filename:string)=>{

    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')

}

onMounted(fetch)

</script>

<style scoped>

</style>