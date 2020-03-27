const axios = require('axios')

module.exports = class IFTTT {
  /**
   * IFTTT
   * @param {object} options Parameter
   * @param {string} options.key IFTTT Webhook key
   * @param {string} [options.value1] Webhook value1
   * @param {string} [options.value2] Webhook value2
   * @param {string} [options.value3] Webhook value3
   */
  constructor(options) {
    if (!options.key) {
      throw new Error(`Parameter key required! IFTTT require webhook key.`)
    }

    this.options = options
  }

  getValidParams(options = {}) {
    let paramList = ['value1', 'value2', 'value3']
    let params = {}

    paramList.forEach((key) => {
      if (typeof options[key] === 'string') {
        params[key] = options[key]
      }
    })
    return params
  }

  /**
   * Invoke IFTTT service
   * @param {string} eventName IFTTT Webhook event name
   * @param {object} options Webhook request options
   * @param {string} [options.value1] Webhook value1
   * @param {string} [options.value2] Webhook value2
   * @param {string} [options.value3] Webhook value3
   */
  async invoke(eventName, options) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error(`Parameter eventName required, and must be string.`)
    }

    let params = { ...this.getValidParams(this.options), ...this.getValidParams(options) }
    if (Object.keys(params).length === 0) {
      // at least require value1 or value2 or value3
      throw new Error(`Parameter options required`)
    }

    let url = `https://maker.ifttt.com/trigger/${eventName}/with/key/${this.options.key}`
    let { status, data } = await axios.post(url, params)

    if (status !== 200) {
      throw new Error(`Request IFTTT service error, status = ${status}`)
    }

    return data
  }
}
