<template>
  <div class="login">
    <div class="content">
      <h1>用户登录</h1>
      <!-- el-form表单管理器 status-icon显示图标 label-width文本的宽度 -->
      <el-form
        label-position="top"
        :model="userObj"
        status-icon
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <!-- autocomplete自动补全 -->
          <el-input type="text" v-model="userObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="success" @click.prevent="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { log } from "util";
export default {
  data() {
    return {
      userObj: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      // console.log(this.userObj);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: "http://localhost:8888/api/private/v1/login",
            data: this.userObj
          })
            .then(res => {
              console.log(res);
              let { meta, data } = res.data;

              if (meta.status === 200) {
                // this.userObj=data
                this.$message({
                  message: "欢迎回来",
                  type: "success"
                });
                this.$router.push("/home");
                //保存到浏览器上面去
                window.localStorage.setItem("token", data.token);
              } else {
                this.$message.error("错了哦，请输入正确的用户名和密码");
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>

<style>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(50, 65, 82);
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 580px;
  height: 440px;
  background-color: #fff;
  padding: 40px;
}
.success {
  width: 100%;
}
</style>
