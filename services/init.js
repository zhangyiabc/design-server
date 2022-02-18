const User = require('../models/modules/User')
const Label = require('../models/modules/Label')
const Article = require('../models/modules/Article')
const Comment = require('../models/modules/Comment')
const validate = require('validate.js')

validate.validators.UserIsExist = async (value) => {
  const c = await User.findByPk(+value);
  // console.log("16", c);
  if (c) {
    return;
  } else {
    // console.log("在这里，没有拿到用户")
    return "can't find";
  }
};

// 验证标签是否存在
validate.validators.LabelIsExist = async (value) => {
  if (!value) {
    return
  }
  const c = await Label.findByPk(value);
  if (c) {
    return;
  } else {
    return "can't find";
  }
};

// 验证文章是否存在
validate.validators.ArticleIsExist = async (value) => {
  if(!value){
    return 
  }
  const c = await Article.findByPk(+value)
  if (c) {
    return;
  } else {
    return "can't find";
  }
}

// 验证评论是否存在
validate.validators.CommentIsExist = async (value) => {
  if(!value){
    return 
  }
  const c = await Comment.findByPk(+value)
  if (c) {
    return;
  } else {
    return "can't find";
  }
}