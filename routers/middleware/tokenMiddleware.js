// 处理验证token的中间件
const { pathToRegexp } = require("path-to-regexp");
const { handleSend } = require('../../utils/resultMessage');
const jwt = require("../jwt/index");
// 需要验证token的接口
let needTokenApi = require('../../config/apis')



// 用于解析token
module.exports = (req, res, next) => {
  const neeApis = needTokenApi.filter((api) => {
    const reg = pathToRegexp(api.path);
    return api.method == req.method && reg.test(req.path);
  });

  if (neeApis.length === 0) {
    next();
    return;
  }
  let token = req.cookies.token || "";
  // console.log(token);
  if (!token) {
   
    token = req.headers.authorization || "";
    // console.log(token)
  }
  if (!token) {
    // 没有认证
    handlerNoToken(req, res, next);
    return;
  }
  // console.log(token)
  // 验证token
  const result = jwt.verify(req);
  if (result) {
    // 认证通过
    // console.log('36',result.type)
    // req.userId = result.id;
    if(result.type == 'user'){
      req.userId = result.id
    }else{
      req.adminId = result.id
    }
    next();
  } else {
    handlerNoToken(req, res, next);
  }
};

// 处理验证没有通过的情况
function handlerNoToken(req, res, next) {
  handleSend({
    code: 401,
    msg: "身份权限获取失败，请重新登录",
    data: "请先进行登录！"
  }, res);
}