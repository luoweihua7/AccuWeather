'use strict'
const Weather = require('./controller/accuweather')

exports.main_handler = async (event, context, callback) => {
  // 传入方法名，用于更新告警ID
  const weather = new Weather({ functioName: context.function_name })

  // 发送每日定时天气通知
  await weather.notify()

  // 随时发送天气预警
  await weather.alert()

  return { ret: 0 }
}
