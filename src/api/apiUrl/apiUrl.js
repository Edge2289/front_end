/**
 * 公共接口结构块
 */
export const ApiUrl = {
  getCodeImg: 'api/blog/v1/pub/captcha', // 获取验证码
  login: 'api/blog/v1/pub/login', // 登陆

  // 分组行为
  getImgsGroup: 'api/blog/v1/image/imageCate', // 获取图片分组
  delImgsGroup: 'api/blog/v1/image/imageCate', // 删除图片分组
  updateImgsGroup: 'api/blog/v1/image/imageCate', // 获取图片分组
  addImgsGroup: 'api/blog/v1/image/imageCate', // 获取图片分组

  // 图片行为
  uploadImgs: 'api/blog/v1/image/uploadImg', // 上传图片
  searchImgs: 'api/blog/v1/image/list', // 搜索图片
  mvImgs: 'api/blog/v1/image/putImage', // 移动图片到新分组
  delImgs: 'api/blog/v1/image/delImage', // 删除图片

  // 文章
  getArticleApi: 'api/blog/v1/article/list', // 獲取文章
  delArticleApi: 'api/blog/v1/article/delArticle', // 删除文章
  updateArticleApi: 'api/blog/v1/article/putArticle', // 更新文章
  addArticleApi: 'api/blog/v1/article/addArticle', // 添加文章

  // 文章分類
  getCate: 'api/blog/v1/article/category', // 獲取文章
  delCate: 'api/blog/v1/article/category', // 獲取文章
  updateCate: 'api/blog/v1/article/category', // 獲取文章
  addCate: 'api/blog/v1/article/category', // 獲取文章

  // 文章label分類
  getLabel: 'api/blog/v1/article/label', // 獲取文章

  // 系统
  websiteConfig: 'api/blog/v1/system/websiteConfig', // 获取站点配置
  jobList: 'api/blog/v1/system/jobList', // 获取任务
  jobLogList: 'api/blog/v1/system/jobLogList', // 获取任务队列执行日志
  changeExecution: 'api/blog/v1/system/changeExecution', // 操作当前执行的任务
  blogLink: 'api/blog/v1/blog/link', // 博客友情链接
  blogBanner: 'api/blog/v1/blog/banner', // 博客友情链接

  // getTallyData
  getTallyData: 'api/blog/pub/webAccess/list', // 获取web的流量数据
  getAnalysisData: 'api/blog/v1/getAnalysisData', // 获取分析页数据
  getMonitorData: 'api/blog/v1/getMonitorData', // 获取分析页数据

  // manage user
  adminApi: 'api/blog/v1/manage/manage', // 获取管理员的数据
  roleApi: 'api/blog/v1/manage/role', // 获取角色的数据
  roleMenuApi: 'api/blog/v1/manage/roleMenu', // 获取角色菜单数据
  menuApi: 'api/blog/v1/manage/menu', // 获取菜单的数据
}
