const multer = require('multer')
const express = require("express");
const router = express.Router();
const path = require('path');
const { ossPutFunc } = require('../../utils/ossUpload');
const { handleSend } = require('../../utils/resultMessage');

const storage = multer.diskStorage({
  // 以下两个方法是修改req.file中的destination和filename这两个信息
  // 文件的磁盘存储位置
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../public/upload'))
  },
  // 文件的名字
  filename: function (req, file, cb) {
    // console.log(file)
    const timeStamp = ('' + Date.now()).substr(6)
    const randomStr = Math.random().toString(36).slice(-6);
    const exitName = path.extname(file.originalname)
    cb(null, `${timeStamp}-${randomStr}${exitName}`)

  }
})

const upload = multer({

  storage,
  limits: {
    fileSize: 1500 * 1024,
  },
  fileFilter(req, file, cb) {
    // 根据cb函数的参数来进行文件的过滤
    const whitelist = ['.png', '.jpg', '.jpeg', '.gif']
    const extname = path.extname(file.originalname)
    if (whitelist.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error(`your ext name of ${extname} is not support`));
    }
  }
})

router.post('/', upload.single('file'), async (req, res) => {
  const result = await ossPutFunc(`${req.body.name}/${req.file.filename}`, req.file.path)
  if (result.res.status === 200) {
    // 上传成功
    handleSend({
      code: "200",
      msg: "success",
      data: result.url
    }, res)
  } else {
    // 上传失败
    handleSend({
      code: '500',
      msg: result.res.statusMessage
    })
  }
})

module.exports = router