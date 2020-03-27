const Redis = require('ioredis')

class RedisStore {
  constructor({ host, port, password }) {
    this.redis = new Redis({ host, port, password })
    this._key = 'alerts'
  }

  /**
   * 获取最后保存的预警ID列表
   */
  async getAlerts() {
    let list = await this.redis.lrange(this._key, 0, -1)

    if (list && list.length > 0) {
      try {
        list = list.map((item) => JSON.parse(item))
      } catch (e) {
        console.error(`从Redis中获取数据后转换失败`, e.message)
        list = []
      }
    }

    return list
  }

  async setAlerts(alerts = []) {
    if (!Array.isArray(alerts)) {
      throw new Error(`预警信息列表类型错误`)
    }

    let list = alerts.map((item) => JSON.stringify(item))

    await this.redis.ltrim(this._key, 1, 0) // 清理旧数据，
    let ret = await this.redis.rpush(this._key, list) // 保存新数据

    return ret
  }

  async quit() {
    return await this.redis.quit()
  }
}

module.exports = RedisStore
