/**
 * 公共接口结构块
 */
export const ApiUrl = {
  getCodeImg: '/api/blog/v1/getCaptcha', // 获取验证码
  login: 'api/blog/v1/login', // 登陆
  // 分组行为
  getImgsGroup: 'api/blog/v1/imgGroup', // 获取图片分组
  delImgsGroup: 'api/blog/v1/imgGroup', // 删除图片分组
  updateImgsGroup: 'api/blog/v1/imgGroup', // 获取图片分组
  addImgsGroup: 'api/blog/v1/imgGroup', // 获取图片分组
  // 图片行为
  uploadImgs: 'api/blog/uploadIms', // 上传图片
  searchImgs: 'api/blog/uploadIms', // 搜索图片
  mvImgs: 'api/blog/uploadIms', // 移动图片到新分组
  delImgs: 'api/blog/uploadIms', // 删除图片
}
