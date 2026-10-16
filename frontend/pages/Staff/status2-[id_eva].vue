<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="mb-3">
                    <v-card-title><h1 class="text-center text-h5">ผู้รับการประเมินผล</h1></v-card-title>
                    <v-card-text>
                        <p>ชื่อ-สกุล: {{ header.fname }} {{ header.lname }}</p>
                        <p>รอบการประเมินที่: {{ header.round_sys }} ปี:{{ header.year_sys }}</p>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>      
                        <h1 class="text-center text-h5">สถานะการประเมินกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">ตำแหน่ง</th>
                                    <th class="border text-center">สถาะการประเมิน</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_commit">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="border text-center">{{ items.level_commit }}</td>                  
                                    <td class="border text-center"><v-btn class="text-center text-white" :color="bg(items.status_commit)" size="small">{{ items.status_commit === 'y' ? 'ประเมินสำเร็จ': 'รอการประเมิน' }}</v-btn></td>
                                  
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
const header = ref([])


const token = import.meta.client ? localStorage.getItem('token'):null
const id_eva = useRoute().params.id_eva
const fetch = async()=>{

    try {
        const res = await axios.get(`${staff}/status/show/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
        const res2 = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res2.data
    } catch (error) {
        console.error("error get",error);
    }

}



const bg = (status_commit)=>{
    if(status_commit==='n')return 'error'
    else if(status_commit==='y')return 'success'
}

onMounted(fetch)

</script>

<style scoped>

</style>