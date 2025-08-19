<template>
    <!-- 用户列表 -->
    <div ref="content" class="box">
        <!-- 查询 -->
        <div class="list-title" ref="listTitle">
            <el-input style="width: 230px" v-model="form.title" placeholder="请输入标题查询" clearable></el-input>
            <div class="f-ml-10">
                <el-button type="primary" @click="getList">查 询</el-button>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="f-ptb-10">
            <el-button type="primary" @click="addHandle">新增</el-button>
        </div>
        <!-- 表单table -->
        <div class="table-content" ref="container">
            <el-table :data="list" border stripe :height="tabHeight" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
                <el-table-column prop="title" label="博文名称" min-width="200"></el-table-column>
                <el-table-column prop="url" label="博文图片" min-width="70">
                    <template #default="{row}">
                        <el-image style="width: 100%; height: 30px" :src="row.url" :preview-src-list="[row.url]" fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column prop="visitors" label="浏览人数" min-width="70"></el-table-column>
                <el-table-column prop="comments" label="评论数" min-width="70"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="130"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" min-width="130"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{row}">
                        <el-button type="warning" size="small" @click="detailHandle(row.id)">详情</el-button>
                        <el-button type="primary" size="small" @click="editHandle(row.id)">编辑</el-button>
                        <el-popconfirm title="确定要删除该博文吗?" @confirm="delHandle(row.id)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="table-footer">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup>
import {reactive, ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import {successDeal, errorDeal, setStore, getStore, removeStore, phoneFormat} from '@/utils/utils'
import {usePagination} from '@/hooks/pagination'
import {useTable} from '@/hooks/table'
import {useRouter, useRoute} from 'vue-router'
import api from './api'
const $router = useRouter()

const recommendList = [
    {
        value: 1,
        label: '推荐',
    },
    {
        value: 2,
        label: '不推荐',
    },
]

const hotList = [
    {
        value: 1,
        label: '火热',
    },
    {
        value: 2,
        label: '不火热',
    },
]

// table hooks
const {headerCellStyle, container, tabHeight} = useTable(0)

onMounted(() => {
    // getClassifyList()
    getList()
})

// 获取分类列表
const classifyList = ref([])
function getClassifyList() {
    api.classifyList().then((res) => {
        classifyList.value = res.data
    })
}

// 博文列表
const form = reactive({
    title: '',
    type: '',
    isHot: '',
    isRecommend: '',
})
const list = ref([])
const getList = () => {
    form.current = pageNum.value
    form.pageSize = pageSize.value
    api.articleList(form).then((res) => {
        list.value = res.data.records
        total.value = res.data.total
    })
}

// 新增
function addHandle() {
    $router.push('/acticle/add')
}
// 删除
function delHandle(id) {
    api.articleDel({id}).then((res) => {
        successDeal('删除成功')
        getList()
    })
}
// 编辑
function editHandle(id) {
    $router.push({
        query: {id},
        path: '/acticle/edit',
    })
}

function detailHandle(id) {
    $router.push({
        query: {id},
        path: '/acticle/detail',
    })
}

const cellStyle = ({row, column, rowIndex, columnIndex}) => {
    if (columnIndex == 1) {
        return {textAlign: 'center', padding: 0}
    } else {
        return {textAlign: 'center'}
    }
}

// 分页 hooks
const {pageSize, pageNum, total, handleSizeChange, handleCurrentChange} = usePagination(getList)
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
}
.list-title {
    display: flex;
}
.table-content {
    height: calc(100% - 142px);
    width: 100%;
}
</style>
