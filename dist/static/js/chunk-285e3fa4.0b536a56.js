(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-285e3fa4"],{"3b6a":function(e,t,n){"use strict";n("a481"),n("6762"),n("2fdb");var o=n("2b0e");o["default"].directive("dialogDrag",{bind:function(e,t,n,o){var i=e.querySelector(".el-dialog__header"),s=e.querySelector(".el-dialog");i.style.cssText+=";cursor:move;",s.style.cssText+=";top:0px;";var a=function(){return window.document.currentStyle?function(e,t){return e.currentStyle[t]}:function(e,t){return getComputedStyle(e,!1)[t]}}();i.onmousedown=function(e){var t=e.clientX-i.offsetLeft,n=e.clientY-i.offsetTop,o=document.body.clientWidth,r=document.documentElement.clientHeight,c=s.offsetWidth,l=s.offsetHeight,u=s.offsetLeft,d=o-s.offsetLeft-c,f=s.offsetTop,h=r-s.offsetTop-l,m=a(s,"left"),p=a(s,"top");m.includes("%")?(m=+document.body.clientWidth*(+m.replace(/\%/g,"")/100),p=+document.body.clientHeight*(+p.replace(/\%/g,"")/100)):(m=+m.replace(/\px/g,""),p=+p.replace(/\px/g,"")),document.onmousemove=function(e){var o=e.clientX-t,i=e.clientY-n;-o>u?o=-u:o>d&&(o=d),-i>f?i=-f:i>h&&(i=h),s.style.cssText+=";left:".concat(o+m,"px;top:").concat(i+p,"px;")},document.onmouseup=function(e){document.onmousemove=null,document.onmouseup=null}}}})},efa5:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[e._v("\n  大师傅士大夫\n")])},i=[],s=(n("3b6a"),{name:"Role",data:function(){return{loading:!1,ids:[],single:!0,multiple:!0,total:0,tab_list:[],title:"",open:!1,openDataScope:!1,isEdit:!1,dateRange:[],statusOptions:[{dictValue:1,dictLabel:"开启"},{dictValue:0,dictLabel:"关闭"}],dataScopeOptions:[{value:"1",label:"全部数据权限"},{value:"2",label:"自定数据权限"},{value:"3",label:"本部门数据权限"},{value:"4",label:"本部门及以下数据权限"},{value:"5",label:"仅本人数据权限"}],menuOptions:[],deptOptions:[],queryParams:{pageIndex:1,pageSize:10,roleName:void 0,roleKey:void 0,status:void 0},form:{},defaultProps:{children:"children",label:"label"},rules:{roleName:[{required:!0,message:"标签名称不能为空",trigger:"blur"}],roleKey:[{required:!0,message:"权限字符不能为空",trigger:"blur"}],roleSort:[{required:!0,message:"标签顺序不能为空",trigger:"blur"}]}}},created:function(){this.getList()},methods:{getList:function(){this.tab_list=[{tab_id:1,tab_name:"天蓝色",tab_color:"red",is_state:1,operator_name:"",created_at:"2020-07-15 02:02:03"},{tab_id:2,tab_name:"天蓝色aa",tab_color:"red",is_state:1,operator_name:"",created_at:"2020-07-15 02:02:03"},{tab_id:3,tab_name:"天蓝色ss",tab_color:"red",is_state:1,operator_name:"",created_at:"2020-07-15 02:02:03"},{tab_id:4,tab_name:"天蓝色dd",tab_color:"red",is_state:1,operator_name:"",created_at:"2020-07-15 02:02:03"}],this.total=10},getDeptTreeselect:function(){var e=this;deptTreeselect().then((function(t){e.deptOptions=t.data.list}))},handleStatusChange:function(e){var t=this,n="0"===e.is_state?"启用":"停用";console.log("row.is_state",e.is_state),this.$confirm('确认要"'+n+'""'+e.tab_name+'"标签吗?',"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return changeRoleStatus(e.tab_id,e.is_state)})).then((function(){t.msgSuccess(n+"成功")})).catch((function(){e.is_state="0"===e.is_state?"1":"0"}))},cancel:function(){this.open=!1,this.reset()},cancelDataScope:function(){this.openDataScope=!1,this.reset()},reset:function(){void 0!==this.$refs.menu&&this.$refs.menu.setCheckedKeys([]),this.form={roleId:void 0,roleName:void 0,roleKey:void 0,roleSort:0,status:"0",menuIds:[],deptIds:[],remark:void 0}},handleQuery:function(){this.queryParams.pageIndex=1,this.getList()},resetQuery:function(){this.dateRange=[],this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.roleId})),this.single=1!==e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加标签",this.isEdit=!1},handleUpdate:function(e){this.reset();e.roleId||this.ids;this.open=!0,this.title="修改标签",this.isEdit=!0},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(void 0!==e.form.roleId?(e.form.menuIds=e.getMenuAllCheckedKeys(),updateRole(e.form).then((function(t){200===t.code?(e.msgSuccess("修改成功"),e.open=!1,e.getList()):e.msgError(t.msg)}))):(e.form.menuIds=e.getMenuAllCheckedKeys(),addRole(e.form).then((function(t){200===t.code?(e.msgSuccess("新增成功"),e.open=!1,e.getList()):e.msgError(t.msg)}))))}))},submitDataScope:function(){var e=this;void 0!==this.form.roleId&&(this.form.deptIds=this.getDeptAllCheckedKeys(),console.log(this.getDeptAllCheckedKeys()),dataScope(this.form).then((function(t){200===t.code?(e.msgSuccess("修改成功"),e.openDataScope=!1,e.getList()):e.msgError(t.msg)})))},handleDelete:function(e){var t=this,n=e.tab_id||this.ids;this.$confirm("是否确认删除标签: "+e.tab_name+" ?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return delRole(n)})).then((function(){t.getList(),t.msgSuccess("删除成功")})).catch((function(){}))}}}),a=s,r=n("2877"),c=Object(r["a"])(a,o,i,!1,null,null,null);t["default"]=c.exports}}]);