const Redis = require('../services/redis')

const { STORE } = require('../config')

class Store {
  constructor() {
    this.init()
  }

  /**
   * 通过配置初始化存储
   * TODO：后续做成自动适配看看？
   */
  init() {
    let { type } = STORE
    let Model = null

    switch (type) {
      case 'redis':
        Model = Redis
        break
      default:
        break
    }

    if (!Model) {
      let opts = STORE[type]
      this.store = new Model(opts)
    } else {
      console.warn(`请至少选择一种存储类型，否则预警通知会重复发送`)
    }
  }

  /**
   * 获取预警信息
   */
  async getAlerts() {
    let value = []

    if (this.store) {
      value = await this.store.getAlerts()
    }

    return value
  }

  /**
   * 设置保存预警信息
   * @param {array} alerts 预警信息列表
   */
  async setAlerts(alerts = []) {
    if (!Array.isArray(alerts)) {
      throw new Error(`预警信息列表数据格式不正确`)
    }

    if (this.store) {
      await this.store.setAlerts(alerts)
    }
  }
}

module.exports = new Store()
