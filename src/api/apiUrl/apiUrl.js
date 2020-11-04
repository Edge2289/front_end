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
  uploadImgs: 'api/blog/v1/uploadImg', // 上传图片
  searchImgs: 'api/blog/v1/uploadImg', // 搜索图片
  mvImgs: 'api/blog/v1/uploadImg', // 移动图片到新分组
  delImgs: 'api/blog/v1/uploadImg', // 删除图片

  // 文章
  getArticleApi: 'api/blog/v1/article/list', // 獲取文章
  delArticleApi: 'api/blog/v1/article/del', // 獲取文章
  updateArticleApi: 'api/blog/v1/article/put', // 獲取文章
  addArticleApi: 'api/blog/v1/article/add', // 獲取文章

  // 文章分類
  getCate: 'api/blog/v1/article/cate', // 獲取文章
  delCate: 'api/blog/v1/article/cate', // 獲取文章
  updateCate: 'api/blog/v1/article/cate', // 獲取文章
  addCate: 'api/blog/v1/article/cate', // 獲取文章

  // 文章label分類
  getLabel: 'api/blog/v1/article/label', // 獲取文章
  
}
