<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div slot="header">
        <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <div>
        <!-- 步骤条区域 -->
        <el-steps
          :space="200"
          :active="activeIndex - 0"
          finish-status="success"
          align-center
        >
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          label-position="top"
        >
          <!-- tab 栏区域 -->
          <el-tabs
            v-model="activeIndex"
            :tab-position="'left'"
            :before-leave="beforeTabLeave"
            @tab-click="tabClicked"
          >
            <!-- 基本信息区域 -->
            <el-tab-pane
              label="基本信息"
              name="0"
            >
              <el-form-item
                label="商品名称"
                prop="goods_name"
              >
                <el-input
                  v-model="addForm.goods_name"
                  style="width: 70%"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品价格"
                prop="goods_price"
              >
                <el-input
                  v-model="addForm.goods_price"
                  style="width: 70%"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品重量"
                prop="goods_weight"
              >
                <el-input
                  v-model="addForm.goods_weight"
                  style="width: 70%"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品数量"
                prop="goods_number"
              >
                <el-input
                  v-model="addForm.goods_number"
                  style="width: 70%"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="商品分类"
                prop="goods_cat"
              >
                <el-cascader
                  expand-trigger="hover"
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"
                  style="width:30%"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品参数区域 -->
            <el-tab-pane
              label="商品参数"
              name="1"
            >
              <!-- 渲染表单的 item 项 -->
              <el-form-item
                v-for="item in manyTableData"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    v-for="(cb,i) in item.attr_vals"
                    :key="i"
                    :label="cb"
                    border
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品属性区域 -->
            <el-tab-pane
              label="商品属性"
              name="2"
            >
              <!-- 渲染表单的 item 项 -->
              <el-form-item
                v-for="item in onlyTableData"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品图片区域 -->
            <el-tab-pane
              label="商品图片"
              name="3"
            >
              <!-- action 表示图片要上传的后台 API 地址 -->
              <el-upload
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headersObj"
                :on-success="handleSuccess"
              >
                <el-button
                  size="small"
                  type="primary"
                >点击上传</el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <!-- 商品内容区域 -->
            <el-tab-pane
              label="商品内容"
              name="4"
            >
              <!-- 富文本编辑器组件 -->
              <quill-editor v-model="addForm.goods_introduce">
              </quill-editor>
              <!-- 添加商品的按钮 -->
              <el-button
                type="primary"
                class="addBtn"
                @click="add"
              >添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <!-- 图片预览的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
      >
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      //添加商品的数据表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 1,
        // 商品所属的分类数组
        goods_cat: [],
        //上传图片的数组
        pics: [],
        // 介绍
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      //商品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //商品参数数据
      manyTableData: [],
      //商品属性数据
      onlyTableData: [],
      // 上传图片的 URL 地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的 headers 请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewDialogVisible: false
    }
  },
  created() {
    this.getCateLists()
  },
  methods: {
    //获取所有商品分类数据
    async getCateLists() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择器选中项变化处理事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = []
    },
    // 切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.mag)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.mag)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移出图片操作
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从 pics 数组中找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象 push 到 pics 数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        // 执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起请求添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        console.log(res.data)

        this.$router.push('/goods')
      })
    }
  },
  computed: {
    //   当前选中商品的分类 id
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style> 
