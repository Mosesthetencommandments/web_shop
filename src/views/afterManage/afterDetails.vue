<template>
  <div class="app-container">
    <el-button @click="handleBack">返回</el-button>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">售后单信息</div>
      <div class="saleContainer">
        <div class="saleChild">售后单ID: {{list.sale_unique_id}}</div>
        <div class="saleChild">
          <span>售后类型:</span>
          <span v-if="list.after_sale_type_id == 1">退货</span>
          <span v-if="list.after_sale_type_id == 2">换货</span>
        </div>
        <div class="saleChild">
          <span>售后状态:</span>
          <span>{{list.procedure_status | procedureStates}}</span>
          <el-button type="primary" class="refund" @click="handleState">修改状态</el-button>
        </div>
        <div class="saleChild">
          <span>审核时间:</span>
          <span>{{list.verify_success_or_failed_time}}</span>
        </div>
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
          <el-button type="primary" class="refund" @click="handleRefundInfo">修改退款信息</el-button>
        </div>
        <div class="saleChild" v-if="list.after_sale_type_id == 1">
          <div style="display: inline-block;vertical-align: top;margin-top: 10px;">退款凭证:</div>
          <template v-if="list.after_sale_refund">
            <div style="display: inline-block;" v-for="item in list.after_sale_refund.refund_proof">
              <img style="width: 100px;height: 100px;margin-right: 10px;" :src="item" @click="handlePicture(item)"/>
            </div>
          </template>
        </div>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">售后客户信息</div>
      <div class="saleContainer">
        <div class="saleChild">
          <span>客户姓名:</span>
          <span>{{list.sourceable.customer_message.shop_customer.user_nickname}}</span>
          <el-tag type="warning">{{list.sourceable.customer_message.shop_member_level.member_level_name}}</el-tag>
        </div>
        <div class="saleChild">联系方式: {{list.sourceable.customer_message.phone}}</div>
        <div class="saleChild">商品名称: {{list.sourceable.shop_goods_common.goods_name}}</div>
        <div class="saleChild">购买数量: {{list.sourceable.shop_goods_shopping_number}}</div>
        <div class="saleChild">售后数量: {{list.sourceable.shop_goods_after_number}}</div>
        <div class="saleChild">申请原因: {{list.after_sale_apply_type.type_name}}</div>
        <div class="saleChild" v-if="list.sourceable">
          <div style="display: inline-block;vertical-align: top;margin-top: 10px;">售后成品展示:</div>
          <template>
            <div style="display: inline-block;" v-for="item in list.sourceable.after_sale_cause_pictures">
              <img style="width: 100px;height: 100px;margin-right: 10px;" :src="item" @click="handlePicture1(item)"/>
            </div>
          </template>
        </div>
        <!--预览-->
        <el-dialog :visible.sync="dialogVisible1" size="tiny">
          <img width="100%" :src="dialogImageUrl1" alt="">
        </el-dialog>
        <div class="saleChild">发货仓库: {{list.wareahouse.name}}</div>
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;clear: both;" v-if="list.procedure_status !== 0">
      <div class="saleCustomer">处理流水</div>
      <div class="saleContainer">
        <div v-for="(item, index) in list.after_sale_procedure">
          <div style="font-size: 16px;margin-bottom: 10px;">
            <span>{{index+1}}.</span>
            <span>{{item.operator_user_account.nickname}}</span> 将 状态改为 <span>{{item.operator_user_account.status | procedureStates}}</span>
          </div>
          <div style="color: #9b9a9a;font-size: 14px;margin-bottom: 20px;margin-left: 18px;">
            <span style="margin-right: 20px;">{{item.created_at}}</span>
            <span>{{item.info}}</span>
          </div>
        </div>
        <!--<div>-->
          <!--<el-steps direction="vertical">-->
            <!--<el-step style="margin-bottom: 20px;width: 600px;" v-for="item in list.after_sale_procedure" :title="item | procedureStates1"  :description="item.created_at + item.info">-->
            <!--</el-step>-->
          <!--</el-steps>-->
        <!--</div>-->
      </div>
    </div>
    <!--修改状态弹出-->
    <el-dialog :visible.sync="dialogState">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item>
          <el-radio-group v-model="temp.operation_status" size="medium" style="margin-bottom: 20px;">
            <el-radio-button label="1">审核通过</el-radio-button>
            <el-radio-button label="2">审核失败</el-radio-button>
            <el-radio-button label="10">已完结</el-radio-button>
            <el-radio-button label="11">已关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="info">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 40}" v-model="temp.info" placeholder="请输入修改售后状态的备注～"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogState = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm">确 认</el-button>
      </div>
    </el-dialog>
    <!--修改退款信息弹出-->
    <el-dialog :visible.sync="dialogRefund">
      <el-form :rules="rule1" ref="dateForm1" :model="temp1" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item label="退款账户类型" label-width="20%" prop="after_sale_id">
          <el-select v-model="temp1.receive_type_id"
                     filterable
                     remote
                     clearable
                     :remote-method="handletypeList"
                     :loading="typeLoading"
                     placeholder="请选择退款账户类型"
                     class="filter-item"
                     style="width: 100%;">
            <el-option
              v-for="item in fullOptions"
              :key="item.id"
              :label="item.type_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="receive_account" label="退款账户" label-width="20%">
          <el-input type="text" v-model="temp1.receive_account" placeholder="请选择退款账户"></el-input>
        </el-form-item>
        <el-form-item prop="refund_money" label="退款金额" label-width="20%">
          <el-input type="text" v-model="temp1.refund_money" placeholder="请填写退款金额"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRefund = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading1" @click="confirm1">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAfterSaleInfo, updateAfterSaleOperation, getAfterSaleReceiveTypeList, updateAfterSaleRefund } from '@/api/aftersale'
  export default {
    name: 'afterDetails',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: undefined,
        dialogImageUrl1: '',
        dialogVisible1: undefined,
        fullOptions: [],
        typeLoading:false,
        listQuery: {
          after_sale_id: undefined,
        },
        btnLoading: false,
        temp: {
          operation_status: '',
          info: undefined
        },
        dialogState: false,
        dialogRefund: false,
        list: {
          after_sale_procedure: [],
          sale_unique_id: undefined,
          after_sale_refund: {
            after_sale_receive_type: {
              type_name: undefined
            },
            refund_proof: []
          },
          sourceable: {
            after_sale_cause_pictures: [],
            customer_message: {
              shop_customer: {},
              shop_member_level: {}
            },
            shop_goods_common: {}
          },
          wareahouse: {},
          after_sale_apply_type: {}
        },
        listLoading: false,
        rule: {
          info: [{ required: true, message: '请正确填写备注', trigger: 'change' }]
        },
        temp1: {
          refund_money: undefined,
          receive_account: undefined,
          after_sale_id: undefined,
          receive_type_id: undefined
        },
        btnLoading1: false,
        rule1: {
          receive_account: [{ required: true, message: '请正确填写退款账户', trigger: 'change' }],
          refund_money: [{ required: true, message: '请正确填写退款金额', trigger: 'change' }],
          receive_type_id: [{ required: true, message: '请正确选择退款账户类型', trigger: 'change' }],
        },
      }
    },
    filters: {
      procedureStates(status){
        const statusMap = {
          1: '审核通过， 等待接收退货',
          2: '审核不通过',
          3: '已收到退货，货物数目错误',
          4: '已收到退货，退货数目正确(退货)',
          5: '已收到退货，退货数目正确(换货)',
          6: '已收到货,换货已发出',
          7: '等待打款',
          8: '已打款，等待完结',
          9: '未打款，收款信息不明确',
          10: '已完结',
          11: '已关闭',
          12: '取消'
        }
        return statusMap[status]
      },
      // procedureStates1(item){
      //   const statusMap = {
      //     1: '审核通过， 等待接收退货',
      //     2: '审核不通过',
      //     3: '已收到退货，货物数目错误',
      //     4: '已收到退货，退货数目正确(退货)',
      //     5: '已收到退货，退货数目正确(换货)',
      //     6: '已收到货,换货已发出',
      //     7: '等待打款',
      //     8: '已打款，等待完结',
      //     9: '未打款，收款信息不明确',
      //     10: '已完结',
      //     11: '已关闭',
      //     12: '取消'
      //   }
      //   return item.operator_user_account.nickname + '将状态改为' + statusMap[item.procedure_status]
      // }
    },
    created() {
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      this.getList()
    },
    activated() {
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAfterSaleInfo(this.listQuery).then(response => {
          this.list = response.data
        })
      },
      // 修改状态
      handleState() {
        this.dialogState = true
        this.resetemp1()
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
        })
      },
      // 确认修改状态
      confirm() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.after_sale_id = this.listQuery.after_sale_id
            console.log(tempData.after_sale_id)
            console.log(tempData)
            updateAfterSaleOperation(tempData).then(response => {
              this.getList()
              this.dialogState = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      // 修改退款信息
      handleRefundInfo(){
        this.dialogRefund = true
        this.resetemp()
        this.$nextTick(() => {
          this.$refs['dateForm1'].clearValidate()
        })
      },
      confirm1() {
        this.$refs['dateForm1'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp1)
            tempData.after_sale_id = this.listQuery.after_sale_id
            tempData.receive_type_id = this.temp1.receive_type_id
            console.log(tempData.after_sale_id)
            console.log(tempData)
            updateAfterSaleRefund(tempData).then(response => {
              this.getList()
              this.dialogRefund = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
          getAfterSaleReceiveTypeList({ type_name: query, page_size: 10 }).then(response => {
            this.fullOptions = response.data.data
            this.typeLoading = false
          })
        }
      },
      // 打款凭证图片预览
      handlePicture(item) {
        console.log(item)
        this.dialogImageUrl = item
        this.dialogVisible = true
      },
      // 售后成品展示预览
      handlePicture1(item) {
        this.dialogImageUrl1= item
        this.dialogVisible1 = true
      },
      resetemp() {
        this.temp1= {
          refund_money: undefined,
            receive_account: undefined,
            after_sale_id: undefined,
            receive_type_id: undefined
        }
      },
      // 修改状态清除
      resetemp1() {
        this.temp = {
          operation_status: '',
          info: undefined
        }
      },
      // 返回上一页
      handleBack() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .refund{
    letter-spacing: 1px;
    font-size: 16px;
    margin-left: 15px;
  }
  .saleContainer{
    display: inline-block;
    float: left;
    margin: 40px 0 40px 40px;
  }
  .saleCustomer{
    font-weight: 700;
    font-size: 30px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 33px;
    text-decoration: none;
    display: inline-block;
    float: left;
  }
  .saleChild{
    font-size: 20px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 20px;
    text-decoration: none;
    margin-bottom: 15px;
  }
  .el-step >>> .is-wait {
    color: #000;
    font-size: 20px;
  }
  .el-step__description{
    width: 900px!important;
  }
</style>
