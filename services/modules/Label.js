/**关于Label的操作 */
const Label = require('../../models/modules/Label')
const { pick } = require('../../utils/pick')
const validate = require('validate.js') // 验证
const { hasProperty } = require('../../utils/hasProperty')
const { countArticle } = require('./Article')
const rules = {
  tag: {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    length: {
      minimum: 1,
      maximum: 10,
      message: "must be length is 1 - 10",
    },
  }
}

// 获取全部标签
const getAllLabel = async () => {
  const result = await Label.findAll({
    attributes: ['tag', 'id']
  })

  return {
    code: '200',
    data: result.map(item => item.toJSON())
  }
}

// 新增标签
const addLabel = async (labelObj) => {
  labelObj = pick(labelObj, 'tag')

  try {
    await validate.async(labelObj, rules)
  } catch (error) {
    return {
      code: "400",
      msg: error
    }
  }
  const ins = Label.build(labelObj)
  const res = await ins.save()
  const result = res.toJSON()
  return {
    code: '200',
    data: result
  }
}

// 删除标签
const deleteLabel = async (labelId) => {
  if (!labelId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const res = await Label.destroy({
    where: {
      id: +labelId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  } else {
    return res ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  }
}

// 修改标签
const updateLabel = async (labelId, labelObj) => {
  if (!labelId || !hasProperty(labelObj)) {
    return {
      code: '400',
      msg: "label services 参数缺失"
    }
  }
  // 应该判断这个id存不存在


  try {
    await validate.async(labelObj, rules)
  } catch (error) {
    return {
      code: "400",
      msg: error
    }
  }
  const res = await Label.update(labelObj, {
    where: {
      id: +labelId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  } else {
    return res ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  }
}

// 获取所有标签下的文章数量
const labelCount = async () => {
  const allLabel = await getAllLabel()

  const result = await Promise.all(allLabel.data.map(async (item) => {
    const resultRes = await countArticle(item.id)
    return {
      ...item,
      count: resultRes.data
    }
  }))
  return {
    code: "200",
    data: result
  }
}
// const handleLabelId = (arr) => {
//   const temp = []
//   for (const item of arr) {
//     temp.push(item.id)
//   }
//   return temp
// }

module.exports = {
  addLabel,
  getAllLabel,
  deleteLabel,
  updateLabel,
  labelCount
}