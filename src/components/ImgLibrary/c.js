
import {
  getImgs,
  getGroupText,
  updateGroupText,
  addGroupText,
  delImgs,
  delGroupText,
  uploadImg,
  mvImgs
} from '@/api/system/imgs'
import { Notification } from 'element-ui'
import { dialogDrag } from '@/utils/directives'

export default {
  name: 'ImgLibrary',
  props: ['dialogVisible'], // 定义名字
  data() {
    // 数据定义
    return {
      GroupTextTitle: '新增分组',
      newEditGroupText: '',
      newEditGroupId: 0,
      innerVisible: false,
      src: '',
      // 分组的列表
      groupList: [],
      // 图片列表 一页20条数据
      imgList: [],
      /**
      * 选中的图片
      *  图片id  图片地址
      */
      selectedImgs: [],
      // 搜索选中的分组
      searchSelectedGroup: '',
      // 上传
      uploadImg: {},
      // 页码 默认为1开始 pageSize = 20
      pageIndex: 1,
      pageSize: 10,
      total: 20,

      // 按钮控件
      newEditGroupTextLoadingbut: false
    }
  },
  mounted() { },
  created() {
    this.getImgsList()
    // this.getImgsList();
    /**
       * 页面加载初始执行
       *
       * 获取图片分组
       * 获取图片列表
       * 分页
       */
    const url = 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3342331525,3501514615&fm=85&app=92&f=JPEG?w=121&h=75&s=BA3BE04C8AA5F36C455785820300A09A'
    for (var i = 0; i < 20; i++) {
      this.imgList[i] = {
        'id': i,
        'url': url,
        'name': 'name' + i
      }
    }
    this.getGroupText()
  },
  // 方法定义
  methods: {
    // 获取图片
    getImgsList() {
      getImgs({
        'cate_id': this.searchSelectedGroup,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }).then(res => {
        // if (res != 200) {
        //   this.$message.error(res.message);
        //   return;
        // }
        const imgList = []
        res.data.list.forEach(function (item, index) {
          imgList[index] = {
            'id': item.id,
            'url': item.domain + item.url,
            'name': item.url
          }
        })
        this.total = res.data.count
        this.imgList = imgList
      })
    },
    // 获取分组
    getGroupText() {
      getGroupText().then(res => {
        this.groupList = res.data
      })
    },
    //状态以及 所选的图片地址
    dialogVisibleMethod(val) {
      this.$emit('changeDialogVisible', {
        status: val,
        selectedImgs: this.selectedImgs
      })
    },
    // 新增分组框
    newGroup() {
      this.GroupTextTitle = '新增分组'
      this.newEditGroupText = ''
      this.newEditGroupId = 0
      this.innerVisible = true
    },
    // 新增分组请求
    groupNewEdit() {
      if (this.newEditGroupText.trim() == '' || this.newEditGroupText == undefined) {
        this.$message.error('分组名称为空')
        return
      }

      let requestObj = addGroupText
      if (this.newEditGroupId != 0) {
        requestObj = updateGroupText
      }
      /**
      * 请求体
      */
     
     this.newEditGroupTextLoadingbut = true;
      requestObj({
        'id': this.newEditGroupId,
        'name': this.newEditGroupText,
        'sort': 50
      }).then(res => {
        if (res.code != 200) {
          this.$message.error(res.msg)
          return
        }
        this.newEditGroupTextLoadingbut = false;
        this.innerVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getGroupText()
      })
    },
    // 选中分组
    selectGroup(id) {
      this.searchSelectedGroup = id;
      this.selectedImgs = [];
      this.getImgsList();
      /**
       * 请求图片分组数据
       */
    },
    // 编辑分组名字
    editGroupText(item) {
      // 编辑分组名字
      this.GroupTextTitle = "编辑分组信息";
      this.newEditGroupText = item.name;
      this.newEditGroupId = item.id;
      this.innerVisible = true;
    },
    delGroupText(item) {
      // 删除分组名字
      this.$confirm('此操作将永久删除该分组,该分组下的图片将转移到未分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGroupText({ "id": item.id }).then(res => {
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          this.getGroupText();
        })
        this.$message({
          message: "操作成功",
          type: 'success'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已撤销操作'
        });
        return;
      });
    },
    // 分组特效  STAST
    changeActive($event) {
      $event.currentTarget.className = "img_menu_xuanzhong groupField";
    },
    removeActive($event) {
      let id = $event.currentTarget.getAttribute("id")
      if (id != this.searchSelectedGroup) {
        $event.currentTarget.className = "";
      }
    },
    // 分组特效 STOP
    httpRequest(options) {
      var that = this;
      // 获取文件对象
      let file = options.file;
      let fielType = "";
      //判断图片类型
      isJPG = false;
      if (
        file.type == "image/jpeg" ||
        file.type == "image/JPG"
      ) {
        fielType = "data:img/jpg;base64,"
        var isJPG = true
      }

      if ( file.type == "image/png" ) {
        fielType = "data:img/png;base64,"
        var isJPG = true
      }
      
      // 判断图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传产品图片只能是 JPG/PNG/JPEG 格式!");
        return
      }
      if (!isLt2M) {
        this.$message.error("上传产品图片大小不能超过 2MB!")
        return
      }
      // 创建一个HTML5的FileReader对象
      var reader = new FileReader()
      //创建一个img对象
      var img = new Image()
      // let filename = options.filename
      if (file) {
        reader.readAsDataURL(file)
      }
      reader.onload = e => {
        let base64Str = reader.result.split(",")[1]
        uploadImg({
          data: fielType + base64Str,
          cate_id: 0
        }).then(res => {
          if (res.code != 200) {
            this.$message.error(res.message)
          }
          that.getImgsList()
        })
      }
    },

    // 上传结果
    handleAvatarSuccess() {
      console.log('handleAvatarSuccess')
    },
    // 点击图片
    clickImgs: function ($event) {
      const imgurl = $event.currentTarget.getAttribute('imgurl')
      const id = $event.currentTarget.getAttribute('id')
      /**
         *  判断是选中还是取消选中
         */
      if ($event.currentTarget.className.indexOf('action') == -1) {
        $event.currentTarget.className = 'block action' // 切换按钮样式
        this.selectedImgs.push({ 'id': id, 'imgurl': imgurl })
      } else {
        $event.currentTarget.className = 'block' // 切换按钮样式
        for (let i = 0; i < this.selectedImgs.length; i++) {
          if (this.selectedImgs[i].id == id) {
            this.selectedImgs.splice(i, 1)
            break
          }
        }
      }
    },

    // 移动图片
    mvImgsGroup(command) {
      if (this.selectedImgs == '' || this.selectedImgs == undefined) {
        this.alertEmptyImgs()
        return
      }
      const ids = []
      this.selectedImgs.forEach(function (item, key) {
        ids[key] = item.id
      })
      mvImgs({
        "ids": JSON.stringify(ids),
        "cate_id": command
      }).then(res => {
        if (res.code != 200) {
          this.$message.error(res.message);
        }
        this.getImgsList();
      })
    },
    // 删除图片
    delImgs() {
      if (this.selectedImgs == '' || this.selectedImgs == undefined) {
        this.alertEmptyImgs()
        return
      }
      const ids = []
      this.selectedImgs.forEach(function (item, key) {
        ids[key] = item.id
      })
      delImgs({
        'ids': JSON.stringify(ids)
      }).then(res => {
        if (res.code != 200) {
          this.$message.error(res.message)
        }
        let ids = [];
        this.selectedImgs.forEach(function (item, key) {
          ids[key] = item.id;
        })
        this.$message({
          "message": "操作成功",
          "type": "success"
        })
        this.selectedImgs = [];
      })
    },
    alertEmptyImgs(text) {
      // 选中图片为空弹窗
      const h = this.$createElement
      text = text == undefined ? '失败信息' : text
      console.log(text)
      this.$message({
        message: h('p', null, [
          h('span', null, text),
          h('i', { style: 'color: teal' }, '  没有选中的图片')
        ])
      })
    }
  },
}
