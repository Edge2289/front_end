(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-211f78b0"],{"17c6":function(e,t,o){},2017:function(e,t,o){"use strict";var n=o("b12d"),s=o.n(n);s.a},"50d1":function(e,t,o){"use strict";var n=o("17c6"),s=o.n(n);s.a},"9ed6":function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"login-container"},[o("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:e.loginForm,rules:e.loginRules,autocomplete:"on","label-position":"left"}},[o("div",{staticClass:"title-container"},[o("h3",{staticClass:"title"},[e._v("后台登录 V1.0")])]),e._v(" "),o("el-form-item",{attrs:{prop:"username"}},[o("span",{staticClass:"svg-container"},[o("svg-icon",{attrs:{"icon-class":"user"}})],1),e._v(" "),o("el-input",{ref:"username",attrs:{placeholder:"Username",name:"username",type:"text",tabindex:"1",autocomplete:"on"},model:{value:e.loginForm.username,callback:function(t){e.$set(e.loginForm,"username",t)},expression:"loginForm.username"}})],1),e._v(" "),o("el-tooltip",{attrs:{content:"Caps lock is On",placement:"right",manual:""},model:{value:e.capsTooltip,callback:function(t){e.capsTooltip=t},expression:"capsTooltip"}},[o("el-form-item",{attrs:{prop:"password"}},[o("span",{staticClass:"svg-container"},[o("svg-icon",{attrs:{"icon-class":"password"}})],1),e._v(" "),o("el-input",{key:e.passwordType,ref:"password",attrs:{type:e.passwordType,placeholder:"Password",name:"password",tabindex:"2",autocomplete:"on"},on:{blur:function(t){e.capsTooltip=!1}},nativeOn:{keyup:[function(t){return e.checkCapslock(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleLogin(t)}]},model:{value:e.loginForm.password,callback:function(t){e.$set(e.loginForm,"password",t)},expression:"loginForm.password"}}),e._v(" "),o("span",{staticClass:"show-pwd",on:{click:e.showPwd}},[o("svg-icon",{attrs:{"icon-class":"password"===e.passwordType?"eye":"eye-open"}})],1)],1)],1),e._v(" "),o("el-form-item",{staticStyle:{width:"60%",float:"left"},attrs:{prop:"code"}},[o("span",{staticClass:"svg-container"},[o("svg-icon",{attrs:{"icon-class":"validCode"}})],1),e._v(" "),o("el-input",{ref:"code",staticStyle:{width:"75%"},attrs:{placeholder:"验证码",name:"code",maxlength:"4",type:"text",tabindex:"3",autocomplete:"off"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleLogin(t)}},model:{value:e.loginForm.code,callback:function(t){e.$set(e.loginForm,"code",t)},expression:"loginForm.code"}})],1),e._v(" "),o("div",{staticClass:"login-code",staticStyle:{width:"38%",height:"48px",float:"right"}},[o("img",{staticStyle:{height:"48px",width:"100%"},attrs:{src:e.codeUrl},on:{click:e.getCode}})]),e._v(" "),o("el-button",{staticStyle:{width:"100%","margin-bottom":"30px"},attrs:{loading:e.loading,type:"primary"},nativeOn:{click:function(t){return t.preventDefault(),e.handleLogin(t)}}},[e.loading?o("span",[e._v("登 录 中...")]):o("span",[e._v("登 录")])])],1)],1)},s=[],a=(o("ac6a"),o("456d"),o("8c44")),r={name:"Login",data:function(){return{codeUrl:"",loginForm:{username:"1131191695@qq.com",password:"123456",uuid:"",code:""},loginRules:{username:[{required:!0,trigger:"blur",validator:"请输入账号！"}],password:[{required:!0,trigger:"blur",validator:"请输入密码！"}],code:[{required:!0,trigger:"change",validator:"验证码不能为空"}]},passwordType:"password",capsTooltip:!1,loading:!1,redirect:void 0,otherQuery:{}}},watch:{$route:{handler:function(e){var t=e.query;t&&(this.redirect=t.redirect,this.otherQuery=this.getOtherQuery(t))},immediate:!0}},created:function(){this.getCode()},mounted:function(){""===this.loginForm.username?this.$refs.username.focus():""===this.loginForm.password&&this.$refs.password.focus()},destroyed:function(){},methods:{checkCapslock:function(e){var t=e.key;this.capsTooltip=t&&1===t.length&&t>="A"&&t<="Z"},showPwd:function(){var e=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick((function(){e.$refs.password.focus()}))},getCode:function(){var e=this;Object(a["a"])().then((function(t){e.codeUrl=t.data.captcha,e.loginForm.uuid=t.data.captcha_id}))},handleLogin:function(){var e=this;this.$refs.loginForm.validate((function(t){if(!t)return!1;e.loading=!0,e.$store.dispatch("user/login",e.loginForm).then((function(){e.$router.push({path:e.redirect||"/",query:e.otherQuery}),e.loading=!1})).catch((function(){e.getCode(),e.loading=!1}))}))},getOtherQuery:function(e){return Object.keys(e).reduce((function(t,o){return"redirect"!==o&&(t[o]=e[o]),t}),{})}}},i=r,c=(o("2017"),o("50d1"),o("2877")),l=Object(c["a"])(i,n,s,!1,null,"622fe24e",null);t["default"]=l.exports},b12d:function(e,t,o){}}]);