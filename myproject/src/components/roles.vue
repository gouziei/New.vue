<template>
  <el-card>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮添加角色 -->
    <el-button round class="myBtn">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 通过设置 type="expand" 和 Scoped slot 可以开启展开行功能， -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 遍历1级权限 -->
          <el-row v-for='(item1,index1) in scope.row.children' :key="index1">
            <!-- 生成一级权限 -->
            <el-col :span="4">
              <!-- el-tag设置标签页 closable移除 -->
              <el-tag closable @close="remove(scope.row.id,item1.id,scope)">{{ item1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 遍历二级权限 -->
              <el-row v-for="(item2, index2,) in item1.children" :key="index2">
                <!-- 生成二级权限 -->
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="remove(scope.row.id,item2.id,scope)"
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20" class="myCol">
                  <el-tag
                    closable
                    @close="remove(scope.row.id,item3.id,scope)"
                    type="warning"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
            @click="openList(scope.row.children,scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配面板 -->
    <el-dialog title="分配角色" :visible.sync="rolesdialog">
      <!-- 树形结构 -->
      <el-tree
        ref="mytree"
        :default-checked-keys="defaultChecked"
        node-key="id"
        show-checkbox
        :data="rolesList"
        :default-expand-all="true"
        :props="defaultProos"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="setRightFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
 
<script>
import { type } from "os";
export default {
  data() {
    return {
      //数据源
      tableData: [],
      // 面板开关
      rolesdialog: false,
      //所有权限数据
      rolesList: [],
      // data:[],
      defaultProos: {
        label: "authName",
        children: "children"
      },
      defaultChecked: [],
      setRoleId: 0
    };
  },
  methods: {
    getRolesList() {
      this.$http({
        method: "get",
        url: "http://localhost:8888/api/private/v1/roles",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.tableData = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 删除权限
    remove(roleId, rightId, scope) {
      // console.log(1);
      this.$http({
        method: "delete",
        url: `http://localhost:8888/api/private/v1/roles/${roleId}/rights/${rightId}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        console.log(2);
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          console.log(3);
          // scope.row.children = data;
          scope.row.children= data
          console.log(8);
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 打开分配面板
    openList(rightsData, id) {
      console.log(id);
      this.setRoleId = id;
      this.defaultChecked = [];
      this.$http({
        method: "get",
        url: "http://localhost:8888/api/private/v1/rights/tree",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.rolesList = data;
          this.rolesdialog = true;
          rightsData.forEach(item1 => {
            item1.children.forEach(item2 => {
              item2.children.forEach(item3 => {
                this.defaultChecked.push(item3.id);
              });
            });
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //设置权限
    setRightFn() {
      let idsAll = this.$refs.mytree.getCheckedKeys();
      let idsHarf = this.$refs.mytree.getHalfCheckedKeys();
      let ids = [...idsAll, ...idsHarf];
      ids = ids.join(",");

      this.$http({
        method: "post",
        url: `http://localhost:8888/api/private/v1/roles/${
          this.setRoleId
        }/rights`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        data: {
          rids: ids
        }
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.getRolesList();
        } else {
          this.$message.error(meta.msg);
        }
      });
      this.rolesdialog = false;
    }
  },
  mounted() {
    this.getRolesList();
  }
};
</script>

<style>
.myBtn {
  margin-top: 20px;
}
</style>
