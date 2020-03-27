const IFTTTService = require('../services/ifttt')
const { IFTTT: conf } = require('../config')

class IFTTT {
  constructor() {
    this.ifttt = new IFTTTService({
      key: conf.key,
      value1: conf.title,
      value3: conf.icon,
    })
  }

  /**
   * 通过IFTTT服务发送推送消息
   * @param {string} text 需要发送的消息内容
   */
  async send(text) {
    await this.ifttt.send(text)
  }
}

module.exports = new IFTTT()
