// 业务服务的封装
import http from './http.js'
import tool from '../utils/tool.js'
import wepy from 'wepy'
// 域名
// const ENV = 'dev'  // 'dev' 测试
const ENV = 'prod'  // 'prod' 生产
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
  // 管理上传token
  getUploadToken: async function () {
    let token = wx.getStorageSync('token')
    if (token && token.expire > Date.now()) {
      return token
    }
    try {
      const data = await base.uploadToken()
      token = data && data.result
      wx.setStorageSync('token', token)
      return token
    } catch (err) {
      console.log('get uploadToken fail', err)
    }
  },
  upload: async function (filePath) {
    // 上传图片
    // filePath 本地图片路径
    const token = await base.getUploadToken()
    const imgName = tool.createImgName(16)
    token.params.key = `upload/mini-program/transfer/${imgName}.png`
    // console.log('token', token)
    let {data} = await wepy.uploadFile({
      filePath,
      name: 'file',
      url: token.host,
      formData: token.params
    })
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
        data.host = 'https://static01.versa-ai.com/'
        data.url = data.host + data.picurl
      } catch (err) {
        console.log('upload image string parse to json fail !!!')
      }
    }
    return data
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
  segment: function (remoteImgUrl, styleId, originalColors) {
    // remoteImgUrl 远程静态服务器图片地址
    // styleId 渲染风格Id
    // originalColors 原色 ,不传默认为风格色
    const reqData = {
      method: 'POST',
      url: `${getHost()}/web/image/render/segment`,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {
        clientType: 'mini-program',
        timestamp: Date.parse(new Date()),
        imageUrl: remoteImgUrl,
        styleId
      }
    }
    if (originalColors) {
      reqData.data.originalColors = 'Y'
    }
    return http.request(reqData)
  },
  tagList: function () {
    // 获取风格标签列表
    const reqData = {
      method: 'GET',
      url: `${getHost()}/web/feature/featureTagOrder`,
      dataType: 'json',
      data: {
        clientType: 'mini-program'
      }
    }
    return http.request(reqData)
  },
  styleList: function () {
    const reqData = {
      method: 'GET',
      url: `${getHost()}/web/feature/featureDetail`,
      dataType: 'json',
      data: {
        renderType: 'transfer-image',
        clientType: 'mini-program'
      }
    }
    return http.request(reqData)
  }
}

export default {
  styleTransfer,
  base
}
