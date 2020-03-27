const axios = require('axios')

module.exports = class IFTTT {
  constructor({ key, value1, value2, value3 }) {
    if (!key) {
      throw new Error(`[IFTTT] 参数key不能为空`)
    }

    this.key = key
    this.defaults = { value1, value2, value3 }
  }

  async send(eventName, { value1, value2, value3 } = {}) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error(`[IFTTT] 参数eventName必须是字符串且不能为空`)
    }

    let opts = JSON.parse(JSON.stringify({ value1, value2, value3 })) // 去掉无效的undefined字段
    let params = { ...this.defaults, ...opts }

    let { data } = await axios.post(`https://maker.ifttt.com/trigger/${eventName}/with/key/${this.key}`, params)
    return data
  }
}
