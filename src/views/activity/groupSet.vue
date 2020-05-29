<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        class="filter-item"
        v-model="listQuery.date_range"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        align="right"
        unlink-panels
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions1"
        @change='handleFilter'
        style="width: 240px;">
      </el-date-picker>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.assemble_type">
        <el-option v-for="item in clusterOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <div style="float: right;">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="ID" min-width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.goods_common">{{scope.row.goods_common.goods_name}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拼团名称" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.assemble_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拼团类型" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.assemble_type | couponStatusFilter">
            {{scope.row.assemble_type|couponStatusTranslator}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开启状态" min-width="100">
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
      <el-table-column align="center" label="起止时间" min-width="250">
        <template slot-scope="scope">
          <span>{{scope.row.start_time}} ~ {{scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="update(scope.row)"></el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogAssemble">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item label="拼团名称" label-width="20%" prop="assemble_name">
          <el-input v-model="temp.assemble_name"></el-input>
        </el-form-item>
        <el-form-item label="拼团类型" label-width="20%" prop="assemble_type">
          <el-select clearable class="filter-item" v-model="temp.assemble_type" style="width: 100%;">
            <el-option v-for="item in clusterOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拼团商品" label-width="20%" prop="shop_goods_common_id">
          <el-select v-model="temp.shop_goods_common_id"
                     filterable
                     style="width: 100%"
                     remote
                     :remote-method="handletypeList"
                     :loading="typeLoading"
                     clearable
                     placeholder="请选择拼团商品">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.goods_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成团人数" label-width="20%" prop="assemble_people_number">
          <el-input-number v-model="temp.assemble_people_number" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="虚拟成团人数" label-width="20%" prop="fictitious_assemble_people_number">
          <el-input-number v-model="temp.fictitious_assemble_people_number" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="拼团时间" label-width="20%" prop="date_range">
          <el-date-picker
            class="filter-item"
            v-model="temp.date_range"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            @change='handleFilter'
            style="width: 240px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拼团宣传语" label-width="20%" prop="fictitious_assemble_people_number">
          <el-input v-model="temp.share_description"></el-input>
        </el-form-item>
        <el-form-item label="拼团宣传图">
          <el-upload
            :action="baseUrl"
            name="image"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-success="handleUp"
            :limit="1">
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件,图片大小不能超过１M</span>
        </el-form-item>
        <el-form-item label="状态" label-width="20%">
          <el-radio-group v-model="temp.status" size="small">
            <el-radio-button label="1">开启</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssemble = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils/index'
  import { getShopAssembleList, createShopAssemble, getShopAssembleProductGoods, updateShopAssemble, findShopAssemble, changeShopAssembleStatus } from '@/api/activity'
  export default {
    name: 'activityManage',
    directives: {
      waves
    },
    data() {
      return {
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: undefined,
        tableKey: 0,
        listQuery: {
          date_range: [],
          page: 1,
          page_size: 20
        },
        listLoading: true,
        list: null,
        total: null,
        pickerOptions1: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dialogAssemble: false,
        dialogStatus: '',
        clusterOptions: [
          { key: 1, label: '普通拼团' },
          { key: 2, label: '分销拼团' }
        ],
        temp: {
          assemble_name: undefined,
          assemble_type: undefined,
          goods_name: undefined,
          shop_goods_common_id: undefined,
          assemble_people_number: undefined,
          fictitious_assemble_people_number: undefined,
          date_range: [
            parseTime(new Date(), '{y}-{m}-{d}'),
            parseTime(new Date(new Date().getTime() + 1000 * 3600 * 24 * 7), '{y}-{m}-{d}')
          ],
          status: '0',
          share_description: undefined,
          share_img: undefined
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        typeOptions: [],
        typeLoading: false,
        pickerOptions2: {},
        btnLoading: false,
        rule: {
          assemble_name: [{ required: true, message: '请正确填写拼团名称', trigger: 'change' }],
          assemble_type: [{ required: true, message: '选择拼团类型', trigger: 'change' }],
          assemble_people_number: [{ required: true, message: '请正确填写拼团人数', trigger: 'change' }],
          fictitious_assemble_people_number: [{ required: true, message: '请正确填写虚拟成团人数', trigger: 'change' }],
          shop_goods_common_id: [{ required: true, message: '请正确选择拼团商品', trigger: 'change' }],
          date_range: [{ required: true, message: '选择时间', trigger: 'change' }],
          share_description: [{ required: true, message: '请正确填写拼团宣传语', trigger: 'change' }]
        }
      }
    },
    filters: {
      // 券类型
      couponStatusFilter(status) {
        const statusMap = {
          1: 'danger',
          2: 'success'
        }
        return statusMap[status]
      },
      couponStatusTranslator(status) {
        const statusMap = {
          1: '普通拼团',
          2: '分销拼团'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getShopAssembleList(this.listQuery).then(response => {
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
      // 图片上传
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove() {
        this.temp.share_img = ''
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
      // 上传成功
      handleUp(response, file, fileList) {
        this.temp.share_img = response.data.url
      },
      // 点击开关状态
      handleSwitch(row) {
        changeShopAssembleStatus({ shop_assemble_id: row.id, status: row.status }).then(res => {
          this.$message.success('修改成功')
        })
      },
      // 点击创建
      create() {
        this.dialogStatus = 'create'
        this.dialogAssemble = true
        this.resetemp()
        this.fileList = []
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
        })
      },
      // 点击编辑
      update(row) {
        this.dialogStatus = 'update'
        this.dialogAssemble = true
        this.shop_assemble_id = row.id
        findShopAssemble({ shop_assemble_id: row.id }).then(response => {
          this.temp = response.data
          this.fileList = [
            {
              url: row.share_img
            }
          ]
          this.handletypeList()
          this.dialogStatus = 'update'
          this.$nextTick(() => {
            this.$refs['dateForm'].clearValidate()
          })
        })
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      // 拼团商品
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
          getShopAssembleProductGoods({ goods_name: query, page_size: 10 }).then(response => {
            this.typeOptions = response.data.data
            this.typeLoading = false
          })
        }
      },
      // 创建确定
      createData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            createShopAssemble(this.temp).then(response => {
              // this.total++
              this.getList()
              this.dialogAssemble = false
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
      // 编辑确定
      updateData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.shop_assemble_id = this.shop_assemble_id
            console.log(tempData)
            updateShopAssemble(tempData).then(response => {
              this.getList()
              this.dialogAssemble = false
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
      resetemp() {
        this.temp = {
          assemble_name: undefined,
          assemble_type: undefined,
          goods_name: undefined,
          shop_goods_common_id: undefined,
          assemble_people_number: undefined,
          fictitious_assemble_people_number: undefined,
          date_range: [],
          status: '0',
          share_description: undefined
        }
      }
    }
  }
</script>

<style scoped>

</style>
