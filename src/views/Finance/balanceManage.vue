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
        :picker-options="pickerOptions2"
        @change='handleFilter'
        style="width: 280px;">
      </el-date-picker>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.check_status">
        <el-option v-for="item in goldTypeOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <div style="float: right;">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <template>
      <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit highlight-current-row border style="width: 100%;">
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" min-width="200" align="center">
          <template slot-scope="scope">
            <span style="color: #5f92c3fc;">{{scope.row.user_nickname}}({{scope.row.user_phone}})</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额" min-width="100" align="center">
          <template slot-scope="scope">
            <span style="color: #5f92c3fc;">{{scope.row.withdraw_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.account_number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户类型" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.account_type  | accountStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.withdraw_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag type="danger">{{scope.row.admin_nickname}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.check_status | TypeStatusFilter">{{scope.row.check_status | TypeStatusTranslator}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" min-width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.check_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.check_status == 1">
              <el-button type="primary" @click="adopt(scope.row)">通过</el-button>
              <el-button type="danger" @click="Reject(scope.row)">驳回</el-button>
            </div>
            <div v-if="scope.row.check_status == 2 || scope.row.check_status == 3">
              <el-button type="success" @click="find(scope.row)">查看</el-button>
            </div>
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
      <el-dialog :visible.sync="dialogReject">
        <el-form :rules="rule" ref="dateFormReject" :model="tempReject" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
          <el-form-item label="未通过原因" label-width="20%" prop="info" v-if="dialogStatus=='reject'">
            <el-input type="textarea" v-model="tempReject.info"></el-input>
          </el-form-item>
          <el-form-item label="打款账单ID" label-width="20%" prop="transaction_unique_id" v-if="dialogStatus=='adopt'">
            <el-input type="text" v-model="tempReject.transaction_unique_id"></el-input>
          </el-form-item>
          <el-form-item label="打款凭证" prop="transaction_proof" v-if="dialogStatus=='adopt'">
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
          <el-button @click="dialogReject = false">取 消</el-button>
          <el-button v-if="dialogStatus=='adopt'" :loading="btnLoading" type="primary" @click="adoptData">确 定</el-button>
          <el-button v-else type="primary" @click="rejectData">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogFind">
          <el-form label-position="left" label-width="20%">
            <el-form-item label="用户名">{{findTemp.user_nickname}}</el-form-item>
            <el-form-item label="提现金额">{{findTemp.withdraw_money}}</el-form-item>
            <el-form-item label="创建时间">{{findTemp.created_at}}</el-form-item>
            <el-form-item label="审核人">{{findTemp.admin_nickname}}</el-form-item>
            <el-form-item label="审核状态">
              <span v-if="findTemp.check_status == 1">待审核</span>
              <span v-else-if="findTemp.check_status == 2">未通过</span>
              <span v-else-if="findTemp.check_status == 3">已通过</span>
              <span v-else>已完结</span>
            </el-form-item>
            <el-form-item label="审核时间">{{findTemp.check_time}}</el-form-item>
          </el-form>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import { getShopBalanceWithdrawRecordList, findShopBalanceWithdrawRecordInfo, noPassShopBalanceWithdrawRecord, passShopBalanceWithdrawRecord } from '@/api/financial'
  import waves from '@/directive/waves'
  export default {
    name: 'balanceManage',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        listQuery: {
          page: 1,
          page_size: 10,
          date_range: [],
          customer_account_id: undefined
        },
        pickerOptions2: {},
        listLoading: true,
        list: null,
        total: null,
        goldTypeOptions: [
          { key: 1, label: '待审核' },
          { key: 2, label: '未通过' },
          { key: 3, label: '已通过' },
          { key: 4, label: '已完结' }
        ],
        dialogReject: false,
        dialogFind: false,
        findTemp: {
          user_nickname: undefined,
          withdraw_money: undefined,
          created_at: undefined,
          admin_nickname: undefined,
          check_status: undefined,
          check_time: undefined
        },
        tempReject: {
          transaction_proof: undefined,
          info: undefined,
          transaction_unique_id: undefined
        },
        dialogStatus: '',
        btnLoading: false,
        rule: {
          info: [{ required: true, message: '请正确填写未通过原因', trigger: 'change' }],
          transaction_unique_id: [{ required: true, message: '请正确填写打款账单ID', trigger: 'change' }]
        },
        dialogImageUrl: '',
        dialogVisible: undefined,
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: []
      }
    },
    filters: {
      TypeStatusFilter(status) {
        const statusMap = {
          1: 'warning',
          2: 'danger',
          3: '',
          4: 'success'
        }
        return statusMap[status]
      },
      accountStatus(status) {
        const statusMap = {
          1: '支付宝',
          2: '微信',
          3: '银行卡'
        }
        return statusMap[status]
      },
      TypeStatusTranslator(status) {
        const statusMap = {
          1: '待审核',
          2: '未通过',
          3: '已通过',
          4: '已完结'
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
        getShopBalanceWithdrawRecordList(this.listQuery).then(response => {
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
      // 查看
      find(row) {
        this.shop_balance_withdraw_record_id = row.id
        findShopBalanceWithdrawRecordInfo({ shop_balance_withdraw_record_id: row.id }).then(response => {
          this.findTemp = response.data
          this.dialogFind = true
        })
      },
      // 通过
      adopt(row) {
        this.dialogStatus = 'adopt'
        this.dialogReject = true
        this.resetemp()
        this.tempReject.shop_balance_withdraw_record_id = row.id
        this.$nextTick(() => {
          this.$refs['dateFormReject'].clearValidate()
          console.log(this.$refs)
        })
      },
      // 驳回
      Reject(row) {
        this.dialogStatus = 'reject'
        this.dialogReject = true
        this.resetemp()
        this.tempReject.shop_balance_withdraw_record_id = row.id
        console.log(this.tempReject.shop_balance_withdraw_record_id)
        this.$nextTick(() => {
          this.$refs['dateFormReject'].clearValidate()
          console.log(this.$refs)
        })
      },
      adoptData(row) {
        this.$refs['dateFormReject'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            passShopBalanceWithdrawRecord(this.tempReject).then(response => {
              this.getList()
              this.dialogReject = false
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
      rejectData() {
        this.$refs['dateFormReject'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            noPassShopBalanceWithdrawRecord(this.tempReject).then(response => {
              this.getList()
              this.dialogReject = false
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove() {
        this.tempReject.transaction_proof = ''
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
        this.tempReject.transaction_proof = response.data.url
      },
      resetemp() {
        this.tempReject = {
          transaction_proof: undefined,
          info: undefined,
          transaction_unique_id: undefined
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
