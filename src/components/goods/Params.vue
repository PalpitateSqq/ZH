<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row id="cat_opt">
        <el-col>
          <span> 选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleCateChanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数的面板 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表单 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框(blur：定义函数 当触发 enter/native 都触发 blur) -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数的面板 -->
        <el-tab-pane
          label="静态参数"
          name="only"
        >
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态参数表单 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框(blur：定义函数 当触发 enter/native 都触发 blur) -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+ titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormParamsRef"
        label-width="80px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input
            v-model="addForm.attr_name"
            style="width:90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑'+ titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormParamsRef"
        label-width="80px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input
            v-model="editForm.attr_name"
            style="width:90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        //子节点
        children: 'children'
      },
      //级联选择框双向绑定的数组
      selectedCateKeys: [],
      //tab 默认被激活的页签名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据
      addForm: {
        attr_name: ''
      },
      // 添加参数的表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制编辑参数对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑的表单数据对象
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
      this.cateList = res.data
    },
    // 级联选择框选中项变化事件
    handleCateChanged() {
      this.getParamsDate()
    },
    // tab 页签点击事件处理函数
    handleTabClick() {
      this.getParamsDate()
    },
    // 获取参数的列表数据
    async getParamsDate() {
      //   判断是否选中三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所愿分类的 id 和当前所处的面板来获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 对数据进行处理
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') this.manyTableData = res.data
      else this.onlyTableData = res.data
    },
    // 监听添加参数对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormParamsRef.resetFields()
    },
    // 点击按钮添加参数
    addParams() {
      // 对表单预验证
      this.$refs.addFormParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getParamsDate()
      })
    },
    // 点击按钮，展示修改的对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑参数对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormParamsRef.resetFields()
    },
    // 点击按钮提交修改的参数信息
    editParams() {
      this.$refs.editFormParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    // 根据 id 删除对应的参数项
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsDate()
    },
    // 文本框失去焦点或摁下回车键的触发事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 对 attr_vals 的操作保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 点击按钮展示文本框
    showInput(row) {
      row.inputVisible = true
      // 文本框自动获得焦点 $nextTick：当页面上的元素被重新渲染之后才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的 id
    cateId() {
      if (this.selectedCateKeys.length !== 3) return null
      return this.selectedCateKeys[2]
    },
    // 动态计算对框的标题文本
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
#cat_opt {
  margin: 15px 0;

  .el-col {
    display: flex;
    align-items: center;
    span {
      float: left;
    }
    .el-cascader {
      float: left;
      width: 30%;
    }
  }
}
.input-new-tag {
  width: 120px;
}
</style>
