const AccuWeatherService = require('../services/accuweather')
const { ACCUWEATHER } = require('../config')

class AccuWeather {
  constructor() {
    this.weather = new AccuWeatherService(ACCUWEATHER)
  }

  /**
   * 天气预报
   */
  async forecast() {
    let [currentconditions, forecasts, locations] = await Promise.all([this.weather.currentconditions(), this.weather.forecasts(), this.weather.locations()])

    // 信息处理
    let { city: _city } = locations
    let { weather: _weather, temperature: _temperature } = currentconditions
    let days = Math.max(ACCUWEATHER.days || 0, 1) || 3 // 预报天数，默认3天
    let _forecasts = forecasts
      .filter((day, index) => index < days)
      .map((day) => {
        return `${day.date.split('-').pop()}号 ${day.weather}, 气温${day.temperature}度`
      })
      .join('\n')

    // 组装
    let message = `${_city}${_weather}, 温度${_temperature}度\n${_forecasts}`
    return message
  }

  /**
   * 天气预警
   */
  async alerts() {
    let alerts = await this.weather.alerts()

    return alerts
  }
}

module.exports = new AccuWeather()
