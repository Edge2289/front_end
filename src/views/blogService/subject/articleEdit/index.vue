<template>
  <el-form ref="form" :model="form" label-width="80px" style="padding: 30px">
    <!-- <el-form-item label="文章前台显示样式">
    <el-select v-model="form.show_type" placeholder="请选择显示样式">
      <el-option :label="1" value="样式一"></el-option>
      <el-option :label="2" value="样式二"></el-option>
    </el-select>
    </el-form-item>-->
    <el-form-item label="文章标题">
      <el-input v-model="form.title" />
    </el-form-item>
    <br />
    <el-form-item label="作者昵称">
      <el-input v-model="form.nick" />
    </el-form-item>
    <br />
    <el-form-item label="配图框">
      <div class="img_kuang" style @click="dialogVisible = true">
        <i v-if="dialogVisibleUrlState" class="el-icon-plus img_kuang_i" />
        <img
          v-if="dialogImageUrl != ''"
          :src="dialogImageUrl"
          class="avatar"
          style="width: 100%; height: 100%; display: block"
        />
      </div>
      <ImgLibrary
        :dialog-visible="dialogVisible"
        @changeDialogVisible="changeDialogVisible"
      />
    </el-form-item>
    <br />
    <el-form-item label="文章分类">
      <el-select v-model="form.cate_id" placeholder="请选择文章分类">
        <el-option
          v-for="(item, key) in cate_list"
          :key="key"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <br />
    <el-form-item label="标签">
      <el-checkbox-group v-model="form.label_data" class="tab_list_border">
        <el-checkbox
          v-for="(item, key) in tab_list"
          :key="key"
          :label="item.tab_id"
          >{{ item.tab_name }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <br />
    <el-form-item label="文章发布">
      <el-radio-group v-model="form.is_state" size="medium">
        <el-radio border :label="1">发布</el-radio>
        <el-radio border :label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <br />
    <el-form-item label="开启评论">
      <el-radio-group v-model="form.is_comment" size="medium">
        <el-radio border :label="1">开启</el-radio>
        <el-radio border :label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <br />
    <el-form-item label="描述">
      <el-input v-model="form.describe" type="textarea" />
    </el-form-item>
    <div class="markdown" style="margin-bottom: 40px; margin-top: 20px">
      <div class="container">
        <mavon-editor
          ref="md"
          v-model="content"
          :ishljs="true"
          style="min-height: 600px"
          @imgAdd="$imgAdd"
          @change="change"
        />
      </div>
    </div>
    <el-form-item
      style="
        position: fixed;
        bottom: 0px;
        z-index: 1500;
        width: 80%;
        text-align: right;
        padding-top: 10px;
        padding-bottom: 10px;
      "
    >
      <el-button type="primary" @click="onSubmit">立即保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getLabel,
  updateArticle,
  addArticle,
  getArticleList,
} from "@/api/article/article";
import { getCategory } from "@/api/article/category";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import "mavon-editor/dist/katex/katex";
import ImgLibrary from "@/components/ImgLibrary"; // 图片选择

export default {
  name: "",
  components: {
    mavonEditor,
    ImgLibrary,
  },
  props: [],
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      dialogVisibleUrlState: true,
      form: {
        title: "",
        describe: "",
        img: "",
        nick: "",
        cate_id: "",
        label_data: [],
        is_comment: 1,
        is_state: 0,
        text: "",
        markdown: "",
        show_type: 0,
      },
      content: "",
      html: "",
      /** *
       * 文章基础信息列表
       */
      tab_list: [],
      cate_list: [],
    };
  },
  watch: {
    dialogImageUrl(value) {
      if (value == "") {
        this.dialogVisibleUrlState = true;
      } else {
        this.dialogVisibleUrlState = false;
      }
    },
  },
  created() {
    this.getData();
    this.getLabelData();
    this.getCateData();
  },
  mounted() {},
  methods: {
    changeDialogVisible(val) {
      this.dialogVisible = false;
      if (val.selectedImgs.length != 0 && val.status != 0) {
        this.dialogImageUrl = val.selectedImgs[0].imgurl;
      }
      if (val.status == 1 && val.selectedImgs.length == 0) {
        this.dialogImageUrl = "";
      }
    },
    getData() {
      // this.content = '```php \n asdasd \n ```  \n ### 12345';
      const articleId = this.$route.query.articleId;
      if (!(articleId == undefined || articleId == "")) {
        getArticleList({
          id: this.$route.query.articleId,
          is_state: -1,
        }).then((response) => {
          this.dialogImageUrl = response.data.data[0].img;
          this.form.title = response.data.data[0].title;
          this.form.nick = response.data.data[0].nick;
          this.form.describe = response.data.data[0].describe;
          this.form.is_comment = response.data.data[0].is_comment;
          this.form.is_state = response.data.data[0].is_state;
          this.form.cate_id = response.data.data[0].cate_id;
          this.form.label_data = response.data.data[0].cate_id;
          this.form.url = response.data.data[0].img;
          this.form.text = response.data.data[0].text_data.text;
          this.form.markdown = response.data.data[0].text_data.markdown;
          this.content = response.data.data[0].text_data.markdown;
          const labels = [];
          response.data.data[0].label_data.forEach(function (item, index) {
            labels[index] = item.label_id;
          });
          this.form.label_data = labels;
          console.log("this.form", this.form);
        });
      }
    },
    getLabelData() {
      /**
       *  获取标签
       */
      getLabel({
        page: 1,
        page_size: 100,
        is_state: 1,
      }).then((response) => {
        response.data.data.forEach((item, index) => {
          this.tab_list[index] = {
            tab_id: item.id,
            tab_name: item.label,
          };
        });
      });
    },
    getCateData() {
      getCategory({
        page: 1,
        page_sieze: 100,
        is_state: 1,
        name: this.cateName == undefined ? "" : this.cateName,
      }).then((response) => {
        this.cate_list = response.data.data;
      });
    },
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      const formdata = new FormData();

      // this.$upload
      //   .post("/上传接口地址", formdata)
      //   .then((res) => {
      //     console.log(res.data);
      //     this.$refs.md.$img2Url(pos, res.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    // 提交
    onSubmit() {
      /**
       *  文章保存
       */
      const articleId = this.$route.query.articleId;
      let requestHeader = addArticle;
      if (!(articleId == undefined || articleId == "")) {
        this.form.id = parseInt(articleId);
        requestHeader = updateArticle;
      }
      this.form.label_data = this.form.label_data.join(",");
      this.form.img = this.dialogImageUrl;
      this.form.text = this.html;
      this.form.markdown = this.content;
      requestHeader(this.form).then((response) => {
        if (response.code == 200) {
          this.msgSuccess(response.msg);
        } else {
          this.msgError(response.msg);
        }

        this.$store.state.tagsView.visitedViews.splice(
          this.$store.state.tagsView.visitedViews.findIndex(
            (item) => item.path === this.$route.path
          ),
          1
        );
        this.$router.push(
          this.$store.state.tagsView.visitedViews[
            this.$store.state.tagsView.visitedViews.length - 1
          ].path
        );
        var dataIntArr = []; // 保存转换后的整型字符串
        // 方法一
        this.form.label_data.split(",").forEach(function (data, index, arr) {
          dataIntArr.push(+data);
        });
        this.form.label_data = dataIntArr;
      });
    },
    // 关闭
    cancel() {
      this.$confirm("此操作将会丢失已写内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.state.tagsView.visitedViews.splice(
            this.$store.state.tagsView.visitedViews.findIndex(
              (item) => item.path === this.$route.path
            ),
            1
          );
          this.$router.push(
            this.$store.state.tagsView.visitedViews[
              this.$store.state.tagsView.visitedViews.length - 1
            ].path
          );
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
.img_kuang {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  cursor: pointer;
  line-height: 146px;
  vertical-align: top;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}
.img_kuang_i {
  font-family: "element-icons" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  font-size: 28px;
  color: #8c939d;
}
.tab_list_border {
  border: 1px dashed hsla(0, 0%, 32%, 0.5);
  padding: 10px;
  border-radius: 5px;
}
body {
  overflow: visible !important;
}
</style>
