export const getDefaultGraphOptions = () => ({
  chart: {
    width: 190,
    height: 160,
    type: 'donut',
    events: {}
  },
  colors: [
    '#7DA9F1',
    '#A2DC9F',
    '#EFC86E',
    '#EF7E6E',
    '#AC79EA',
    '#B0C4DE'
  ],
  plotOptions: {
    pie: {
      customScale: 0.8,
      expandOnClick: false
    }
  },
  legend: {
    position: 'right',
    offsetY: 5,
    height: 135,
    width: 120,
    fontSize: '10px'
  },
  noData: {
    text: 'データがありません'
  },
  title: {
    text: '',
    align: 'center',
    offsetY: -5,
    offsetX: -20,
    style: {
      fontSize: '18px'
    }
  },
  labels: [],
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: () => {
        return null
      },
      title: {
        formatter: (seriesName, { series, seriesIndex, dataPointIndex }) => {
          const per = series[seriesIndex] / series.reduce((a, b) => { return (a + b) }) * 100
          return seriesName + '：' + series[seriesIndex] + ' ( ' + per.toFixed(1) + '% )'
        }
      }
    }
  }
})
