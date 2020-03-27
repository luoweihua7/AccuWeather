const tencentcloud = require('tencentcloud-sdk-nodejs')

const ScfClient = tencentcloud.scf.v20180416.Client
const { UpdateFunctionConfigurationRequest } = tencentcloud.scf.v20180416.Models
const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

const { SECRET_ID, SECRET_KEY } = require('../config')

class Serverless {
  constructor() {
    //
  }

  /**
   * 更新环境变量
   * 注：这里需要传入所有的环境变量，否则会覆盖原来的变量信息
   * @param {string} region 区域，按照实际区域传入即可
   * @param {string} functionName 方法名，可以在入口的context.function_name获取到
   * @param {object} envArgs 环境参数，JSON对象，会自动转成 Key/Value 格式
   */
  async updateFunctionConfiguration(region = 'ap-hongkong', functionName = 'AccuWeather', envArgs = {}) {
    return await new Promise((resolve, reject) => {
      let cred = new Credential(SECRET_ID, SECRET_KEY)
      let httpProfile = new HttpProfile()
      let clientProfile = new ClientProfile()

      httpProfile.endpoint = 'scf.tencentcloudapi.com'
      clientProfile.httpProfile = httpProfile

      let client = new ScfClient(cred, region, clientProfile)
      let req = new UpdateFunctionConfigurationRequest()

      // 不明白开发者脑子想的什么，为什么不让传JSON，而是非要JSON.stringify
      let jsonString = JSON.stringify({
        FunctionName: functionName,
        Environment: {
          Variables: Object.keys(envArgs).map((key) => ({ Key: key, Value: envArgs[key] })),
        },
      })
      req.from_json_string(jsonString)

      client.UpdateFunctionConfiguration(req, function(errMsg, response) {
        if (errMsg) {
          console.log(errMsg)
          reject(new Error(errMsg))
          return
        }

        resolve(response.to_json_string())
      })
    })
  }
}

module.exports = new Serverless()
