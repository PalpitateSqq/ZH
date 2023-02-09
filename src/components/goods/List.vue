<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table
        :data="goodsList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80px"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="140px"
        >
          <template slot-scope="scope">
            {{scope.row.add_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editGoodsList"
        :rules="editGoodsListRules"
        ref="editGoodsListRef"
        label-width="80px"
      >
        <el-form-item
          label="商品 ID"
          style="width:90%"
        >
          <el-input
            disabled
            v-model="editGoodsList.goods_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editGoodsList.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editGoodsList.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editGoodsList.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="editGoodsList.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input v-model="editGoodsList.goods_introduce"></el-input>
        </el-form-item>

      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editGood"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //总条数
      total: 0,
      //商品列表
      goodsList: [],
      editDialogVisible: false,
      // 编辑后的商品数据
      editGoodsList: {},
      // 编辑后的商品数据校验
      editGoodsListRules: {
        nonempty: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      //根据分页获取对应的商品列表
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据 id 删除对应的商品
    async removeById(id) {
      await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击添加商品按钮处理事件
    goAddpage() {
      this.$router.push('/goods/add')
    },
    // 点击编辑按钮展示对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editGoodsList = res.data
    },
    // 点击确认提交编辑按钮
    editGood() {
      // 对表单进行校验
      this.$refs.editGoodsListRef.validate(async valid => {
        if (!valid) return
        //发起添加用户请求
        const { data: res } = await this.$http.put(`goods/${this.editGoodsList.goods_id}`, this.editGoodsList)
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 隐藏对话框
        this.editDialogVisible = false
        this.getGoodsList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
