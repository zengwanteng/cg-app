export default {
    data() {
        return {
            pieChart: null
        }
    },

    methods: {
        renderPieChart(data, index = 0) {

            // 递归展示
            let item = data[index]

            let option = {
                title: [
                  {
                   text: '已付',
                      left: '25%',
                      top: '48%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 14,
                          fontWeight: '400',
                          color: '#5c5a68',
                          textAlign: 'center',
                      },
                  },
                   {
                    text: '未付',
                      left: '75%',
                      top: '48%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 14,
                          fontWeight: '400',
                          color: '#5c5a68',
                          textAlign: 'center',
                      },
                  },

                  {
                      text: `${item.paid}元`,
                      x: '25%',
                      y: '37%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 24,
                          fontWeight: '100',
                          color: '#ff5513',
                          textAlign: 'center',
                      },
                  },
                  {
                      text: `${item.payable}元`,
                      x: '75%',
                      y: '37%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 24,
                          fontWeight: '100',
                          color: '#ff5513',
                          textAlign: 'center',
                      },
                  },

                  {
                      text: item.date,
                      left: '25%',
                      top: '57%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 12,
                          fontWeight: '400',
                          color: '#484556',
                          textAlign: 'center',
                      },
                  },
                  {
                      text: item.date,
                      left: '75%',
                      top: '57%',
                      textAlign: 'center',
                      textStyle: {
                          fontSize: 12,
                          fontWeight: '400',
                          color: '#484556',
                          textAlign: 'center',
                      },
                  }
                ],
                series: [
                  {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['52%', '46%'],
                    center: ['25%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderColor: '#fff',
                      borderWidth: 2
                    },
                    label: {
                      show: false,
                      position: 'center'
                    },
                    labelLine: {
                      show: false
                    },
                    data: [item.paid, item.total]
                  },
                  {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['52%', '46%'],
                    center: ['75%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderColor: '#fff',
                      borderWidth: 2
                    },
                    label: {
                      show: false,
                      position: 'center'
                    },
                    labelLine: {
                      show: false
                    },
                    data: [item.payable, item.total]
                  }
                ]
            }
            
            // 执行渲染
            this.pieChart.setOption(option)

            setTimeout(() => {
                ++index
                this.renderPieChart(data, index < data.length ? index : 0)
            }, 2000)
        }
    }
}