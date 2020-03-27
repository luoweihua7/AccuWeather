const IFTTT = require('../modules/ifttt')

module.exports = class IFTTTService {
  /**
   * 初始化IFTTT
   * @param {object} param 初始化参数
   */
  constructor({ key, value1, value2, value3 }) {
    this.ifttt = new IFTTT({ key, value1, value2, value3 })
  }

  /**
   * 发送消息到IFTTT
   * @param {string} text 通知的消息
   */
  async send(text) {
    await this.ifttt.send('notification', { value2: text || '' })
  }
}
