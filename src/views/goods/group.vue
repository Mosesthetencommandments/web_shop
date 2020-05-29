<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="域名" v-model="listQuery.domain_name">-->
      <!--</el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="IP" v-model="listQuery.ip">-->
      <!--</el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资质信息" v-model="listQuery.copyright">-->
      <!--</el-input>-->
      <!--<el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">-->
        <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">刷新</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.icon !== null " style="width: 100px;height: 100px;"  :src="scope.row.icon"  alt="">
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="分组名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.group_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="分组排序">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="所属分类">
        <template slot-scope="scope">
          {{scope.row.function_use|groupFuncTranslator}}
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="开启状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleGroupValues(scope.row)">关联商品</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="分组名称" prop="group_name">
          <el-input v-model="temp.group_name"></el-input>
        </el-form-item>
        <el-form-item label="分组排序" prop="sort">
          <el-input type="number" min="1" max="99" v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="分组图标">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            v-model="temp.icon"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlePictureSuccess"
            :file-list="fileList"
            name="image">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类轮播图">
          <el-upload
            :action="uploadUrl"
            name="image"
            :file-list="fileList1"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove1"
            :on-success="handlePictureSuccess1"
            multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件,图片大小不能超过2M</span>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="分组类别" prop="function_use">
          <el-radio-group v-model="temp.function_use" size="medium">
            <el-radio-button label="0">首页导航</el-radio-button>
            <el-radio-button label="1">功能分组</el-radio-button>
            <el-radio-button label="2">活动分组</el-radio-button>
            <el-radio-button label="3">商品分类</el-radio-button>
            <el-radio-button label="4">积分商品</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="remark">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" size="medium">
          <el-radio-group v-model="temp.status">
            <el-radio-button label="0">禁用</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShopGoodsGroupList, updateShopGoodsGroup, createShopGoodsGroup, deleteShopGoodsGroup } from '@/api/group_goods'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'species',
  directives: {
    waves
  },
  data() {
    return {
      scrollTop: 0,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
        copyright: undefined,
        domain_name: undefined,
        ip: undefined,
        sort: '-id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showAuditor: false,
      temp: {
        id: undefined,
        goods_category: {},
        group_name: '',
        sort: '',
        icon: '',
        img: [],
        remark: '',
        function_use: undefined,
        url: '',
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        domain_name: [{ required: true, message: '请正确填写域名名称', trigger: 'change' }]
      },
      categoryOptions: [],
      props: {
        value: 'id',
        children: 'son',
        label: 'category_name'
      },
      uploadUrl: process.env.BASE_API + '/api/document/uploadImage',
      fileList: [],
      fileList1: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    groupFuncTranslator(func) {
      const statusMap = {
        0: '首页导航',
        1: '功能分组',
        2: '活动分组',
        3: '商品分类',
        4: '积分商品'
      }
      return statusMap[func]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handlePictureSuccess1(response, file, fileList) {
      this.temp.img.push(response.data.url)
    },
    handleRemove1(file, fileList) {
      this.temp.img = []
      for (const item of fileList) {
        this.temp.img.push(item.url)
      }
    },
    handlePictureSuccess(response, file, fileList) {
      this.temp.icon = response.data.url
    },
    handleRemove(file, fileList) {

    },
    handlePictureCardPreview(file) {

    },
    getList() {
      this.listLoading = true
      getShopGoodsGroupList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        goods_category: {},
        group_name: '',
        sort: '',
        icon: '',
        img: [],
        remark: '',
        function_use: undefined,
        url: '',
        status: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createShopGoodsGroup(this.temp).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.total++
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleGroupValues(row) {
      this.$router.push({ name: 'group_goods', params: { group_id: row.id }})
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.fileList = [{ name: 0, url: this.temp.icon }]
      if (this.temp.img === '' || this.temp.img === null || this.temp.img === undefined) {
        this.temp.img = []
      }
      this.fileList1 = []
      for (const v in this.temp.img) {
        this.fileList1.push({ name: 0, url: this.temp.img[v] })
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({ }, this.temp)
          updateShopGoodsGroup(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleSwitch(row) {
      updateShopGoodsGroup({ id: row.id, status: row.status }).then(res => {
        this.$message.success('修改成功')
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ttempData = {
          id: row.id
        }
        deleteShopGoodsGroup(ttempData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.total--
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  deactivated() {
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  },
  activated() {
    window.scrollTo(0, this.scrollTop)
  }
}
</script>
