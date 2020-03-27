const IFTTT = require('../module/ifttt')
const { IFTTT_KEY, IFTTT_TITLE, IFTTT_ICON } = require('../config')

class Notify {
  constructor() {
    this.ifttt = new IFTTT({ key: IFTTT_KEY, value1: IFTTT_TITLE, value3: IFTTT_ICON })
  }

  async send(text) {
    await this.ifttt.invoke('notification', { value2: text || '' })
  }
}

module.exports = new Notify()
