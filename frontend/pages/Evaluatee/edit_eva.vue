<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card color="#7d0c14">
                    <v-card-title>
                        <center><v-img src="/img/logo2.png" width="15%" class="mt-3"></v-img></center>
                        <h1 class="text-center text-h5">สมัครสมาชิก</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.fname" :error-messages="error.fname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.lname" :error-messages="error.lname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email" prepend-inner-icon="mdi-email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" prepend-inner-icon="mdi-account" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" :type="showPw ? 'text':'password'" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'"  @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" :type="showPw2 ? 'text':'password'" :prepend-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" @click:prepend-inner="show2 = !show2 , showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทสมาชิก" prepend-inner-icon="mdi-account-group" v-model="form.role" :error-messages="error.role" :items="typeR"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-file-input label="รูปภาพสมาชิก" v-model="pic_user" :error-messages="error.pic_user" accept=".png , .jpg" hint="รองรับเฉพาะไฟล์ PNG และ JPG เท่านั้น" persistent-hint></v-file-input>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const conP = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)
const form = ref({
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    const f = form.value
    error.value = {}
    if(!f.fname.trim())error.value.fname = 'กรุณากรอกชื่อ'
    if(!f.lname.trim())error.value.lname = 'กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'กรุณากรอกอีเมลให้ถูกต้อง'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
    else if(f.password.trim() !== conP.value.trim())error.value.conP = 'รหัสผ่านไม่ตรงกัน'

    if(!f.role.trim())error.value.role = 'กรุณาเลือกประเภทสมาชิก'

    return 
}
</script>

<style scoped>

</style>