<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item filter-float">
        <el-button style="float:right;" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button style="float:right;" type="primary" v-waves @click="create">添加</el-button>
      </div>
      <div style="clear:both;"></div>
    </div>
    <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit highlight-current-row border style="width: 100%;margin-top: 20px;">
      <el-table-column label="ID" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="图片" width="200" align="center">
        <template slot-scope="scope">
          <img style="width: 100px;height: 100px;" :src="scope.row.img_url" @click="handlePicture(scope.row.img_url)"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="轮播图名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini">{{scope.row.type | sideStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="链接">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.link}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
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
    <el-dialog :visible.sync="dialogBanner">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item label="轮播图描述" label-width="20%" prop="remark">
          <el-input type="text" v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="图片素材" label-width="20%" prop="img_url">
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
        <el-form-item label="链接地址" label-width="20%" prop="link">
          <el-input type="text" v-model="temp.link"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="20%">
          <el-radio-group v-model="temp.type" size="small">
            <el-radio-button label="1">站内</el-radio-button>
            <el-radio-button label="2">站外</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" label-width="20%" prop="sort">
          <el-input type="text" v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBanner = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getShopBannerList, getShopBannerInfo, updateShopBanner, createShopBanner, deleteShopBanner } from '@/api/setting'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'bannerManage',
    directives: {
      waves
    },
    data() {
      return {
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: [],
        listQuery: {
          page: 1,
          page_size: 10
        },
        tableKey: 0,
        list: [],
        total: null,
        listLoading: false,
        dialogBanner: false,
        dialogStatus: '',
        rule: {
          link: [{ required: true, message: '请正确填写链接', trigger: 'change' }],
          remark: [{ required: true, message: '请正确填写轮播图描述', trigger: 'change' }],
          sort: [{ required: true, message: '请正确填写排序', trigger: 'change' }]
        },
        temp: {
          type: '1',
          img_url: undefined,
          link: undefined,
          remark: undefined,
          sort: undefined
        },
        dialogImageUrl: '',
        dialogVisible: undefined,
        btnLoading: false,
        textMap: {
          create: '创建',
          update: '编辑'
        }
      }
    },
    filters: {
      sideStatus(status) {
        const statusTransMap = {
          1: '站内',
          2: '站外'
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
        getShopBannerList(this.listQuery).then(response => {
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
      create() {
        this.dialogStatus = 'create'
        this.dialogBanner = true
        this.resetemp()
        this.fileList = []
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
          console.log(this.$refs)
        })
      },
      // 创建确定
      createData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            createShopBanner(this.temp).then(response => {
              this.getList()
              this.dialogBanner = false
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
      delete1(row) {
        this.$confirm('此操作将永久删除轮播图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            shop_banner_id: row.id
          }
          deleteShopBanner(ttempData).then(response => {
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
      update(row) {
        this.dialogStatus = 'update'
        this.dialogBanner = true
        this.shop_banner_id = row.id
        console.log(this.shop_banner_id)
        getShopBannerInfo({ shop_banner_id: row.id }).then(response => {
          this.temp = response.data
          this.fileList = [
            {
              url: row.img_url
            }
          ]
          this.dialogBanner = true
          this.$nextTick(() => {
            this.$refs['dateForm'].clearValidate()
          })
        })
      },
      updateData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.shop_banner_id = this.shop_banner_id
            console.log(tempData)
            updateShopBanner(tempData).then(response => {
              this.getList()
              this.dialogBanner = false
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handlePicture(img_url) {
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
      resetemp() {
        this.temp = {
          type: '1',
          img_url: undefined,
          link: undefined,
          remark: undefined,
          sort: undefined
        }
      },
      // 分页
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
