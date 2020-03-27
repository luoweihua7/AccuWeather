const moment = require('moment-timezone')
const AccuWeatherModule = require('../modules/accuweather')

const { f2c } = require('../utils/units')

module.exports = class AccuWeatherService {
  constructor({ apiKey, locationKey, timezone }) {
    this.timezone = timezone
    this.accuweather = new AccuWeatherModule({ apiKey, locationKey })
  }

  /**
   * 获取城市的天气基本信息
   */
  async currentconditions() {
    let [data] = await this.accuweather.currentconditions()
    let today = {
      lastupdate: moment(data.EpochTime * 1000) // 最后更新时间
        .tz(this.timezone)
        .format('YYYY-MM-DD HH:mm:ss'),
      icon: data.WeatherIcon, // 天气图标
      temperature: `${Math.round(data.Temperature.Metric.Value)}`, // 温度
      weather: data.WeatherText, // 天气描述
    }

    return today
  }

  /**
   * 获取城市的天气预报信息，默认为5天
   */
  async forecasts() {
    let hour = new Date().getHours()
    let { DailyForecasts: days } = await this.accuweather.forecasts()

    // 转换
    let _forecasts = days.map(({ Day: day, Night: night, Temperature: temperature, EpochDate: datetime }) => {
      let minTemp = Math.round(temperature.Minimum.Value)
      let maxTemp = Math.round(temperature.Maximum.Value)

      if (temperature.Minimum.Unit === 'F') {
        minTemp = f2c(minTemp)
      }
      if (temperature.Maximum.Unit === 'F') {
        maxTemp = f2c(maxTemp)
      }

      let info = 6 < hour && hour < 18 ? day : night

      return {
        datetime: datetime * 1000, // 时间
        date: moment(datetime * 1000) // 时间，格式化后
          .tz(this.timezone)
          .format('YYYY-MM-DD'),
        icon: info.Icon, // 天气图标
        weather: info.IconPhrase, // 天气描述
        temperature: `${minTemp}~${maxTemp}`, // 温度范围
      }
    })

    return _forecasts
  }

  /**
   * 获取城市位置信息
   */
  async locations() {
    let data = await this.accuweather.locations()

    let _location = {
      id: data.Key, // 城市ID
      city: data.LocalizedName, // 城市名
      region: data.Region.LocalizedName, // 大洲
      country: data.Country.LocalizedName, // 国家
      province: data.AdministrativeArea.LocalizedName, // 省份
    }

    return _location
  }

  /**
   * 获取城市天气预警信息
   */
  async alerts() {
    let _alerts = await this.accuweather.alerts()
    let alertList = []

    if (Array.isArray(_alerts)) {
      alertList = _alerts
        .map((alert) => {
          return {
            id: Number(alert.AlertID), // 告警ID
            summary: alert.Area && alert.Area[0] && alert.Area[0].Text, // 告警信息
            level: alert.Level, // 告警等级，一般为红色，橙色等几种
            source: alert.Source, // 来源
          }
        })
        .sort((a, b) => a.id - b.id)
    }

    return alertList
  }
}
