# AccuWeather 天气通知
[Tencent Serverless](https://console.cloud.tencent.com/scf) 下的天气通知服务，通过AccuWeather的天气接口（AccuWeather使用的是中国天气通的数据源）<br>
定时通过IFTTT通知天气信息，在有预警时随时下发通知预警

# 说明
将 `config.example.js` 复制一份并命名为 `config.js`，并修改文件 `config.js` 中的各项配置，然后部署到Serverless上<br>
在腾讯云对应云函数中，配置触发方式，建议配置为 `每5分钟（每5分钟的0秒执行一次）`<br>
天气预警，会更新到函数的环境变量上，方便下次调用时，可以过滤已经通知过的预警
