<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item filter-float">
        <el-button style="float:right;" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button style="float:right;" type="primary" v-waves @click="create">添加</el-button>
        <el-button style="float:right;" type="primary" v-waves @click="postShopWxMenu">生成菜单</el-button>
      </div>
      <div style="clear:both;"></div>
    </div>
    <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit highlight-current-row border style="width: 100%;margin-top: 20px;">
      <el-table-column label="ID" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini">{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="链接">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="update(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delete1(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--图片上传预览-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="dialogBanner">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item label="名称" label-width="20%" prop="remark">
          <el-input type="text" v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" label-width="20%" prop="link">
          <el-input type="text" v-model="temp.url"></el-input>
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
  import { getShopWxMenuList, createShopWxMenu, findShopWxMenu,updateShopWxMenu, deleteShopWxMenu ,postShopWxMenu} from '@/api/setting'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'WxMenu',
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
          name: [{ required: true, message: '请正确填写名称', trigger: 'change' }],
          url: [{ required: true, message: '请正确填写链接', trigger: 'change' }],
          sort: [{ required: true, message: '请正确填写排序', trigger: 'change' }]
        },
        temp: {
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
        getShopWxMenuList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.data.total
          this.tableKey++
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      postShopWxMenu() {
        postShopWxMenu().then(response => {
          this.$notify({
            title: '成功',
            message: '菜单生成成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
        })
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
            createShopWxMenu(this.temp).then(response => {
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
        this.$confirm('此操作将永久删除菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            id: row.id
          }
          deleteShopWxMenu(ttempData).then(response => {
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
        //this.shop_wx_menu_id = row.id
        //console.log(this.shop_wx_menu_id)
        findShopWxMenu({ id: row.id }).then(response => {
          this.temp = response.data.data
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
            updateShopWxMenu(tempData).then(response => {
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
