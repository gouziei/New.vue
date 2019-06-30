<template>
  <el-card>
    <!--导航 -->
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
          <el-button slot="append" icon="el-icon-search" class="myinput" @click.prevent="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click.prevent="$router.push('/params')">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodlist" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="300"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="200"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="300"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="curChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodlist: [],
      total: 0,
      pagesize: 10,
      pagenum: 1,
      pagesizes: [10, 20, 30],
      query: ""
    };
  },
  methods: {
    // 获取数据
    getClaasList() {
      this.$http({
        method: "get",
        url: `http://localhost:8888/api/private/v1/goods?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.total = data.total;
          this.goodlist = data.goods;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //页容量
    curChange(pagenum) {
      this.pagenum = pagenum;
      this.getClaasList();
    },
    //当前页
    sizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getClaasList();
    },
    //搜索框
    search() {
      this.getClaasList();
    }
  },
  mounted() {
    this.getClaasList();
  }
};
</script>

<style>
.myinput {
  margin-top: 20px;
}
</style>
