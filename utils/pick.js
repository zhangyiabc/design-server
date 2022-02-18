/**
 * 从对象中选取所需属性
 * @param {Object} obj 
 * @param  {...any} args 
 */
 function pick(obj,...args){
  let newObj = {};
  for (const key in obj) {
    if(args.includes(key)){
      newObj[key] = obj[key]
    }
  }
  return newObj

}
module.exports = {
  pick
}