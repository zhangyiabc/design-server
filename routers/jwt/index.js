const jwt = require('jsonwebtoken')
const cookieKey = 'token'
// 私钥 后续可能那随机字符生成
const secrect = "`zhangyida`"; 

exports.publish = (res, maxAge = 3600 * 24 * 1000, info = {}) => {
  const token = jwt.sign(info, secrect, {
    expiresIn: maxAge,
  });
  // 添加到cookie
  res.cookie(cookieKey, token, {
    maxAge,
    path: "/",
    // domain: "",
  });

  // 添加其他传输
  res.header("authorization", token);
};

exports.verify = (req) => {
  // 尝试从cookie,authorization中获取token
  let token = "";
  token = req.cookies[cookieKey] || null;
  if (!token) {
    token = req.headers.authorization;
    if (!token) {
      return null;
    }

    //格式authorization：bearer token
    token = token.split(" ")[1];
    token = token.length == 1 ? token[0] : token[1];
  }
  // 取出来后进行判断

  try {
    const result = jwt.verify(token, secrect);
    // console.log(result)
    return result;
  } catch (error) {
    return null;
  }
};