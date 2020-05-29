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
      <el-table-column min-width="200px" align="center" label="规格名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.species_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="所属分类">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.goods_category.category_name}}</span>
        </template>
      </el-table-column>
         <el-table-column min-width="50px" align="center" label="备注">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.species_remark}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleSpeciesValues(scope.row)">规格明细</el-button>
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="规格名称" prop="species_name">
          <el-input v-model="temp.species_name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-cascader
            change-on-select
            :options="categoryOptions"
            style="width: 100%"
            v-model="temp.category_ids"
            :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.species_remark"></el-input>
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
import { getShopSpeciesList, createShopSpecies, updateShopSpecies, deleteShopSpecies, createShopSpeciesValue, updateShopSpeciesValue, getShopSpeciesValueList, deleteShopSpeciesValue,} from '@/api/species'
import { getShopGoodsCategoryTree } from '@/api/goods'
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
        category_id: undefined,
        goods_category: {},
        species_name: '',
        category_ids: [],
        remark:undefined,
        species_remark:undefined,
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
      }
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
    }
  },
  created() {
    this.getList()
    this.getGoodsCategoryTree()
  },
  methods: {
    getGoodsCategoryTree() {
      getShopGoodsCategoryTree().then(res => {
        this.categoryOptions = res.data
      })
    },
    getList() {
      this.listLoading = true
      getShopSpeciesList(this.listQuery).then(response => {
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
        category_id: undefined,
        goods_category: {},
        species_name: '',
        category_ids: []
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
          if (this.temp.category_ids.length > 0) {
            this.temp.category_id = this.temp.category_ids[this.temp.category_ids.length - 1]
          }
          this.temp.remark  = this.temp.species_remark
          createShopSpecies(this.temp).then(response => {
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
    handleSpeciesValues(row) {
      this.$router.push({ name: 'species_value', params: { species_id: row.id }})
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp.category_ids)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.remark  = this.temp.species_remark
          const tempData = Object.assign({ shop_species_id: undefined }, this.temp)
          tempData.shop_species_id = this.temp.id
          updateShopSpecies(tempData).then(() => {
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ttempData = {
          shop_species_id: row.id
        }
        deleteShopSpecies(ttempData).then(response => {
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
