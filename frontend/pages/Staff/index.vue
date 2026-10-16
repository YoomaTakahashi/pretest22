<template>
    <v-container>
        <v-card :elevation="5" rounded>
            <v-sheet class="pa-5" :elevation="5" rounded>
                <h1 class="font-weight bold text-center">DashBoard - Staff</h1>
                <v-card-text>
                <v-row>
                    <v-col md="4" cols="12" v-for="b in box" :key="b">
                        <v-card class="pa-5 py-4" :elevation="5" rounded>
                            <div class="text-center pa-2 text-h5">{{ b.title }}</div>
                            <div class="text-center pa-2 text-h5">{{ b.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="4" cols="12" v-for="b in box2" :key="b">
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
                <h2 class="font-weight bold text-center">ผู้รับการประเมินผล</h2>
                <v-card-text>
                <v-table class="mt-3">
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ชื่อ-สกุล</th>
                            <th class="border text-center">อีเมล</th>
                            <th class="border text-center">ชื่อผู้ใช้</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_member">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ items.fname }} {{ items.lname }}</td>
                            <td class="border text-center">{{ items.email }}</td>
                            <td class="border text-center">{{ items.username }}</td>
                        </tr>
                        <tr>
                            <td class="text-center text-red" v-if="result.length ===0" colspan="12"></td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
            </v-sheet>
            
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,staff } from '~/API/base';

const box = ref([])
const box2 = ref([])
const result = ref([])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
        const res2 = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res2.data.box
        box2.value = res2.data.box2
    } catch (error) {
        console.error("error get",error);
        
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>