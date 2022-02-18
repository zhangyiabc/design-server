const errMsg = (errMsg = "server internal error", errCode = 500, data = []) => {
  return {
    code: errCode,
    msg: errMsg,
    data: data,
  };
};

const successMsg = (msg = "success", code = 200, data = []) => {
  return {
    code,
    msg: msg,
    data: data,
  };
};

const handleSend = (resultObj, res) => {
  const { code, msg, data } = resultObj;
  let sendData = ''
  if (code != 200) {
    sendData = errMsg(msg, code, data);
  }
  sendData = successMsg(msg, code, data);
  res.status(sendData.code)
  res.send(sendData)
};

module.exports = {
  errMsg,
  successMsg,
  handleSend,
};
