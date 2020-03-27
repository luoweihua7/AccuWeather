# AccuWeather 天气通知
Tencent Serverless下的天气通知服务，通过AccuWeather的天气接口（AccuWeather使用的是中国天气通的数据源）<br>
定时通过IFTTT通知天气信息，在有预警时随时下发通知预警

# 说明
将 `config.example.js` 复制一份并命名为 `config.js`，修改文件 `config.js` 中的各项配置，然后部署到Serverless上即可<br>
天气预警，会更新到函数的环境变量上，方便下次调用时，可以过滤已经通知过的预警

# 已知问题
Serverless在短时间内连续调用，旧实例并不会销毁，导致无法获取到上一次调用后更新的环境变量，会触发多次预警通知