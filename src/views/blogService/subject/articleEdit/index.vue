<template>
<el-form ref="form" :model="form" label-width="80px" style="padding: 30px;">
  <!-- <el-form-item label="文章前台显示样式">
    <el-select v-model="form.show_type" placeholder="请选择显示样式">
      <el-option :label="1" value="样式一"></el-option>
      <el-option :label="2" value="样式二"></el-option>
    </el-select>
  </el-form-item> -->
  <el-form-item label="文章标题">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <br>
  <el-form-item label="作者昵称">
    <el-input v-model="form.nick"></el-input>
  </el-form-item>
  <br>
  <el-form-item label="配图框">
    <div class="img_kuang" @click="dialogVisible = true" style="">
        <i class="el-icon-plus img_kuang_i" v-if="dialogVisibleUrlState"></i>
        <img :src="dialogImageUrl" class="avatar" v-if="dialogImageUrl != ''" style="width: 100%;
    height: 100%;
    display: block;">
    </div>
    <ImgLibrary
        :dialog-visible="dialogVisible"
        @changeDialogVisible="changeDialogVisible"
    />
  </el-form-item>
  <br>
  <el-form-item label="文章分类">
    <el-select v-model="form.cate_id" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <br>
  <el-form-item label="标签">
    <el-checkbox-group v-model="form.labels"  style="border: 1px dashed hsla(0, 0%, 32%, 0.5);
    padding: 10px;
    border-radius: 5px;">
      <el-checkbox :label="1" name="type">美食/餐厅线上活动</el-checkbox>
      <el-checkbox :label="2" name="type">地推活动</el-checkbox>
      <el-checkbox :label="3" name="type">线下主题活动</el-checkbox>
      <el-checkbox :label="4" name="type">单纯品牌曝光</el-checkbox>
      <el-checkbox :label="5" name="type">美食/</el-checkbox>
      <el-checkbox :label="6" name="type">地推</el-checkbox>
      <el-checkbox :label="7" name="type">线下动</el-checkbox>
      <el-checkbox :label="8" name="type">单牌曝光</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <br>
  <el-form-item label="文章发布">
    <el-radio-group v-model="form.is_state" size="medium">
      <el-radio border :label="1">发布</el-radio>
      <el-radio border :label="0">关闭</el-radio>
    </el-radio-group>
  </el-form-item>
  <br>
  <el-form-item label="开启评论">
    <el-radio-group v-model="form.is_comment" size="medium">
      <el-radio border :label="1">开启</el-radio>
      <el-radio border :label="0">关闭</el-radio>
    </el-radio-group>
  </el-form-item>
  <br>
  <el-form-item label="描述">
    <el-input type="textarea" v-model="form.describe"></el-input>
  </el-form-item>
  <div class="markdown" style="margin-bottom: 40px;margin-top: 20px;">
            <div class="container">
                <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" :ishljs = "true" style="min-height: 600px"/>
            </div>
        </div>
  <el-form-item style="position: fixed;
    bottom: 0px;
    z-index: 1500;
    width: 80%;
    text-align: right;
    padding-top: 10px;
    padding-bottom: 10px;">
    <el-button type="primary" @click="submit">立即创建</el-button>
    <el-button @click="cancel">取消</el-button>
  </el-form-item>
</el-form>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import "mavon-editor/dist/highlightjs/highlight.min.js";
    import "mavon-editor/dist/katex/katex";
    import ImgLibrary from '@/components/ImgLibrary';// 图片选择

    export default {
        name: "",
        props: [],
        components: {
            mavonEditor, ImgLibrary
        },
        data() {
            return {
                dialogVisible: false,
                dialogImageUrl: '',
                dialogVisibleUrlState: true,
                form: {
                    title: '',
                    describe: '',
                    img: '',
                    nick: '',
                    cate_id: '',
                    labels: [1,2,3,8],
                    is_comment: 1,
                    is_state: 0,
                    text: '',
                    markdown: '',
                    show_type: 0,
                },
                content: '',
                html:'',
                configs: {},
            }
        },
        created() {
            this.getData()
        },
        methods: {
            changeDialogVisible(val) {
                this.dialogVisible = false
                this.dialogImageUrl = val.selectedImgs[0].imgurl == undefined ? '': val.selectedImgs[0].imgurl
                this.dialogVisibleUrlState = false
                // this.form.img = this.dialogImageUrl
                console.log(val.selectedImgs[0].imgurl == undefined ? '': val.selectedImgs[0].imgurl)
            },
            getData() {
                this.content = '```php \n asdasd \n ```  \n ### 12345'
            },
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                let formdata = new FormData();
                
                this.$upload.post('/上传接口地址', formdata).then(res => {
                    console.log(res.data);
                    this.$refs.md.$img2Url(pos, res.data);
                }).catch(err => {
                    console.log(err)
                })
            },
            // 所有操作都会被解析重新渲染
            change(value, render){
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            // 提交
            submit(){
              /**
               *  文章保存
               */
                // this.form.text = this.content
                // this.form.markdown = this.html
                console.log(this.content);
                console.log(this.html);
                console.log(this.form);
                // this.$message.success('提交成功，已打印至控制台！');
            },
            // 关闭
            cancel(){
            this.$confirm('此操作将会丢失已写内容, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
                      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length-1].path)
                    }).catch(() => {         
                    });
            }
        },
        mounted() {

        }
    }
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
    outline: none
}
.img_kuang_i {
    font-family: 'element-icons' !important;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;font-size: 28px;
    color: #8c939d;
}
</style>