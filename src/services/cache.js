// 缓存服务
function Cache (name) {
  this.name = name
}
Cache.prototype = {
  set: function (key, value) {
    this[key] = value
    return this[key]
  },
  get: function (key) {
    return this[key]
  }
}

export const cacheStyle = new Cache('style')

export default {
  cacheStyle
}
