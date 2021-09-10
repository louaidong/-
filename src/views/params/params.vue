<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-alert
    title="注意: 只允许为第三级分类设置相关数据"
    type="warning"
    :closable='false'
    show-icon>
  </el-alert>
  <el-row class="cat_opt">
    <el-col>
      <span>选择商品分类:</span>
     <el-cascader
    v-model="selectedCateKeys"
    :options="cateList"
    :props="cateProps"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type='primary' size = 'mini' :disabled='isDisabled' @click="addDialogVisible = true">添加参数</el-button>
      <el-table :data="manyTabData" border stripe>
                <el-table-column type = 'expand'>
                   <template slot-scope = 'scope'>
                    <el-tag v-for = '(item, i) in scope.row.attr_vals' :key='i' closable @close="headleClose(i,scope.row)">
                      {{item}}
                    </el-tag>
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
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
        <el-table-column type = 'index'></el-table-column>
        <el-table-column label= '参数名称' prop = 'attr_name'></el-table-column>
        <el-table-column label= '操作'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size = 'mini' @click = 'showEditDialog(scope.row.attr_id)'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size = 'mini' @click = 'removeParams(scope.row.attr_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
       <el-button type='primary' size = 'mini' :disabled='isDisabled' @click="addDialogVisible = true">添加属性</el-button>
       <el-table :data="onlyTabData" border stripe>
                <el-table-column type = 'expand'>
                   <template slot-scope = 'scope'>
                    <el-tag v-for = '(item, i) in scope.row.attr_vals' :key='i' closable @close="headleClose(i,scope.row)">
                      {{item}}
                    </el-tag>
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
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
        <el-table-column type = 'index'></el-table-column>
        <el-table-column label= '属性名称' prop = 'attr_name'></el-table-column>
        <el-table-column label= '操作'>
          <template slot-scope="scope">

            <el-button type="primary" icon="el-icon-edit" size = 'mini' @click = 'showEditDialog(scope.row.attr_id)'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size = 'mini' @click = 'removeParams(scope.row.attr_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<el-dialog
  :title="'添加' + titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close = 'addDialogClosed'>
 <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addFrom.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible  =false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  :title="'修改' + titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close = 'editDialogClosed'>
 <el-form :model="editFrom" :rules="addFromRules" ref="editFromRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editFrom.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible  =false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      addDialogVisible: false,
      addFrom: {
        attr_name: ''
      },
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editFrom: {},
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    headleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrValue(row)
    },
    handleTabClick () {
      this.getParamsData()
    },
    handleChange () {
      this.getParamsData()
    },
    async getCateLits () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    async getParamsData () {
      console.log(this.activeName)
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },
    addParams () {
      this.$refs.addFromRef.validate(async vaild => {
        if (!vaild) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addFrom.attr_name,
          attr_sel: this.activeName
        })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.message.error('获取参数信息失败!')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    editParams () {
      this.$refs.editFromRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          })
        console.log(this.editFrom.activeName)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    async saveAttrValue (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    showInput (row) {
      row.inputVisible = true
    }
  },
  computed: {
    isDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created () {
    this.getCateLits()
  }
}
</script>

<style lang='less' scope>
  .cat_opt{
    margin: 15px 0;
  }
  .el-tag {
    margin: 5px
  }
  .input-new-tag {
    width: 120px !important;
  }
</style>
