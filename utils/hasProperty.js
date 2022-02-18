/**
 * 判断一个对象当中有没有属性
 * @param {Object} obj 
 */
const hasProperty = (obj) => {
  const keys = Object.keys(obj)
  return keys.length > 0
}

module.exports = {
  hasProperty
}