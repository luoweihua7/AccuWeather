module.exports = {
  // 存储，使用函数配置存储会有问题
  STORE: {
    type: 'redis', // 暂时只支持redis
    redis: {
      host: '',
      port: '6379',
      password: '',
    },
  },

  // AccuWeather配置
  ACCUWEATHER: {
    apiKey: '',
    locationKey: '', // 城市ID
    timezone: 'Asia/Shanghai', // 时区
    days: 3, // 预报几天，可选1～5天
  },

  // IFTTT 通知设置，可通知到多个Webhook
  IFTTT: {
    key: '', // IFTTT通知的KEY，在 https://ifttt.com/maker_webhooks 右上角的 Document 按钮获取
    title: '天气通知',
    icon: '【天气图标的链接地址】',
  },

  // 定时触发必须要覆盖到下面的所有时间节点，例如触发器设置为每5分钟触发一次（0 */5 * * * * *），这样可以覆盖 8:25 和 21:35 这样的时间点
  NOTIFY_TIMES: [
    { hour: '09', minute: '00' },
    { hour: '21', minute: '00' },
  ],
}
