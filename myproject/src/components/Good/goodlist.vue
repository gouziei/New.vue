<template>
  <el-card>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="success" plain class="mybtn" @click="addFn">添加分类</el-button>
    <!-- 表单 -->
    <el-table :data="pagelist" style="width: 100%">
      <!-- treeKey: 设置唯一标识 -->
      <!-- parentKey: 设置父元素的 id -->
      <!-- levelKey: 设置子元素级别 -->
      <!-- 要设置 -->
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        treekey="cat_id"
        parentkey="cat_id"
        prop="cat_name"
        label="分类名称"
        width="180"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level===0 ? '一级':scope.row.cat_level===1?"二级":"三级"}}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">{{scope.row.cat_deleted?"有效":"无效"}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="curChange"
      :current-page="pagenum"
      :page-size="pagesize"
      :page-sizes="pagesizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增 -->
    <el-dialog title="新增分类" :visible.sync="addDialog">
      <el-form label-position="right">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="cateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <!-- 级联框 -->
          {{ selValue }}
          <el-cascader clearable v-model="selValue" :options="selList" :props="propsObj"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagesize: 5,
      pagenum: 1,
      pagelist: [],
      total: 0,
      pagesizes: [5, 10, 15],
      addDialog: false,
      formLabelWidth: "80px",
      selList: [],
      selValue: [],
      propsObj: {
        checkStrictly: true,
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id"
      },
      cateName: ""
    };
  },
  methods: {
    //   获取数据
    getcreatList() {
      this.$http({
        method: "get",
        url: "http://localhost:8888/api/private/v1/categories",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.tableData = data;
          this.total = this.tableData.length;
          this.getpageList();
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 数据源得到的分页
    getpageList() {
      // 得到开始的下标
      let begin = this.pagesize * (this.pagenum - 1);
      // 结束的下标
      let end = this.pagesize * this.pagenum;
      //根据下标获取数据
      this.pagelist = this.tableData.slice(begin, end);
    },
    //当页面发生改变时
    curChange(currentPage) {
      this.pagenum = currentPage;
      // 重新获取数据
      this.getpageList();
    },
    // 当页容量改变时
    sizeChange(pagesize) {
      // 赋值
      this.pagesize = pagesize;
      // 重新获取数据
      this.getpageList();
    },
    addFn() {
      this.addDialog = true;
    },
    getTwoData() {
      this.$http({
        method: "GET",
        url: "http://localhost:8888/api/private/v1/categories?type=2",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          // 将数据保存起来
          this.selList = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    addCateFn() {
      // 得到当前分类的父 id
      let pid =
        this.selValue.length === 0
          ? 0
          : this.selValue[this.selValue.length - 1];
      // 得到当前 层级
      let level = this.selValue.length;
      this.$http({
        method: "POST",
        url: "http://localhost:8888/api/private/v1/categories",
        data: {
          cat_pid: pid, // 父元素的 id
          cat_name: this.cateName,
          cat_level: level
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.addDialog = false;
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    this.getcreatList();
    this.getTwoData();
  }
};
</script>

<style>
.mybtn {
  margin-top: 20px;
}
</style>
