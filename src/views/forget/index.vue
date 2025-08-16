<template>
    <div class="content">
        <div class="forget_box">
            <h3 class="tips">忘记密码</h3>
            <el-form ref="ruleFormRef" :model="form" :rules="rules" class="form-box" size="large" @submit.native.prevent>
                <el-form-item prop="mobile">
                    <el-input @keyup.native.enter="login(ruleFormRef)" v-model="form.mobile" placeholder="手机号码" maxlength="11" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input @keyup.native.enter="login(ruleFormRef)" v-model="form.password" type="password" placeholder="请输入新密码" maxlength="12" show-password />
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input @keyup.native.enter="login(ruleFormRef)" v-model="form.repassword" type="password" placeholder="请输入确认密码" maxlength="12" show-password />
                </el-form-item>
                <el-form-item>
                    <div class="f-right" style="width: 100%">
                        <el-button @click="goBack" size="default">返 回</el-button>
                        <el-button type="primary" size="default" :loading="loading" @click="changePwd(ruleFormRef)">确认修改</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div class="forget_img"></div>
    </div>
</template>

<script setup>
import {reactive, ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import api from './api'

const $router = useRouter()
const form = reactive({
    mobile: '',
    password: '',
    repassword: '',
})

const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入确认密码'))
    } else {
        if (value != form.password) {
            callback(new Error('两次输入密码不一致！'))
        } else {
            callback()
        }
    }
}
const loading = ref(false)
const rules = reactive({
    mobile: [
        {required: true, message: '请输入手机号码', trigger: 'blur'},
        {
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
            message: '手机号格式错误',
            trigger: 'change',
        },
    ],
    password: [
        {required: true, message: '请输入登录密码', trigger: 'blur'},
        {min: 6, max: 12, message: '请输入6-12位密码', trigger: 'blur'},
    ],
    repassword: [
        {required: true, message: '请输入确认密码', trigger: 'blur'},
        {validator: validatePass, trigger: 'blur'},
    ],
})
const ruleFormRef = ref()

const changePwd = (formEl) => {
    formEl.validate((valid, fields) => {
        if (valid) {
            loading.value = true
            let json = {
                mobile: form.mobile,
                password: form.password,
                repassword: form.repassword,
            }

            api.resetpwd(json)
                .then((res) => {
                    $router.push('/login')
                    loading.value = false
                })
                .catch((err) => {
                    loading.value = false
                })
        }
    })
}

const goBack = () => {
    $router.push('/login')
}
</script>

<style lang="scss" scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('../../assets/imgs/banner.png') no-repeat center;
    background-size: cover;
}
.tips {
    text-align: center;
    font-size: 30px;
}
.form-box {
    margin-top: 40px;
}
.forget_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 400px;
    border-radius: 10px;
    padding: 40px 20px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);
    z-index: 1;
    color: #fff;
}
.forget_img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 400px;
    border-radius: 10px;
    background: url('../../assets/imgs/banner.png') no-repeat center;
    background-size: cover;
    filter: blur(6px) brightness(0.9);
}
</style>
