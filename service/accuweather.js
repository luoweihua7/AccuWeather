const moment = require('moment-timezone')
const AccuWeatherModule = require('../module/accuweather')

class AccuWeather {
  constructor({ API_KEY, LOCATION_KEY, TIME_ZONE }) {
    this.TIME_ZONE = TIME_ZONE
    this.accuweather = new AccuWeatherModule({ apiKey: API_KEY, locationKey: LOCATION_KEY })
  }

  transform([[today], { DailyForecasts }, alerts, { LocalizedName }]) {
    let tz = this.TIME_ZONE
    // lastUpdate
    let lastUpdate = moment(today.EpochTime * 1000)
      .tz(tz)
      .format('YYYY-MM-DD HH:mm:ss')

    // today
    let weather = {
      icon: today.WeatherIcon,
      temperature: `${Math.round(today.Temperature.Metric.Value)}°`,
      weather: today.WeatherText,
    }

    // forecast
    let forecasts = []
    let hour = new Date().getHours()

    DailyForecasts.forEach((item, index) => {
      let [day, night, temperature] = [item.Day, item.Night, item.Temperature]
      let minTemp = Math.round(temperature.Minimum.Value)
      let maxTemp = Math.round(temperature.Maximum.Value)

      if (temperature.Minimum.Unit === 'F') {
        minTemp = this.f2c(minTemp)
      }

      if (temperature.Maximum.Unit === 'F') {
        maxTemp = this.f2c(maxTemp)
      }

      // day or night
      let info = 6 < hour && hour < 18 ? day : night

      forecasts.push({
        ts: item.EpochDate * 1000,
        date: moment(item.EpochDate * 1000)
          .tz(tz)
          .format('YYYY-MM-DD'),
        icon: info.Icon,
        weather: info.IconPhrase,
        temperature: `${minTemp}~${maxTemp}`,
      })
    })

    // alert
    let alert = null
    if (Array.isArray(alerts)) {
      // filter newest alert
      alerts.forEach((item) => {
        let area = item.Area[0]
        // let link = item.Link;
        let lastUpdate = (alert && alert.publishDate) || 0
        let currentUpdate = area.EpochStartTime * 1000

        if (currentUpdate > lastUpdate) {
          alert = {
            info: item.Description.Localized,
            publishDate: moment(currentUpdate)
              .tz(tz)
              .format('YYYY-MM-DD HH:mm:ss'),
            color: item.Color.Hex,
            colorName: item.Color.Name,
            details: area.Text,
            summary: area.Summary,
            // link: link
          }
        }
      })
    }

    return {
      city: LocalizedName,
      lastUpdate: lastUpdate,
      today: weather,
      forecast: forecasts,
      alert: alert,
    }
  }

  /**
   * 天气告警，随时发送
   */
  async getAlerts() {
    return await this.accuweather.alerts()
  }

  /**
   * 定时通知，在配置的时间点发送通知
   */
  async getWeatherInfo() {
    let weather = this.accuweather
    let ret = await Promise.all([
      weather.currentconditions(),
      weather.forecast({ type: 'daily', day: '5day' }),
      weather.alerts(),
      weather.locations(),
    ])

    return this.transform(ret)
  }
}

module.exports = AccuWeather
