<template>
    <div class="container">
        <div class="screen" ref="screen">
            <dv-border-box11 :color="['#4fd2dd', '#235fa7']" title="博客数据大屏">
                <div class="content">
                    <div class="left">
                        <dv-border-box2 class="left-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">系统数据</div>
                            <div class="sys"></div>
                        </dv-border-box2>
                        <dv-border-box2 class="left-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">访客列表</div>
                            <dv-scroll-board :config="config" />
                        </dv-border-box2>
                        <dv-border-box2 class="left-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">文章类型分布</div>
                            <div class="article"></div>
                        </dv-border-box2>
                    </div>
                    <div class="middle">
                        <dv-border-box2 class="middle-box" :color="['#4fd2dd', '#235fa7']">
                            <dv-border-box8 class="online">
                                <span>实时用户人数：</span>
                                <span class="orange f-fs-18 f-wb">{{ userNum }}</span>
                            </dv-border-box8>
                            <div class="map"></div>
                        </dv-border-box2>
                    </div>
                    <div class="right">
                        <dv-border-box2 class="right-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">实时访客识别</div>
                            <div class="realVisitor">
                                <div class="avatar-box">
                                    <img :src="userInfo.avatar || '/uploads/avatar/nv.png'" alt="" />
                                    <div class="f-mt-10">
                                        <span>昵称：</span>
                                        <span>{{ userInfo.username }}</span>
                                    </div>
                                    <div class="f-mt-10">
                                        <span>网络：</span>
                                        <span>{{ userInfo.ips || '-' }}</span>
                                    </div>
                                </div>
                                <div class="user-box">
                                    <div>
                                        <span>访客时间：</span>
                                        <span>{{ userInfo.time || '-' }}</span>
                                    </div>
                                    <div class="f-mt-10">
                                        <span>来源IP：</span>
                                        <span>{{ userInfo.ip || '-' }}</span>
                                    </div>
                                    <div class="f-mt-10">
                                        <span>来源地址：</span>
                                    </div>

                                    <div class="orange f-fs-20 f-wb" style="margin-top: 15px">{{ userInfo.address || '-' }}</div>
                                </div>
                            </div>
                        </dv-border-box2>
                        <dv-border-box2 class="right-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">访客地区分析</div>
                            <div class="adress" style="height: 80%"></div>
                        </dv-border-box2>
                        <dv-border-box2 class="right-box" :color="['#4fd2dd', '#235fa7']">
                            <div class="tip">用户访量统计</div>
                            <div class="users" style="height: 80%"></div>
                        </dv-border-box2>
                    </div>

                    <div class="btn" @click="back">退出大屏</div>
                    <div class="time">{{ time }}</div>
                </div>
            </dv-border-box11>
        </div>
    </div>
</template>

<script setup>
import api from './api'
import {getDateTime, errorDeal} from '@/utils/utils'
import scale from '@/utils/scale'
import echarts from '@/utils/echarts'
import chinaJson from './china'
echarts.registerMap('china', chinaJson)
import {useRouter} from 'vue-router'
import {reactive, onMounted, onUnmounted, onBeforeUnmount, ref, shallowRef, nextTick, computed} from 'vue'
const $router = useRouter()
const screen = ref()

// 时间
const time = ref(getDateTime(new Date().getTime())[6])

const userNum = ref(0)

const userInfo = ref({})
const getTime = () => {
    setInterval(() => {
        time.value = getDateTime(new Date().getTime())[6]
    }, 1000)
}

const back = () => {
    $router.go(-1)
}

// sse
let eventSource = null

onMounted(() => {
    getList()
    getTime()
    init()
    window.addEventListener('resize', onResize)

    eventSource = new EventSource('/stream')
    eventSource.onopen = () => {
        console.log('sse连接成功')
    }

    eventSource.onerror = () => {
        console.log('sse连接失败')
    }

    eventSource.onmessage = (event) => {
        const {message} = JSON.parse(event.data)

        let mapList = message.mapList.map((p) => {
            return {
                name: p.province || '四川省',
                value: p.num,
            }
        })

        userNum.value = message?.userNums
        userInfo.value = message.visitorObj

        optionsMap.value.series[0].data = mapList

        myChartMap.value.setOption(optionsMap.value)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
})

const onResize = () => {
    myChartSys.value?.resize()
    myChartArticle.value?.resize()
    myChartAdress.value?.resize()
    myChartUsers.value?.resize()
    myChartMap.value?.resize()
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

//定义大屏缩放比例
function getScale(w = 1920, h = 911) {
    const ww = window.innerWidth / w
    const wh = window.innerHeight / h
    return ww < wh ? ww : wh
}

onBeforeUnmount(() => {
    eventSource.onopen = null
    eventSource.onerror = null
    eventSource.onmessage = null
    eventSource.close()
})

const myChartSys = shallowRef()
const myChartArticle = shallowRef()
const myChartAdress = shallowRef()
const myChartUsers = shallowRef()
const myChartMap = shallowRef()

// 系统数据
const optionsSys = ref({
    grid: {
        show: true,
        left: '10%',
        right: '2%',
        top: '10%',
        bottom: '15%',
    },
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        axisLine: {
            lineStyle: {
                color: '#4fd2dd',
            },
        },
        data: ['访问数', '评论数', '留言数', '文章数'],
    },

    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#4fd2dd',
            },
        },
    },
    series: [
        {
            name: '全部',
            type: 'bar',
            data: [],
            label: {
                formatter: function (params) {
                    return params.value
                },
                show: true,
                position: 'top',
                fontWeight: 'bolder',
                fontSize: '12',
                color: '#4fd2dd',
            },
        },
        {
            name: '今天',
            type: 'bar',
            data: [],
            label: {
                formatter: function (params) {
                    return params.value
                },
                show: true,
                position: 'top',
                fontWeight: 'bolder',
                fontSize: '12',
                color: '#4fd2dd',
            },
        },
    ],
})
// 访客列表

const config = reactive({
    header: ['姓名', '城市', 'IP'],
    data: [
        ['行1列1', '行1列2', '行1列3'],
        ['行2列1', '行2列2', '行2列3'],
        ['行3列1', '行3列2', '行3列3'],
        ['行4列1', '行4列2', '行4列3'],
        ['行5列1', '行5列2', '行5列3'],
        ['行6列1', '行6列2', '行6列3'],
        ['行7列1', '行7列2', '行7列3'],
        ['行8列1', '行8列2', '行8列3'],
        ['行9列1', '行9列2', '行9列3'],
        ['行10列1', '行10列2', '行10列3'],
    ],
    index: true,
    columnWidth: [50],
    align: ['center'],
    headerBGC: '#5470c6',
})

// 文章类型分布
const optionsArticle = ref({
    tooltip: {
        trigger: 'item',
    },
    series: [
        {
            name: '文章类型数量',
            type: 'pie',
            radius: '80%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
            labelLine: {
                lineStyle: {
                    color: '#4fd2dd',
                },
            },
        },
    ],
})

// 地区分析
const optionsAdress = ref({
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '10%',
        right: '4%',
        bottom: '10%',
        top: '10%',
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLine: {
                lineStyle: {
                    color: '#4fd2dd',
                },
            },
        },
    ],
    yAxis: [
        {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#4fd2dd',
                },
            },
        },
    ],
    series: [
        {
            name: '城市访客数量',
            type: 'bar',
            barWidth: '60%',
            data: [],
            label: {
                formatter: function (params) {
                    return params.value
                },
                show: true,
                position: 'top',
                fontWeight: 'bolder',
                fontSize: '12',
                color: '#4fd2dd',
            },
        },
    ],
})

// 用户访问量分析

const optionsUsers = ref({
    grid: {
        left: '10%',
        right: '3%',
        bottom: '15%',
        top: '10%',
    },
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            lineStyle: {
                color: '#4fd2dd',
            },
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#4fd2dd',
            },
        },
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330],
            type: 'line',
            smooth: true,
        },
    ],
})

// 地图
const optionsMap = ref({
    tooltip: {
        trigger: 'item',
        formatter: function (e) {
            return e.seriesName + '<br />' + e.name + '：' + `${e.value || 0}`
        },
    },
    // 热力地图
    visualMap: {
        type: 'piecewise', //类型分为分段型和连续型
        show: true,
        splitNumber: 5,
        right: 20,
        bottom: 10,
        textStyle: {
            color: '#fff',
        },
        pieces: [
            //自定义每一段组件范围
            {gte: 100},
            {gte: 60, lt: 100},
            {gte: 30, lt: 60},
            {gte: 10, lt: 30},
            {gte: 0, lt: 10},
        ],
        color: ['#bf444c', '#d88273', '#f6efa6'],
        inRange: {
            symbol: 'rect', //组件类型
            color: ['#ffc0b1', 'red'], //组件颜色(根据数量不同 颜色深浅也不同)
        },
    },

    series: [
        {
            roam: true,
            data: [],
            type: 'map',
            map: 'china',
            name: '人数',
            zoom: 1.5,
            // 地图文字颜色
            label: {
                show: true,
                color: '#fff',
                fontSize: 10,
            },
            // 鼠标移入效果
            emphasis: {
                label: {
                    show: true,
                    color: '#fff',
                    fontSize: 26,
                    fontWeight: 'bold',
                },
            },
            itemStyle: {
                // 默认区域样式
                areaColor: 'transparent',
                borderColor: 'rgba(39,211,233, 1)',
                borderWidth: 1,
                color: '#fff',
            },
        },
    ],
})

const init = async () => {
    await nextTick()
    myChartSys.value = echarts.init(document.querySelector('.sys'))
    myChartArticle.value = echarts.init(document.querySelector('.article'))
    myChartAdress.value = echarts.init(document.querySelector('.adress'))
    myChartUsers.value = echarts.init(document.querySelector('.users'))
    myChartMap.value = echarts.init(document.querySelector('.map'))

    //获取数据大屏展示内容盒子的DOM元素
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

const getList = () => {
    api.screenList().then((res) => {
        let {sysList, visitor, article, area, user} = res.data
        // 系统数据
        optionsSys.value.series[0].data = sysList?.all
        optionsSys.value.series[1].data = sysList?.today
        myChartSys.value.setOption(optionsSys.value)

        // 访客列表
        let visitorArr = []
        visitor?.list.forEach((p) => {
            visitorArr.push([p.username || '游客', p.province || '-', p.ip || '-'])
        })
        config.data = visitorArr

        //   文章类型
        optionsArticle.value.series[0].data = article?.list
        myChartArticle.value.setOption(optionsArticle.value)

        // 地区分析

        optionsAdress.value.xAxis[0].data = area?.list.map((p) => p.province)
        optionsAdress.value.series[0].data = area?.list.map((p) => p.num)
        myChartAdress.value.setOption(optionsAdress.value)

        //   用户访问量

        optionsUsers.value.xAxis.data = user?.list.map((p) => p.username || '游客')
        optionsUsers.value.series[0].data = user?.list.map((p) => p.count || 0)
        myChartUsers.value.setOption(optionsUsers.value)
    })
}
</script>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
