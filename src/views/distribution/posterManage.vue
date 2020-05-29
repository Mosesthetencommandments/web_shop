<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="float: right;">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit highlight-current-row border style="width: 100%;margin-top: 20px;">
      <el-table-column label="ID" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海报名称" min-width="250" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海报图片" min-width="250" align="center">
        <template slot-scope="scope">
          <img style="width: 100px;height: 100px;" :src="scope.row.img_url" @click="handlePictureCardPreview1(scope.row.img_url)"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini">{{scope.row.status | sideStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="update(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delete1(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--图片上传预览-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="dialogPoster">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item label="海报名称" label-width="20%" prop="name">
          <el-input type="text" v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="海报图片" label-width="20%" prop="img_url">
          <el-upload
            :action="baseUrl"
            name="image"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-success="handleUp"
            multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件,图片大小不能超过１M</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPoster = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getdDistributionPosterList, getDistributionPosterInfo, createDistributionPoster, updateDistributionPoster, deleteDistributionPoster } from '@/api/distribution'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'posterManage',
    directives: {
      waves
    },
    data() {
      return {
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: [],
        tableKey: 0,
        rule: {
          name: [{ required: true, message: '请正确填写海报名称', trigger: 'change' }],
        },
        temp: {
          img_url: undefined,
          status: 1,
          name: undefined
        },
        listQuery: {
          page: 1,
          page_size: 10
        },
        btnLoading: false,
        list: [],
        total: null,
        listLoading: false,
        dialogImageUrl: '',
        dialogVisible: undefined,
        dialogPoster: false,
        dialogStatus: ''
      }
    },
    filters: {
      sideStatus(status) {
        const statusTransMap = {
          1: '启用',
          2: '禁用'
        }
        return statusTransMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getdDistributionPosterList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.tableKey++
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      update(row) {
        this.dialogStatus = 'update'
        this.dialogPoster = true
        this.shop_distribution_poster_id = row.id
        getDistributionPosterInfo({ shop_distribution_poster_id: row.id }).then(response => {
          this.temp = response.data
          this.fileList = [
            {
              url: row.img_url
            }
          ]
          this.dialogPoster = true
          this.$nextTick(() => {
            this.$refs['dateForm'].clearValidate()
          })
        })
      },
      delete1(row) {
        this.$confirm('此操作将永久删除海报, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            shop_distribution_poster_id: row.id
          }
          deleteDistributionPoster(ttempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            // this.handleUpdateShopGoodsDetail(this.price1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      create() {
        this.dialogStatus = 'create'
        this.dialogPoster = true
        this.resetemp()
        this.fileList = []
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
          console.log(this.$refs)
        })
      },
      createData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            createDistributionPoster(this.temp).then(response => {
              this.getList()
              this.dialogPoster = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.btnLoading = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      updateData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.shop_distribution_poster_id = this.shop_distribution_poster_id
            console.log(tempData.shop_distribution_poster_id)
            updateDistributionPoster(tempData).then(response => {
              this.getList()
              this.dialogPoster = false
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
      // 图片上传
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handlePictureCardPreview1(img_url) {
        this.dialogImageUrl = img_url
        this.dialogVisible = true
      },
      handleRemove() {
        this.temp.img_url = ''
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!')
        }
        return isJPG && isLt2M
      },
      handleUp(response, file, fileList) {
        this.temp.img_url = response.data.url
        console.log(this.temp)
      },
      // 分页
      resetemp() {
        this.temp = {
          img_url: undefined,
          status: 1,
          name: undefined
        }
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
