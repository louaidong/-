<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>上商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-row>
    <el-col>
      <el-button type = 'primary' @click= 'showAddCateDialog'>添加分类</el-button>
    </el-col>
  </el-row>
  <tree-table class='tree-table' :data = 'cateList' :columns="columns" :selection-type='false' :expand-type='false' :show-index='true' border
      :show-row-hover='false'>
  <template slot="isok" slot-scope= 'scope'>

    <i class="el-icon-success" v-if = 'scope.row.cat_deleted === false' style="color: lightgreen"></i>
    <i class="el-icon-error" style="color: red" v-else></i>
  </template>
  <template slot="order" slot-scope= 'scope'>
    <el-tag size='mini' v-if="scope.row.cat_level===0">一级</el-tag>
    <el-tag type = 'success' size='mini' v-else-if = "scope.row.cat_level===1">二级</el-tag>
    <el-tag type = 'warning' size='mini' v-else>三级</el-tag>
  </template>
  <template slot="opt" >
    <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
    <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
  </template>
  </tree-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="添加分类"
  :visible.sync="addcatDialogVisible"
  width="50%"
  @close="addCateDialogClosed">
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCatChange"
    clearable
    change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addcatDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addcatDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0

      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  methods: {
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$messagee.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addcatDialogVisible = false
      })
    },
    parentCatChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async getParentList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级元素失败')
      }
      this.parentCateList = res.data
    },
    showAddCateDialog () {
      this.getParentList()
      this.addcatDialogVisible = true
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    }
  },
  created () {
    this.getCateList()
  }

}
</script>

<style lang='less' scoped>
  .tree-table{
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>
