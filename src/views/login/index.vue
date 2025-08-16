<template>
    <div class="content">
        <div class="login">
            <h3 class="tips">{{ config.systemName }}</h3>

            <el-form ref="ruleFormRef" :model="form" :rules="rules" class="form-box" size="large" @submit.native.prevent>
                <el-form-item prop="mobile">
                    <el-input @keyup.native.enter="login(ruleFormRef)" v-model="form.mobile" placeholder="手机号码" maxlength="11" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input @keyup.native.enter="login(ruleFormRef)" v-model="form.password" type="password" placeholder="登录密码" maxlength="12" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" style="width: 100%" @click="login(ruleFormRef)">登 录</el-button>
                    <!-- <div class="forget" @click="goForget">忘记密码</div> -->
                </el-form-item>
            </el-form>
        </div>

        <div class="login-img"></div>
    </div>
</template>

<script setup>
import {reactive, ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import hexMD5 from '@/utils/md5.min.js'
import config from '@/config.js'

const $router = useRouter()
const form = reactive({
    mobile: '',
    password: '',
})
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
})
const ruleFormRef = ref()

import useUserStore from '@/stores/modules/user'
const useUser = useUserStore()

const login = (formEl) => {
    formEl.validate(async (valid, fields) => {
        if (valid) {
            loading.value = true
            let json = {
                mobile: form.mobile,
                password: hexMD5(form.password),
            }
            try {
                await useUser.login(json)
                $router.push('/home')
            } catch (error) {
                loading.value = false
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('../../assets/imgs/banner.png') no-repeat;
    background-position: center;
    background-size: cover;
}

.tips {
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.form-box {
    margin-top: 40px;
}

.login {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    width: 320px;
    height: 420px;
    border-radius: 10px;
    padding: 40px 20px;
    z-index: 1;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);
}

.login-img {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    width: 320px;
    height: 420px;
    background: url('../../assets/imgs/banner.png') no-repeat center;
    background-size: cover;
    filter: blur(6px) brightness(0.9);
}

.forget {
    color: #fff;
    width: 100%;
    text-align: right;
    cursor: pointer;

    &:hover {
        color: #409eff;
    }
}
</style>

<style>
.login .el-form-item--large .el-form-item__content {
    margin-top: 10px;
}

.login .el-form-item.is-error .el-input__wrapper {
    border: none !important;
    box-shadow: none !important;
}
.login .el-form-item.is-error .el-input__wrapper .is-foucs {
    border: none !important;
    box-shadow: none !important;
}
.login .el-input__wrapper.is-foucs {
    border: none !important;
    box-shadow: none !important;
}
.login .el-input__wrapper:hover {
    border: none !important;
    box-shadow: none !important;
}

.login .el-form-item__error {
    color: rgb(235, 11, 235);
}

.login .el-button {
    color: rgb(235, 11, 235);
    background-color: #fff;
    border-color: #fff;
}
.login .el-button:focus,
.login .el-button:hover {
    color: rgb(235, 11, 235);
    background-color: #f8f7f7;
    border-color: #e2e2e2;
}
</style>
