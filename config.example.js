module.exports = {
    // debug 开关，开启会有一些调试console，且无视NOTIFY_TIMES配置下发通知
    DEBUG: false,
  
    // Tencent Cloud Config
    REGION: 'ap-hongkong', // 区域，具体查看这里 https://cloud.tencent.com/document/product/583/17238#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8
    SECRET_ID: '',
    SECRET_KEY: '',
  
    // AccuWeather Config
    API_KEY: '', // AccuWeather的开发者KEY
    LOCATION_KEY: 58194, // 城市ID
    TIME_ZONE: 'Asia/Shanghai', // 时区
    NOTIFY_TIMES: [
      // 定时触发必须要覆盖到下面的所有时间节点，例如触发器设置为每5分钟触发一次（0 */5 * * * * *），这样可以覆盖 8:25 和 21:35 这样的时间点
      { hour: '09', minute: '00' },
      { hour: '21', minute: '00' },
    ],
  
    // IFTTT Config
    IFTTT_KEY: '', // 在 https://ifttt.com/maker_webhooks 右上角点击 Documentation 按钮
    IFTTT_TITLE: '天气通知',
    IFTTT_ICON: 'https://i.loli.net/2020/01/10/ZiEQzbLFSmoag3O.png',
    ALERTS: process.env.ALERTS || '', // 已发送的预警，避免重复发送，会自动更新到环境变量上
  }
  