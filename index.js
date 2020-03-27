'use strict'
const weather = require('./controllers/accuweather')
const store = require('./controllers/store')
const ifttt = require('./controllers/ifttt')
const string = require('./utils/string')
const date = require('./utils/date')
const { NOTIFY_TIMES } = require('./config')

const sendWeatherReport = async () => {
  // 检查是否是配置的天气预报发送时间
  let now = new Date()
  let hour = date.formatDate(now, 'HH')
  let minute = date.formatDate(now, 'mm')
  let isSendTime = NOTIFY_TIMES.some((time) => string.isMatchOrUndefined(hour, time.hour) && string.isMatchOrUndefined(minute, time.minute))

  // 定时天气预报
  if (isSendTime) {
    let weatherReport = await weather.forecast()
    await ifttt.send(weatherReport)
    console.log(weatherReport)
  } else {
    console.log(`未在指定时间范围内，不发送天气预报`)
  }
}

const sendWeatherAlert = async () => {
  let [last = [], fresh = []] = await Promise.all([store.getAlerts(), weather.alerts()])

  // 处理过的数据
  let lastIdList = []
  let lastSummaryList = []

  last.forEach(({ id, summary }) => {
    lastIdList.push(Number(id))
    lastSummaryList.push(summary)
  })

  // 逐条判断预警是否已发送，并发送未预警的通知
  let alerts = []
  if (fresh.length > 0) {
    fresh.forEach(async ({ id, summary }) => {
      if (!lastIdList.includes(id) && !lastSummaryList.includes(summary)) {
        // 未包含已经通知过的AlertID，以及预警信息文本也没有通知过
        // 注：这里AccuWeather返回的预警信息中，会出现预警文本Summary相同，而AlertID会不同

        await ifttt.send(summary)
        console.log(`已发送IFTTT通知预警${id}：${summary}`)
      } else {
        console.log(`过滤已通知预警${id}：${summary}`)
      }

      alerts.push({ id, summary })
    })
  } else {
    console.log(`没有新的天气预警信息`)
  }

  await store.setAlerts(alerts)
}

exports.main_handler = async (event, context, callback) => {
  await sendWeatherReport()
  await sendWeatherAlert()

  return { ret: 0 }
}
