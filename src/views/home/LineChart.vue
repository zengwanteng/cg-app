<template>
    <div>
        
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                lineColors: ["#9E87FF", '#73DDFF', '#fe9a8b'],
                lineChart: null
            }
        },

        methods: {
            renderLineChart(data) {

                // 通过遍历和数据截取得到x轴的文字
                let xAxisName = [],
                    seriesData = {
                        data0: [],
                        data1: [],
                        data2: []
                    }

                for (let item of data) {
                    xAxisName.push(item.date.substring(5))
                    seriesData.data0.push(item.received)
                    seriesData.data1.push(item.receiving)
                    seriesData.data2.push(item.total)
                }

                // 通过遍历得到series
                let names = ['已收', '未收', '应收'],
                    myColors = [
                        ['#9effff', '#9E87FF', 'rgba(158,135,255, 0.3)'],
                        ['#73DD39', '#73DDFF', 'rgba(115,221,255, 0.3)'],
                        ['#fe9a', '#fe9a8b', 'rgba(254,154,139, 0.3)']
                    ]

                let series = names.map((name, i) => {
                    return {
                            name,
                            type: 'line',
                            data: seriesData[`data${i}`],
                            symbolSize: 1,
                            symbol: 'circle',
                            smooth: true,
                            yAxisIndex: 0,
                            showSymbol: false,
                            lineStyle: {
                                width: 2,
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: myColors[i][0]
                                    },
                                    {
                                        offset: 1,
                                        color: myColors[i][1]
                                    }
                                ]),
                                shadowColor: myColors[i][2],
                                shadowBlur: 3,
                                shadowOffsetY: 10
                            },
                            itemStyle: {
                                normal: {
                                    color: this.lineColors[i],
                                    borderColor: this.lineColors[i]
                                }
                            }
                        }
                })

                // 配置渲染数据
                let option = {
                    legend: {
                        icon: 'circle',
                        top: 4,
                        itemWidth: 6,
                        itemGap: 20,
                        textStyle: {
                            color: '#556677'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 30,
                        left: 50,
                        bottom: 36,
                        right: 30
                    },
                    xAxis: [{
                        type: 'category',
                        data: xAxisName,
                        axisLine: {
                            lineStyle: {
                                color: '#DCE2E8'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#556677'
                            },
                            fontSize: 12,
                            margin: 15
                        },
                        boundaryGap: false
                    }],
                    yAxis: [{
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#DCE2E8'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#556677'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    series
                }

                // 调用setOption方法来执行渲染
                this.lineChart.setOption(option)
            }
        }
    }
</script>