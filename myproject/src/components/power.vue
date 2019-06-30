<template>
  <el-card>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" class="myTable">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
              {{scope.row.level==="0"?'一级':scope.row.level==="1"?'二级':'三级'}}
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getPowerList() {
      this.$http({
        method: "get",
        url: `http://localhost:8888/api/private/v1/rights/list`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // 获取数据
        console.log(res);
        // 解构
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
        //   获取数据
          this.tableData=data
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
      this.getPowerList()
  }
};
</script>

<style>
.myTable {
  margin-top: 20px;
}
</style>
