<template>
    <v-container>
        <v-card :elevation="5" rounded>
            <v-sheet class="pa-5" :elevation="5" rounded>
                <h1 class="font-weight bold text-center">DashBoard - Evaluatee</h1>
                <v-card-text>
                <v-row>
                    <v-col md="4" cols="12" v-for="b in box" :key="b">
                        <v-card class="pa-5 py-4" :elevation="5" rounded>
                            <div class="text-center pa-2 text-h5">{{ b.title }}</div>
                            <div class="text-center pa-2 text-h5">{{ b.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            </v-sheet>
            
        </v-card>

        <v-card class="mt-5" :elevation="5" rounded>
            <v-sheet class="pa-5" :elevation="5" rounded>
                <h2 class="font-weight bold text-center">รอบการประเมินทั้งหมด</h2>
                <v-card-text>
                <v-table class="table">
                    <tr>
                        <th class="bg-grey border pa-1" style="width: 10%;">ลำดับ</th>
                        <th class="bg-grey border pa-1" style="width: 10%;">ชื่อ - นามสกุล</th>
                        <th class="bg-grey border pa-1" style="width: 10%;">รอบการประเมิน</th>
                        <th class="bg-grey border pa-1" style="width: 10%;">ปีการประเมิน</th>
                    </tr>
                    <tr v-for="(r,i) in round" :key="r">
                        <td class="border pa-1 text-center" style="width: 10%;">{{ i+1 }}</td>
                        <td class="border pa-1 text-center" style="width: 10%;">{{ r.fname }}-{{ r.lname }}</td>
                        <td class="border pa-1 text-center" style="width: 10%;">{{ r.round_sys }}</td>
                        <td class="border pa-1 text-center" style="width: 10%;">{{ r.year_sys }}</td>
                    </tr>
                </v-table>
            </v-card-text>
            </v-sheet>
            
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva } from '~/API/base';

const box = ref([])
const round = ref<any>([])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        const res2 = await axios.get(`${eva}/table`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res2.data
    } catch (error) {
        console.error('Erorr Get anyone',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>