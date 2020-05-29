<template>
    <div class="app-container">
      <div style="width: 60%;margin: 0 auto;" v-if="list.after_sale_refund !== null">
        <div class="saleCustomer">售后单信息</div>
        <div class="saleContainer">
          <div class="saleChild" v-if="list.after_sale_type_id == 1">
            <span>退款账户类型:</span>
            <span v-if="list.after_sale_refund">{{list.after_sale_refund.after_sale_receive_type.type_name}}</span>
          </div>
          <div class="saleChild" v-if="list.after_sale_type_id == 1">
            <span>退款账户:</span>
            <span v-if="list.after_sale_refund">{{list.after_sale_refund.receive_account}}</span>
          </div>
          <div class="saleChild" v-if="list.after_sale_type_id == 1">
            <span>退款金额：</span>
            <span v-if="list.after_sale_refund">￥{{list.after_sale_refund.refund_money}}</span>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <div style="width: 60%;margin: 0 auto;">
        <div class="saleCustomer">售后单操作</div>
        <el-form :rules="rule" ref="dateForm" :model="temp" label-position="center" label-width="20%">
          <el-form-item label="审核状态" style="margin-top: 20px;">
            <el-radio-group v-model="temp.operation_status" size="medium" style="margin-bottom: 20px;">
              <el-radio-button label="7">等待打款</el-radio-button>
              <el-radio-button label="8">已打款</el-radio-button>
              <el-radio-button label="9">未打款 收款人信息不明确</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="info" style="margin-top: 20px;">
            <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 40}" v-model="temp.info"></el-input>
          </el-form-item>
          <el-form-item label="打款凭证">
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
        <div slot="footer" class="dialog-footer" style="float: right;">
          <el-button @click="handleBack">返回</el-button>
          <el-button type="primary" :loading="btnLoading" @click="confirm">确 认</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import { getAfterSaleInfo,  updateAfterSaleFinance } from '@/api/aftersale'
  export default {
    name: 'editPaymentStatus',
    data() {
      return {
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: undefined,
        btnLoading: false,
        listQuery: {
          after_sale_id: undefined,
        },
        listLoading: false,
        temp: {
          operation_status: '',
          info: undefined,
          refund_proof: []
        },
        rule: {
          info: [{ required: true, message: '请正确填写备注', trigger: 'change' }]
        },
        list: {
          after_sale_refund: {
            after_sale_receive_type: {
              type_name: undefined
            }
          }
        }
      }
    },
    created() {
      this.temp.after_sale_id = this.$route.query.after_sale_id
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      // this.temp.operation_status = this.$route.query.procedure_status
      this.getList()
      this.resetemp()
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['dateForm'].clearValidate()
        console.log(this.$refs)
      })
    },
    activated() {
      this.temp.after_sale_id = this.$route.query.after_sale_id
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      // this.temp.operation_status = this.$route.query.procedure_status
      this.getList()
      this.resetemp()
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['dateForm'].clearValidate()
        console.log(this.$refs)
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        getAfterSaleInfo(this.listQuery).then(response => {
          this.list = response.data
        })
      },
      confirm() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.after_sale_id = this.listQuery.after_sale_id
            console.log(tempData.after_sale_id)
            console.log(tempData)
            updateAfterSaleFinance(tempData).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.handleBack()
            })
          }
        })
      },
      // 图片上传
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 图片预览
      handlePicture(refund_proof) {
        this.dialogImageUrl = refund_proof
        this.dialogVisible = true
      },
      handleRemove() {
        this.temp.refund_proof = ''
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
        console.log(fileList)
        // this.temp.refund_proof= forEach(fileList)
        this.temp.refund_proof = fileList.map(item => {
          return item.response.data.url
        })
        // this.temp.refund_proof = response.data.url
        console.log(this.temp.refund_proof)
      },
      resetemp() {
        this.temp = {
          operation_status: '',
            info: undefined,
            refund_proof: undefined
        }
      },
      handleBack() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .saleContainer{
    margin: 40px 0 40px 0;
    padding-left: 10%;
  }
  .saleCustomer{
    font-weight: 700;
    font-size: 30px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 33px;
    text-decoration: none;
  }
  .saleChild{
    font-size: 20px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 20px;
    text-decoration: none;
    margin-bottom: 15px;
  }
  .refund{
    letter-spacing: 1px;
    font-size: 16px;
    margin-left: 15px;
  }
  .el-form-item >>> .el-form-item__content {
    font-size: 18px;
  }
  .el-form-item >>> .el-form-item__label {
    font-size: 18px;
  }
</style>
