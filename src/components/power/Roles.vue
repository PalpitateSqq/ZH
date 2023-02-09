<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input
            placeholder="请输入查询角色ID"
            v-model="addRoleKeys"
            type="number"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRolesList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button
            type="primary"
            @click="addRolesForm"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdBottom',i===0 && 'bdTop','vcenter']"
              v-for="(item,i) in scope.row.children"
              :key="item.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="4">
                <el-tag
                  type="success"
                  closable
                  @close="removeRightById(scope.row,item.id)"
                > {{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="20">
                <!-- 通过 for 循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2!==0 &&'bdTop','vcenter']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}} </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
        >
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        >
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row.id)"
              round
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="removeRoleById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                round
                @click="showSetRightDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="setRolesDialogVisibleClose"
    >
      <el-form
        :model="addRolesList"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesDialogClose"
    >
      <el-form
        :model="editRolesList"
        :rules="addRolesRules"
        ref="editRolesRef"
        label-width="100px"
      >
        <el-form-item
          label="角色 ID"
          prop="roleId"
        >
          <el-input
            disabled
            v-model="editRolesList.roleId"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRolesBtn"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 属性控件的数据绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点 id 值
      defKeys: [],
      // 当前要分配权限的角色 id
      roleId: '',
      // 控制添加角色对话框的显示与隐藏
      addRolesDialogVisible: false,
      // 添加角色信息
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色校验
      addRolesRules: {
        roleId: [{ required: true, message: '请输入角色 ID', trigger: 'blur' }],
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      addRoleKeys: '',
      editRolesDialogVisible: false,
      editRolesList: {}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      this.rolesList = []
      if (this.addRoleKeys) {
        const { data: res } = await this.$http.get(`roles/${this.addRoleKeys}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // this.rolesList = res.data
        this.$set(this.rolesList, 0, res.data)
      } else {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rolesList = res.data
      }
    },
    // 根据 id 删除对应的权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.info('您已取消删除该权限！')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('您已删除该权限！')
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) this.$message.err(res.meta.msg)
      // 获取到的权限数据保存的data中
      this.rightsList = res.data
      // 递归获取三级节点的 id
      this.getleafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      this.$message.success(res.meta.msg)
    },
    // 通过递归的形式获取角色下所有的三级权限的 id ，并保存到 defKeys 中
    getleafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getleafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 点击添加角色按钮处理事件
    addRolesForm() {
      this.addRolesDialogVisible = true
    },
    // 添加角色
    async addRoles() {
      const { data: res } = await this.$http.post('roles', this.addRolesList)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.addRolesDialogVisible = false
      this.getRolesList()
    },
    setRolesDialogVisibleClose() {
      this.addRolesList.roleName = ''
      this.addRolesList.roleDesc = ''
    },
    // 根据 ID 查询角色
    async getRolesById(id) {
      // const { data: res } = await this.$http.get(`roles/${id}`)
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // return res.data
    },
    // 点击编辑按钮事件
    async editRoles(id) {
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRolesList = res.data
    },
    editRolesDialogClose() {
      this.$refs.editRolesRef.resetFields()
    },
    editRolesBtn() {
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) return this.$message.error('用户数据格式错误！')
        const { data: res } = await this.$http.put(`roles/${this.editRolesList.roleId}`, {
          roleName: this.editRolesList.roleName,
          roleDesc: this.editRolesList.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.editRolesDialogVisible = false
      })
    },
    removeRoleById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdBottom {
  border-bottom: 1px solid #ccc;
}
.bdTop {
  border-top: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 15px;
}
</style>
