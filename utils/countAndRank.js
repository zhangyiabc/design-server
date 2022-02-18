const { countArticle } = require('../services/modules/Article')
/**
 * 根据每一项数据获取该用户的发布文章数量以及排名
 * 处理排名
 * @param {array} arr 
 * 返回一个数组
 */
const countAndRank = async (arr, key) => {
  const rankArr = []
  const temp = await Promise.all(arr.map(async (item) => {
    return await countHelper(item, key)
  }))
  temp.forEach((item) => {

    if (!rankArr.includes(item.count)) {
      rankArr.push(item.count)
    }
  })
  rankArr.sort((a, b) => b - a)
  const result = temp.map((item) => {

    return {
      ...item,
      rank: rankArr.indexOf(+item.count) + 1
    }
  })
  return result
}

/**
 * 获取文章数量
 * @param {object} obj 
 */
const countHelper = async (obj, key) => {
  let count
  console.log(obj.id)
  if (key === 'user') {
    count = await countArticle(null, obj.id)
  } else {
    count = await countArticle(null, obj.UserId)
  }

  return {
    ...obj,
    count: count.data
  }
}

module.exports = {
  countAndRank
}