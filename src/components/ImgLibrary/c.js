
  import {
    getImgs,
    getGroupText,
    updateGroupText,
    addGroupText,
    delImgs,
    delGroupText,
    uploadImg,
    mvImgs
  } from "@/api/system/imgs";
  import { Notification } from 'element-ui';

  export default {
    name: "ImgLibrary",
    props: ["dialogVisible"], // 定义名字
    data() {
      // 数据定义
      return {
        GroupTextTitle: "新增分组",
        newEditGroupText: "",
        innerVisible: false,
        src: "",
        // 分组的列表
        groupList: [
          { name: "博客默认信息", id: 1 },
          { name: "图标类", id: 2 },
          { name: "车行类", id: 3 },
          { name: "大型活动场合", id: 4 },
          { name: "租房展示图", id: 5 }
        ],
        // 图片列表 一页20条数据
        imgList: [],
        /**
         * 选中的图片
         *  图片id  图片地址
         */
        selectedImgs: [],
        // 搜索选中的分组
        searchSelectedGroup: "",
        // 上传
        uploadImg: {},
        // 页码 默认为1开始 pageSize = 20
        page: 1,
        pageSize: 20,
        selectPage: 1
      };
    },
    mounted() {},
    created() {
      /**
       * 页面加载初始执行
       *
       * 获取图片分组
       * 获取图片列表
       * 分页
       */
      let url = "https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3342331525,3501514615&fm=85&app=92&f=JPEG?w=121&h=75&s=BA3BE04C8AA5F36C455785820300A09A"
      for(var i = 0; i < 20; i++) {
        this.imgList[i] = {
          "id":i,
          "url":url,
          "name": "name"+i
        }
      }
      this.getGroupText();
    },
    // 方法定义
    methods: {
      // 获取图片
      getImgs() {
        getImgs({
          cate_id: this.searchSelectedGroup
        }).then(res => {
          console.log("getGroupText", res);
        });
      },
      // 获取分组
      getGroupText() {
        // getGroupText().then(res => {
        //   console.log("getGroupText", res);
        // });
      },

      /**
       *  状态以及 所选的图片地址
       */
      dialogVisibleMethod(val) {
        this.$emit("changeDialogVisible", {
          status: val,
          selectedImgs: this.selectedImgs
        });
      },
      // 新增分组框
      newGroup() {
        this.GroupTextTitle = "新增分组"
        this.newEditGroupText = ""
        this.innerVisible = true
      },
      // 新增分组请求
      groupNewEdit() {
        console.log(this.newEditGroupText)
        if(this.newEditGroupText == "" || this.newEditGroupText || undefined) {
          console.log("为空00")
        }
        this.innerVisible = false
      },
      // 选中分组
      selectGroup(id) {
        this.searchSelectedGroup = id
        /**
         * 请求图片分组数据
         */
      },
      // 上传图片
      editGroupText(item) {
        // 编辑分组名字
        this.GroupTextTitle = "编辑分组信息";
        this.newEditGroupText = item.name;
        this.innerVisible = true;
        console.log(item);
      },
      delGroupText(item) {
        // 删除分组名字
        console.log(item);
      },
      // 分组特效  STAST
      changeActive($event) {
        $event.currentTarget.className = "img_menu_xuanzhong groupField";
      },
      removeActive($event) {
        let id = $event.currentTarget.getAttribute("id")
        if(id != this.searchSelectedGroup) {
          $event.currentTarget.className = "";
        }
      },
      // 分组特效 STOP
      httpRequest(options) {
        var that = this;
        // 获取文件对象
        let file = options.file;
        //判断图片类型
        if (
          file.type == "image/jpeg" ||
          file.type == "image/png" ||
          file.type == "image/JPG"
        ) {
          var isJPG = true;
        } else {
          isJPG = false;
        }
        // 判断图片大小
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传产品图片只能是 JPG/PNG/JPEG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传产品图片大小不能超过 2MB!")
        }
        // 创建一个HTML5的FileReader对象
        var reader = new FileReader()
        //创建一个img对象
        var img = new Image()
        let filename = options.filename
        if (file) {
          reader.readAsDataURL(file)
        }
        if (isJPG && isLt2M) {
          reader.onload = e => {
            let base64Str = reader.result.split(",")[1]
            img.src = e.target.result
            // base64地址图片加载完毕后执行
            img.onload = function () {
              // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
              var canvas = document.createElement("canvas")
              var context = canvas.getContext("2d")
              // 图片原始尺寸
              var originWidth = this.width
              var originHeight = this.height
              // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
              var maxWidth = 300
              var maxHeight = 300
              // 目标尺寸
              var targetWidth = originWidth
              var targetHeight = originHeight
              // 图片尺寸超过最大尺寸的限制
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  // 更改宽度，按照宽度限定尺寸
                  targetWidth = maxWidth
                  targetHeight = Math.round(
                    maxWidth * (originHeight / originWidth)
                  )
                } else {
                  targetHeight = maxHeight
                  targetWidth = Math.round(
                    maxHeight * (originWidth / originHeight)
                  )
                }
              }
              // 对图片进行缩放
              canvas.width = targetWidth
              canvas.height = targetHeight
              // 清除画布
              context.clearRect(0, 0, targetWidth, targetHeight)
              // 图片压缩
              context.drawImage(img, 0, 0, targetWidth, targetHeight)
              /* 第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
              // 压缩后的base64文件
              var newUrl = canvas.toDataURL("image/jpeg", 0.92)
              console.log("newUrl", newUrl)
              uploadImg({
                data: newUrl,
                cate_id: 0
              }).then(res => {
                console.log(" res", res)
              })
              //  that.Api.post("/app/uploadPicture",{ fileContent:newUrl})
              //  .then(res => {
              //   that.addRule.pictureUrl = res.data;
              // })
              //  .catch(err => {
              //  })
            }
          }
        }
      },
      // 上传结果
      handleAvatarSuccess() {
        console.log("handleAvatarSuccess");
      },
      // 点击图片
      clickImgs: function($event){
        let imgurl = $event.currentTarget.getAttribute("imgurl")
        let id = $event.currentTarget.getAttribute("id")
        /**
         *  判断是选中还是取消选中
         */
        if ($event.currentTarget.className.indexOf("action") == -1) {
          $event.currentTarget.className = "block action"; //切换按钮样式
          this.selectedImgs.push({"id":id, "imgurl": imgurl})
        } else {
          $event.currentTarget.className = "block"; //切换按钮样式
          for(let i = 0; i < this.selectedImgs.length; i++) {
              if(this.selectedImgs[i].id == id) {
                this.selectedImgs.splice(i, 1); 
                break;
              }
          }
        }
      },
      // 删除图片
      delImgs() {

        if(this.selectedImgs == "" || this.selectedImgs == undefined) {
          this.alertEmptyImgs()
          return
        }
        console.log("删除图片",  this.selectedImgs)
      },
      // 移动分组
      mvImgsGroup(command) {

        if(this.selectedImgs == "" || this.selectedImgs == undefined) {
          this.alertEmptyImgs()
          return
        }
          console.log("groupId", command)
          console.log("this.selectedImgs", this.selectedImgs)
      },
      alertEmptyImgs(text){
        // 选中图片为空弹窗
        const h = this.$createElement;
        text = text == undefined ? "失败信息": text 
        console.log(text)
        this.$message({
          message: h('p', null, [
            h('span', null, text),
            h('i', { style: 'color: teal' }, '  没有选中的图片')
          ])
        });
      }
    }
  };