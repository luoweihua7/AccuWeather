const AccuWeatherService = require('../service/accuweather')
const ifttt = require('../service/ifttt')
const serverless = require('../service/serverless')

const date = require('../utils/date')
const string = require('../utils/string')
const { REGION, NOTIFY_TIMES, API_KEY, LOCATION_KEY, TIME_ZONE, ALERTS, DEBUG } = require('../config')

class AccuWeather {
  constructor({ functionName }) {
    this.functionName = functionName
    this.accuweather = new AccuWeatherService({ API_KEY, LOCATION_KEY, TIME_ZONE })
  }

  /**
   * 天气消息通知
   */
  async notify() {
    let now = new Date()
    let hour = date.formatDate(now, 'HH')
    let minute = date.formatDate(now, 'mm')

    // 检查是否在规定的时间点 (这里有坑，如果cron没能在规定的时间点上触发方法，则不会触发调用)
    let isValid = NOTIFY_TIMES.some((time) => string.isMatchOrUndefined(hour, time.hour) && string.isMatchOrUndefined(minute, time.minute))

    let weatherText
    if (isValid || DEBUG) {
      let { city, today, forecast } = await this.accuweather.getWeatherInfo()
      let forecasts = forecast
        .filter((day, index) => index < 3)
        .map((day) => `${day.date.split('-').pop()}号 ${day.weather}, 气温${day.temperature}度`)
        .join('\n')

      weatherText = `${city}${today.weather}, 温度${today.temperature}度\n${forecasts}`
    } else {
      this.log(`非设置的通知时间范围内，不进行天气通知`)
    }

    if (weatherText) {
      this.log(`发送IFTTT天气通知`, weatherText)
      await ifttt.send(weatherText)
    }
  }

  /**
   * 天气预警通知
   */
  async alert() {
    let list = await this.accuweather.getAlerts()

    if (Array.isArray(list)) {
      let splitComma = ','
      let ALERTED_LIST = ALERTS.split(splitComma)
      let alerts = list.filter((alert) => !ALERTED_LIST.includes(String(alert.AlertID)))

      if (alerts.length > 0) {
        // 有未做通知的预警，则发送
        let sendAsync = alerts.map(async (alert) => {
          let area = alert.Area[0]
          this.log(`发送IFTTT天气预警`, alert.AlertID, area.Summary)
          return await ifttt.send(area.Text)
        })

        await Promise.all([...sendAsync])
      } else {
        this.log(`无新的天气预警，已通知的天气预警ID：${ALERTS}`)
      }

      // 更新到环境变量中
      let alerted = list.map((alert) => alert.AlertID).join(splitComma)
      await serverless.updateFunctionConfiguration(REGION, this.functionName, { ALERTS: alerted })
    } else {
      this.log(`当前没有天气预警`)
    }
  }

  log(...args) {
    console.log(...args)
  }
}

module.exports = AccuWeather
