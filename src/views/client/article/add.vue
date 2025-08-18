<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top" class="el-form">
        <el-form-item label="博文内容" prop="content">
            <v-md-editor v-model="form.content" :disabled-menus="[]" @upload-image="handleUploadImage" :left-toolbar="leftToolbar" height="500px" />
        </el-form-item>

        <div class="dy">
            <div class="flex-1">

                <el-form-item label="博文标题" prop="title" style="width: 90%">
                    <el-input v-model="form.title" :rows="2" type="textarea" placeholder="请输入博文标题"></el-input>
                </el-form-item>
                <el-form-item label="博文封面" prop="url" style="width: 90%">
                    <el-upload class="img-uploader" :auto-upload="false" :on-change="uploadChange">
                        <div v-if="form.preUrl" class="avatar" :style="{backgroundImage: `url(${form.preUrl})`}"></div>
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="flex-1">
                <el-form-item label="" prop="isTop" style="width: 90%">
                    <span>
                        <i>是否置顶：</i>
                        <el-switch v-model="form.isTop" :active-value="1" :inactive-value="2" />
                    </span>
                </el-form-item>

                <el-form-item label="博文标签" prop="tags" style="width: 90%">
                    <el-input v-model="form.tags" :rows="2" type="textarea" placeholder="请添加博文标签，以#开头，可添加多个"></el-input>
                </el-form-item>
                <el-form-item label="博文摘要" prop="blogAbstract" style="width: 90%">
                    <el-input v-model="form.blogAbstract" :rows="4" type="textarea" placeholder="请输入博文标题"></el-input>
                </el-form-item>

                <el-form-item style="width: 90%">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </div>
        </div>
    </el-form>
</template>

<script setup>
import {successDeal,  compress, base64ToFile} from '@/utils/utils'
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'

import api from './api'
import useSettingStore from '@/stores/modules/setting'
const settingStore = useSettingStore()

const leftToolbar = ref('undo redo clear| tip | h bold italic strikethrough quote | ul ol table hr | link image code | emoji')

function handleUploadImage(event, insertImage, files) {
    let file = files[0]
    const readFile = new FileReader()
    readFile.readAsDataURL(file)
    readFile.onload = async function (e) {
        let base64 = e.target.result
        //   压缩图片
        let _base64 = await compress(base64, 400, 400)

        //   转换为file
        let _file = base64ToFile(_base64, file.name)

        const formData = new FormData()
        formData.append('file', _file) // 通过append向form对象添加数据
        formData.append('type', 'markdown') // 通过append向form对象添加数据
        settingStore.setLoading(true, '上传图片中...')
        api.upload(formData, true, {'Content-Type': 'multipart/form-data'}).then((res) => {
            insertImage({
                url: res.data.fullUrl,
            })
            settingStore.setLoading(false)
        })
    }
}

const $router = useRouter()



const form = ref({
    content: '',
    title: '',
    filename: '',
    url: '',
    preUrl: '',
    isTop: 2,
    tags: '',
    blogAbstract: '',
})

const formRef = ref(null)

function save() {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            let json = JSON.parse(JSON.stringify(form.value))
            json.tags = json.tags.split('#')
            json.tags.shift()
            settingStore.setLoading(true, '图片上传中...')
            api.articleAdd(json)
                .then((res) => {
                    $router.push('/acticle')
                    successDeal('新增成功')
                    settingStore.setLoading(false)
                })
                .catch((error) => {
                    settingStore.setLoading(false)
                })
        }
    })
}
function cancel() {
    $router.push('/acticle')
}


// 文件上传
function uploadChange({raw: file}) {
    const readFile = new FileReader()
    readFile.readAsDataURL(file)
    readFile.onload = async function (e) {
        let base64 = e.target.result
        //   压缩图片
        let _base64 = await compress(base64, 2500, 2500)

        //   转换为file
        let _file = base64ToFile(_base64, file.name)

        //   Object url
        form.value.preUrl = URL.createObjectURL(_file)

        let formData = new FormData()
        formData.append('file', _file)
        settingStore.setLoading(true, '上传图片中...')
        api.upload(formData, true, {'Content-Type': 'multipart/form-data'}).then((res) => {
            form.value.filename = res.data.filename
            form.value.url = res.data.url
            settingStore.setLoading(false)
        })
    }
}


const rules = reactive({
    title: [{required: true, message: '请输入博文标题', trigger: 'blur'}],
    content: [{required: true, message: '请输入博文内容', trigger: 'change'}],
    // url: [{required: true, message: '请上传博文封面图片', trigger: 'change'}],
    blogAbstract: [{required: true, message: '请输入博文摘要', trigger: 'blur'}],
})
</script>

<style lang="scss" scoped>
.el-form {
    padding-bottom: 100px;
}
.img-uploader {
    border: 1px solid #eee;
    width: 100%;
    height: 150px;
    overflow: hidden;
}

.img-uploader img {
    width: 100%;
}
.avatar {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>

<style>
.img-uploader .el-upload {
    width: 100% !important;
    height: 100% !important;
}
</style>
