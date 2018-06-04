// 业务服务的封装
import http from './http.js'
import tool from '../utils/tool.js'
// 域名
const ENV = 'dev'  // 'prod'
const host = {
  openapi: {
    dev: 'https://openapi.dev.versa-ai.com',
    prod: 'https://openapi.versa-ai.com'
  },
  upload: {
    dev: 'https://versa-static.oss-cn-shanghai.aliyuncs.com',
    prod: 'https://versa-static.oss-cn-shanghai.aliyuncs.com'
  },
  download: {
    dev: 'https://static01.versa-ai.com',
    prod: 'https://static01.versa-ai.com'
  }
}
// 获取域名
function getHost (type = 'openapi') {
  return host[type][ENV]
}
// 基础服务
export const base = {
  uploadToken: function () {
    const reqData = {
      url: `${getHost()}/web/upload/uploadPolicy`,
      data: {
        clientType: 'mini-program',
        fileType: 'image',
        filename: 'image.png'
      },
      method: 'GET',
      dataType: 'json'
    }
    return http.request(reqData)
  },
  // 通过login的code鉴权获取session
  auth: function (code) {
    const reqData = {
      url: `${getHost()}/web/user/auth/wechat/mini`,
      data: {
        code
      },
      method: 'POST',
      dataType: 'json'
    }
    return http.commonRequest(reqData)
  }
}

//  风格迁移
export const styleTransfer = {
  demo: function (option) {
    const {query = {}, data = {}} = option || {}
      // url = getUrl(url,params)
      // return http.httpGet(url)
    const map = ['MA==', 'MQo=', 'Mg==', 'Mw==', 'NA==', 'NQ==', 'Ng==', 'Nw==', 'OA==', 'OQ==']
    const queryData = Object.assign({
      time: 1,
      t: 'css',
      c: map[3],
      i: 3
    }, query)
    const url = tool.formatQueryUrl('https://www.madcoder.cn/tests/sleep.php', queryData)
    const reqData = {
      url,
      method: 'POST',
      data: data,
      responseType: 'text'
    }
    return http.request(reqData)
  },
  upload: async function () {
    // 上传图片
    console.log('get uploadToken')
    try {
      const {data} = await base.uploadToken()
      // const token = data.result
      console.log('token-data', data)
    } catch (err) {
      console.log('get-uploadToken fail', err)
    }
    // return token
  }
}

export default {
  styleTransfer,
  base
}
