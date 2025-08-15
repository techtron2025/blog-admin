<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top" class="el-form">
        <el-form-item label="博文内容" prop="content">
            <el-tabs type="border-card" style="width: 100%" @tab-change="tabChange">
                <el-tab-pane label="Markdown">
                    <v-md-editor v-model="form.content" :disabled-menus="[]" @upload-image="handleUploadImage" :left-toolbar="leftToolbar" height="500px" />
                </el-tab-pane>
            </el-tabs>
        </el-form-item>

        <div class="dy">
            <div class="flex-1">
                <el-form-item label="博文类型" prop="type" style="width: 90%">
                    <el-select v-model="form.type" placeholder="请选择博文类型" style="width: 100%">
                        <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

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
                <el-form-item label="博文状态" prop="state" style="width: 90%">
                    <span class="f-pl-10">
                        <i>是否发布：</i>
                        <el-switch v-model="form.state" :active-value="1" :inactive-value="2" />
                    </span>
                    <span class="f-ml-10">
                        <i>是否火热：</i>
                        <el-switch v-model="form.isHot" :active-value="1" :inactive-value="2" />
                    </span>
                    <span class="f-ml-10">
                        <i>是否置顶：</i>
                        <el-switch v-model="form.isTop" :active-value="1" :inactive-value="2" />
                    </span>
                    <span class="f-ml-10">
                        <i>是否推荐：</i>
                        <el-switch v-model="form.isRecommend" :active-value="1" :inactive-value="2" />
                    </span>
                </el-form-item>

                <el-form-item label="博文标签" prop="label" style="width: 90%">
                    <div class="dy" style="width: 100%">
                        <el-select v-model="form.label" placeholder="请选择博文标签" class="flex-1" multiple :multiple-limit="3">
                            <el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                        <el-button class="f-ml-10" type="primary" @click="addLabel">新增标签</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="博文摘要" prop="abstract" style="width: 90%">
                    <el-input v-model="form.abstract" :rows="4" type="textarea" placeholder="请输入博文标题"></el-input>
                </el-form-item>

                <el-form-item style="width: 90%">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancle">取消</el-button>
                </el-form-item>
            </div>
        </div>
    </el-form>
    <addLable ref="addLableRef" @lableBack="lableBack" />
</template>

<script setup>
import {successDeal, errorDeal, setStore, getStore, removeStore, phoneFormat, compress, base64ToFile} from '@/utils/utils'
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'

import api from './api'
import useSettingStore from '@/stores/modules/setting'
const settingStore = useSettingStore()

const leftToolbar = ref('undo redo clear| tip | h bold italic strikethrough quote | ul ol table hr | link image code | save| emoji')

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
onMounted(() => {
    // getclassifyList()
    // getLabelList()
})

// 获取分类列表
const classifyList = ref()
function getclassifyList() {
    api.classifyList().then((res) => {
        classifyList.value = res.data
    })
}

// 获取标签列表
const labelList = ref([])
function getLabelList() {
    api.labelList().then((res) => {
        labelList.value = res.data
    })
}

const form = ref({
    content: '',
    title: '',
    filename: '',
    url: '',
    preUrl: '',
    isHot: 1,
    isTop: 1,
    isRecommend: 1,
    state: 1, //发布，2草稿
    type: '',
    editor: 0, //0 mrkdwon,1 tinyce
    label: [],
    abstract: '',
})

const formRef = ref(null)

function save() {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            let json = JSON.parse(JSON.stringify(form.value))
            json.label = form.value.label.join(',')
            settingStore.setLoading(true, '上传oss中...')
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
function cancle() {
    $router.push('/acticle')
}

function tabChange(val) {
    form.value.editor = val
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

// 新增标签
import addLable from '@/components/addLable.vue'
const addLableRef = ref(null)
const addLabel = () => {
    addLableRef.value.open()
}
const lableBack = () => {
    getLabelList()
}

const rules = reactive({
    title: [{required: true, message: '请输入博文标题', trigger: 'blur'}],
    content: [{required: true, message: '请输入博文内容', trigger: 'change'}],
    // url: [{required: true, message: '请上传博文封面图片', trigger: 'change'}],
    // type: [{required: true, message: '请选择博文状态', trigger: 'change'}],
    // label: [{required: true, message: '请选择博文标签', trigger: 'blur'}],
    // abstract: [{required: true, message: '请输入博文摘要', trigger: 'blur'}],
    // state: [{required: true, message: '请选择博文状态', trigger: 'blur'}],
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
