<template>
    <go-back />
    <el-divider />
    <section class="f-mt-20">
        <h3 class="f-mr-20 black f-center">{{ info.title }}</h3>
        <div class="dy dy-jc-c dy-ai-c f-mt-10 grey">
            <div>
                <span>评论数：</span>
                <i>{{ info.comments || 0 }}</i>
            </div>
            <div class="f-ml-20">
                <span>浏览量：</span>
                <i>{{ info.visitors || 0 }}</i>
            </div>
            <div class="f-ml-20">
                <span>创建时间：</span>
                <i>{{ info.createTime }}</i>
            </div>
        </div>
    </section>
    <section class="f-plr—20 f-mt-20">
        <el-alert :description="info.blogAbstract" title="摘要" show-icon :closable="false" type="info"></el-alert>
    </section>

    <v-md-editor v-model="info.content" mode="preview" height="''"></v-md-editor>
</template>

<script setup lang="ts">
import api from './api'
import GoBack from '@/components/GoBack.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
const $router = useRouter()
const $route = useRoute()

onMounted(() => {
    let id = $route.query.id
    getDetail(id)
})

const info = ref({
    content: '',
})
function getDetail(id) {
    api.articleDetail({ id }).then((res) => {
        console.log(res, '000')
        info.value = res.data
    })
}
</script>

<style lang="scss" scoped></style>
