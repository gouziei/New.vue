<template>
  <el-card>
    <!--导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 禁用消息提示框-->
    <el-alert title="添加商品信息" type="info" center show-icon class="myinput"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tag -->
    <el-tabs tabPosition="left" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form label-position="top" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="addObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="name">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="name">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="name">
            <el-input v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="name">
            {{ cateVal }}
            <el-cascader :options="cateList" :props="propsObj" v-model="cateVal"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="two">
        <div v-for="(item,index) in goodsMany" :key="index">
          <div class="mydiv">{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-for="(val, index) in item.attr_vals.split(',')"
              :key="index"
              v-model="checked"
              border
            >{{ val }}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <el-form label-position="top" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item v-for="(item, index) in goodsMony" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- action：图片上传的地址 -->
        <!-- 由于后台服务器需要添加 token 才能接收信息，所以需要在上传的图片请求中也添加 token(添加到请求头中) -->
        <!-- on-preview：钩子函数，可以添加一段逻辑代码：当上传的图片被点击时执行 -->
        <!-- on-success：文件成功时执行的函数 -->
        <!-- on-remove：文件移除时执行的函数 -->
        <!-- on-preview： 点击文件列表中已经上传过的图片时触发 -->
        <!-- list-type：上传元素显示的方式： 以图片方式显示 -->
        <el-upload
          :on-preview="mypreview"
          :on-remove="remove"
          :on-success="uploadSuccess"
          class="upload-demo"
          :headers="uploadheader"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        {{ fileList }}
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
        <el-button type="primary" @click="addgoodsFn">添加商品</el-button>
        <!-- 富文本 -->
        <quill-editor ref="myQuillEditor" v-model="content"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="预览图片" :visible.sync="imgDialog">
      <!-- 预览的图片 -->
      <img ref="myimg" src alt />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //步骤条激活下标
      active: 0,
      //tab 选项的默认选中下标
      activeName: "first",
      //  分类及数据源
      cateList: [],
      //  下拉框配置项
      propsObj: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id"
      },
      //级连框数据
      cateVal: [],
      // 商品参数
      goodsMony: [],
      //商品属性
      goodsMany: [],
      //默认选中
      checked: true,
      uploadheader: {
        Authorization: window.localStorage.getItem("token")
      },
      // 上传的图片集合
      fileList: [],
      // 预览图片框
      imgDialog: false,
      content: "我是富文本",
      addObj: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: ""
      }
    };
  },
  methods: {
    // tag被点击触发
    tabClick(tag) {
      //步骤条同步
      this.active = +tag.index;
      if (tag.index === "1") {
        this.getParms("many");
      }
      if (tag.index === "2") {
        this.getParms("only");
      }
    },
    //获取级连框的数据
    getCateList() {
      this.$http({
        method: "get",
        url: "http://localhost:8888/api/private/v1/categories",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.cateList = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //获取商品数据
    getParms(sel) {
      if (this.cateVal.length !== 0) {
        this.$http({
          method: "get",
          url: `http://localhost:8888/api/private/v1/categories/${
            this.cateVal[this.cateVal.length - 1]
          }/attributes?sel=${sel}`
        }).then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
            if (sel === "only") {
              this.goodsMony = data;
            } else {
              this.goodsMany = data;
              console.log(0);
            }
          } else {
            this.$message.error(meta.msg);
          }
        });
      } else {
        this.$message.error("请选择商品分类");
      }
    },
    uploadSuccess(response, file, fileList) {
      this.fileList.push(response.data.tmp_path);
    },
    remove(file, fileList) {
      let img = file.response.data.tmp_path;
      this.fileList.forEach((item, index) => {
        if (item === img) {
          this.fileList.splice(index, 1);
        }
      });
    },
    // 预览图片
    mypreview(file) {
      // 得到图片的在线地址
      var img = file.response.data.url;
      // 渲染到一个对话框中
      // 打开对话框
      this.imgDialog = true;
      // 当页面渲染完成后，会马上执行（将回调延迟到下次 DOM 更新循环之后执行）
      this.$nextTick(() => {
        this.$refs.myimg.src = img;
      });

      // setTimeout(() => {
      //     // 将图片进行显示
      //     this.$refs.myimg.src = img
      //     console.log(this.$refs)
      // }, 1000)
    },
    addgoodsFn() {
      this.addObj.goods_cat = this.cateVal.join(",");
      this.$http({
        method: "post",
        url: "http://localhost:8888/api/private/v1/goods",
        data: {
          ...this.addObj,
          goods_introduce: this.content
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta } = res.data.data;
        if (meta.status === 201) {
          this.$message.success(meta.msg);
          this.$router.push('/goods')
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style scope>
.myinput {
  margin-top: 20px;
}

.el-steps--horizontal {
  margin-top: 20px;
}
.el-tabs--left {
  margin-top: 20px;
}
label.el-checkbox.is-bordered.is-checked {
  margin-right: 0px;
}
.mydiv {
  margin: 20px 0;
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  height: 200px;
}
</style>
