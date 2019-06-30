<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑bread     首页-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 输入框和按钮 -->
    <el-row class="myinput">
      <el-col :span="8">
        <!-- {{query}} -->
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click.prevent="add">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column label="用户状态">
        <!-- 开关slot-scope="scope"获取   mg_state状态吗  -->
        <template slot-scope="scope">
          <el-switch
            @change="seIChange(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- plain方框 -->
          <!-- size="mini"   size属性设置大小 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="myedit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="mydelete(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            @click="powerUser(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- pagenum总页数 -->
    <!-- page-sizes当前页 -->
    <!-- layout控制组件的内容-->
    <!-- total 总页数-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 新增 -->
    <el-dialog title="添加用户" :visible.sync="adddialog">
      <!-- {{addUser}} -->
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input autocomplete="off" v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input autocomplete="off" v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input autocomplete="off" v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input autocomplete="off" v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="addout">取 消</el-button>
        <el-button type="primary" @click="addUserFn">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑  -->
    <el-dialog title="修改用户" :visible.sync="editdialog">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input autocomplete="off" v-model="editUser.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input autocomplete="off" v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input autocomplete="off" v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialog=false">取 消</el-button>
        <el-button type="primary" @click="editUserFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog title="分配角色" :visible.sync="powerdialog">
      <!-- {{powerUserObj}} -->
      <el-form :v-model="powerUserObj">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="powerUserObj.username" :disabled="true"></el-input>
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- {{powerUserObj.rid}} -->
          <el-select v-model="powerUserObj.rid" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in selDataList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="powerdialog">取 消</el-button>
        <el-button type="primary" @click="powerUserFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 1.创建对应的组件
// 2.面包屑导航
// 2.1卡片
// 3.分页组件
// 4.查询调用接口打印数据
// 4.1  api：user   请求方法get    参数query pagenum pagesize
// 4.2  在请求头中以 Authorization 作为键，以 token 的值作为值来传递到服务器
// 5.将数据渲染到页面上

import { log } from "util";
export default {
  data() {
    return {
      tableData: [],
      //查询关键字
      query: "",
      //当前页
      pagenum: 1,
      //总页数
      pagesize: 5,
      //页量选项
      pagesizes: [2, 3, 5],
      //总条数
      total: 0,
      //删除的控制显示和隐藏
      adddialog: false,
      //编辑的控制显示和隐藏
      editdialog: false,
      // 权限的控制显示和隐藏
      powerdialog: false,
      //设置宽度
      formLabelWidth: "80px",
      //修改的数据
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //修改的数据
      editUser: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      powerUserObj: {
        username: "",
        id: "",
        rid: ""
      },
      selDataList: []
    };
  },
  methods: {
    //获取数据
    getTabData() {
      //调用接口
      this.$http({
        method: "get",
        url: `http://localhost:8888/api/private/v1/users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        //解构
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // console.log(data);

          //解决删除之后的bug
          if (data.users.length === 0 && this.pagenum !== 1) {
            this.pagenum--;
            this.getTabData();
            return;
          }
          //得到数据源
          this.tableData = data.users;
          //得到总页数
          this.total = data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTabData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTabData();
    },
    // 当点击搜索框执行
    search() {
      this.getTabData();
    },
    add() {
      this.adddialog = true;
    },
    addout() {
      this.adddialog = false;
    },
    addUserFn() {
      //将数据提交到服务器
      this.$http({
        method: "post",
        url: "http://localhost:8888/api/private/v1/users",
        data: this.addUser,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
          this.getTabData();
        } else {
          this.$message.error(res.data.meta.msg);
        }
        // 清空输入框
        this.addUser = "";
        // 清空新增面板
        this.adddialog = false;
      });
    },
    // 删除
    mydelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "delete",
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            headers: {
              Authorization: window.localStorage.getItem("token")
            }
          }).then(res => {
            // console.log(res);
            let { meta, data } = res.data;
            if (meta.status === 200) {
              this.getTabData();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑
    myedit(id) {
      this.$http({
        method: "get",
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        //结构
        let { meta, data } = res.data;
        if (meta.status === 200) {
          // 保存数据
          this.editUser.id = data.id;
          this.editUser.username = data.username;
          this.editUser.email = data.email;
          this.editUser.mobile = data.mobile;
          this.editdialog = true;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //按钮确定点击事件
    editUserFn() {
      //调用接口
      this.$http({
        //请求方式
        method: "put",
        //请求地址
        url: `http://localhost:8888/api/private/v1/users/${this.editUser.id}`,
        //请求参数
        data: {
          mobile: this.editUser.mobile,
          email: this.editUser.email
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.getTabData();
          this.editdialog = false;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 权限绑定事件
    powerUser(id) {
      this.$http({
        method: "get",
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.powerUserObj.username = data.username;
          this.powerUserObj.id = data.id;
          this.powerUserObj.rid = data.rid;
          // 获取下拉框的数据
          this.$http({
            method: "get",
            url: `http://localhost:8888/api/private/v1/roles`,
            headers: {
              Authorization: window.localStorage.getItem("token")
            }
          }).then(res => {
            let { meta, data } = res.data;
            if (meta.status === 200) {
              //给下拉框数据源赋值
              this.selDataList = data;
            }
          });
          this.powerdialog = true;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //确定按钮点击事件
    powerUserFn() {
      //调用接口
      this.$http({
        //请求方式
        method: "put",
        //请求地址
        url: `http://localhost:8888/api/private/v1/users/${
          this.powerUserObj.id
        }/role`,
        //请求头
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        //方法
        data: {
          rid: this.powerUserObj.rid
        }
      }).then(res => {
        //判断
        console.log(res);
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(meta.msg);
        }
        //关闭面板
        this.powerdialog = false;
      });
    },
    //开关状态设置事件
    //调用接口获取id和状态
    seIChange(uid, type) {
      this.$http({
        method: "put",
        url: `http://localhost:8888/api/private/v1/users/${uid}/state/${type}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // 获取数据
        console.log(res);
        // 结构
        let { meta, data } = res.data;
        // 判断
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    this.getTabData();
  }
};
</script>

<style>
.myinput {
  margin-top: 20px;
}
</style>
