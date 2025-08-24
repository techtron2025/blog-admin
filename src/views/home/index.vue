<template>
    <div class="home-box">
        <div class="home-box-header">
            <!-- <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">总访客</span>
                    <img style="width: 30px" src="../../assets/imgs/visitor.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.visitor }} 个</p>
                    <div class="dy dy-jc-b dy-ai-c f-mt-20">
                        <span>今日访客</span>
                        <span class="f-wb black">{{ tabInfo.currnetVisitor }} 个</span>
                    </div>
                </div>
            </div>

            <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">总留言</span>
                    <img style="width: 30px" src="../../assets/imgs/message.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.msg }} 条</p>
                    <div class="dy dy-jc-b dy-ai-c f-mt-20">
                        <span>今日留言</span>
                        <span class="f-wb black">{{ tabInfo.currnetMsg }} 条</span>
                    </div>
                </div>
            </div>

            <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">总评论</span>
                    <img style="width: 30px" src="../../assets/imgs/comment.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.coment }} 条</p>
                    <div class="dy dy-jc-b dy-ai-c f-mt-20">
                        <span>今日评论</span>
                        <span class="f-wb black">{{ tabInfo.currnetComent }} 条</span>
                    </div>
                </div>
            </div> -->

            <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">CPU使用率</span>
                    <img style="width: 30px" src="../../assets/imgs/rong.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.usedCpuRate }}</p>
                </div>
            </div>

            <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">总内存</span>
                    <img style="width: 30px" src="../../assets/imgs/rong.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.totalMemory }}</p>
                    <div class="dy dy-jc-b dy-ai-c f-mt-20">
                        <span>已用内存</span>
                        <span class="f-wb black">{{ tabInfo.usedMemory }}</span>
                    </div>
                </div>
            </div>

            <div class="item">
                <div class="top dy dy-jc-b dy-ai-c">
                    <span class="f-wb">jvm总内存</span>
                    <img style="width: 30px" src="../../assets/imgs/rong.png" alt="" />
                </div>

                <div class="bottom">
                    <p class="f-fs-20 f-wb black">{{ tabInfo.jvmTotalMem }}</p>
                    <div class="dy dy-jc-b dy-ai-c f-mt-20">
                        <span>jvm已用内存</span>
                        <span class="f-wb black">{{ tabInfo.jvmUsedMem }}</span>
                    </div>
                </div>
            </div>
        </div>

        <section class="home-box-content">
            <div class="left"></div>
            <div class="right"></div>
        </section>
    </div>
</template>

<script setup>
import echarts from '@/utils/echarts'
import {onMounted, ref, shallowRef} from 'vue'
import api from './api'

onMounted(() => {
    // getVisitorAdd()
    // window.onresize = () => resize()
    getSystemInfo()
    // getEchartList()
})

const tabInfo = ref({})
const getSystemInfo = () => {
    api.getSystemInfo().then((res) => {
        tabInfo.value = res.data
    })
}

const leftOption = ref({
    title: {
        text: '每周数据',
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['访客', '留言', '评论'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            name: '访客',
            type: 'line',
            smooth: true,
            data: [10, 15, 17, 23, 45, 47, 134],
        },
        {
            name: '留言',
            type: 'line',
            smooth: true,
            data: [1, 3, 7, 3, 0, 7, 9],
        },
        {
            name: '评论',
            type: 'line',
            smooth: true,
            data: [1, 4, 7, 9, 10, 0, 4],
        },
    ],
})

const rightOption = ref({
    title: {
        text: '热门城市',
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        top: '5%',
        left: 'center',
    },
    series: [
        {
            name: '热门城市排行',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: false,
            },
            data: [],
        },
    ],
})

const getEchartList = () => {
    api.echartList().then((res) => {
        let {city, week} = res.data

        leftOption.value.legend.data = week.map((p) => p.name)
        leftOption.value.series = week.map((p) => {
            return {
                name: p.name,
                type: 'line',
                data: p.list,
            }
        })

        rightOption.value.series[0].data = city

        init()
    })
}

const myChart1 = shallowRef()
const myChart2 = shallowRef()
const resize = () => {
    myChart1.value && myChart1.value.resize()
    myChart2.value && myChart2.value.resize()
}

const init = () => {
    myChart1.value = echarts.init(document.querySelector('.left'))
    myChart2.value = echarts.init(document.querySelector('.right'))
    // 绘制图表
    myChart1.value.setOption(leftOption.value)
    myChart2.value.setOption(rightOption.value)
}

// 新增访客
function getVisitorAdd() {
    api.visitorAdd().then((res) => {
        //   console.log(res)
    })
}
</script>

<style scoped lang="scss">
.home-box {
    height: 100%;
}
.home-box-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}
.item {
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    .top {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
}

.home-box-content {
    height: calc(100% - 160px);
    margin-top: 20px;
    display: flex;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 20px;
}
.left {
    width: 70%;
    height: 100%;
}
.right {
    flex: 1;
}
</style>
