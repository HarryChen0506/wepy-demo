const tool = {
  uuid: function () { // 生产uuid
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
  },
  getUrlQuery: function (url = '') {
    const query = {}
    if (url.indexOf('?') !== -1) {
      const str = url.substr(url.indexOf('?'))
      const result = str.split('&')
      for (let i = 0; i < result.length; i++) {
        query[result[i].split('=')[0]] = decodeURIComponent(result[i].split('=')[1])
      }
    }
    return query
  },
  formatDate: function (fmt, date) { // 时间格式化
    date = new Date(date)
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  },
  toObject: function (arr) {
    var res = {}
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        for (let key in arr[i]) {
          res[key] = arr[i][key]
        }
      }
    }
    return res
  },
  formatUrl: function (path, options = {}) {
    let url
    const { params = {}, query = {} } = options
    // 编译params
    // if(Object.keys(params).length>0){
    //   paramsUrl = formatParamsUrl(path, params);
    // }else{
    //   paramsUrl = path
    // }
    const paramsUrl = formatParamsUrl(path, params)
    // 编译query
    if (Object.keys(query).length > 0) {
      url = formatQueryUrl(paramsUrl, query)
    } else {
      url = paramsUrl
    }
    return url
  },
  formatQueryUrl: formatQueryUrl,
  deepClone: deepClone,
  isEmpty: function (obj) {
    // 判断字符是否为空的方法
    if (typeof obj === 'undefined' || obj === null || obj === '') {
      return true
    }
    return false
  },
  isRepeat: function (arr) {
    var hash = {}
    for (var i in arr) {
      if (hash[arr[i]]) {
        return true
      }
      hash[arr[i]] = true
    }
    return false
  }
}

/**
 * @description 编译带有占位符的路径  /demo/:id/foo
 * @param {string} path 路径
 * @param {string} params 参数
 * @return {string} 新的路径
 */
function formatParamsUrl(path = '', params = {}) {
  const pattern = /\/(:[^\/\?]+)/g
  path = path.replace(pattern, function(result, $1) {
    return params[$1.slice(1)] ? `/${params[$1.slice(1)]}` : `/${$1}`
  })
  if (pattern.test(path)) {
    // console.log('params还有未匹配的项目')
    throw new Error('params还有未匹配的项目')
  }
  return path
}

function formatQueryUrl(path = '', query = {}) {
  let url = ''
  if (Object.keys(query).length > 0) {
    url = paddStringToUrl(path) + encodeToURIString(query)
  } else {
    url = path
  }
  return url
}
/**
 * @description encodeToURIString 把一个对象类型转化为问号参数类型的字符串
 * @param {object} data 要解析的对象
 * @param {boolean} isUIR 是否转化为URIComponent，默认转化，只有当值为false时，不转化
 * @return {string} 问号参数类型的字符串
 */
function encodeToURIString(data, isUIR) {
  // 默认参数isUIR不为false，值皆为true
  if (isUIR !== false) {
    isUIR = true
  }
  const ary = []
  // url编码
  function encodeString(str, isUIR) {
    return isUIR ? encodeURIComponent(str) : str
  }
  if (Object.prototype.toString.call(data) === '[object Object]') {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (Array.isArray(data[key])) {
          data[key].forEach(function(v) {
            ary.push(key + '=' + encodeString(v, isUIR))
          })
        } else {
          ary.push(key + '=' + encodeString(data[key], isUIR))
        }
      }
    }
  }
  return ary.join('&')
}

/**
 * @description paddStringToUrl 将对象转化为问号参数形式添加在url地址的后面，会进行URI编码处理
 * @param {string} url 原url地址
 * @return {string} 返回拼接好的新url地址
 */
function paddStringToUrl(url) {
  const hasSearch = /\?/.test(url)
  return url + (hasSearch ? '&' : '?')
}

/**
 * @description 深拷贝
 * @param {*} obj 目标对象
 * @return {*} 返回的深拷贝对象
 */
function deepClone (obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let objArray = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key])
        } else {
          objArray[key] = obj[key]
        }
      }
    }
  }
  return objArray
}

export default tool
