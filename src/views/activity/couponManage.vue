<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-date-picker-->
        <!--class="filter-item"-->
        <!--v-model="listQuery.date_range"-->
        <!--type="daterange"-->
        <!--format="yyyy-MM-dd"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--align="right"-->
        <!--unlink-panels-->
        <!--range-separator="~"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--:picker-options="pickerOptions2"-->
        <!--@change='handleFilter'-->
        <!--style="width: 280px;">-->
      <!--</el-date-picker>-->
      <!--<el-select v-model="temp.coupon_type_id"-->
                 <!--filterable-->
                 <!--style="width: 150px"-->
                 <!--remote-->
                 <!--:remote-method="handletypeList"-->
                 <!--clearable-->
                 <!--:loading="typeLoading"-->
                 <!--placeholder="请选择券类型"-->
                 <!--class="filter-item">-->
        <!--<el-option-->
          <!--v-for="item in fullOptions"-->
          <!--:key="item.id"-->
          <!--:label="item.type_name"-->
          <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.is_add">-->
        <!--<el-option v-for="item in noSuperOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-select @change='handleFilter' clearable style="width: 120px" class="filter-item"-->
                 <!--v-model="listQuery.is_limit_date">-->
        <!--<el-option v-for="item in limitOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <div class="filter-float">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <template>
      <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit
                highlight-current-row border style="width: 100%;">
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="券名称" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.coupon_name}}</span>
            <el-tag v-if="scope.row.only_new_customer === 1" type="danger" size="mini">新人</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="使用条件" min-width="200" align="center">
          <template slot-scope="scope">
            <span>满{{scope.row.require_total_pay}}可以使用</span>
            (<span>{{scope.row.coupon_remark}}</span>)
          </template>
        </el-table-column>
        <el-table-column label="抵扣" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.coupon_type === 1" type="danger" size="mini">{{scope.row.offset_money}}元</el-tag>
            <el-tag v-if="scope.row.coupon_type === 2" type="danger" size="mini">{{scope.row.offset_percent}}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="剩余数量">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.coupon_number}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="是否可叠加">
          <template slot-scope="scope">
            <span class="link-type" v-if="scope.row.is_add == 1">不叠加</span>
            <span class="link-type" v-else>可以叠加</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" align="center" label="开启状态">
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
        <el-table-column min-width="150" align="center" label="使用期限">
          <template slot-scope="scope">
            <span v-if="scope.row.validity_time_type === 1">
              <span class="link-type">{{scope.row.start_at}}</span> ~ <span
              class="link-type">{{scope.row.end_at}}</span>
            </span>
            <span v-if="scope.row.validity_time_type === 2">
              <span class="link-type">领券当日起 {{scope.row.validity_days}}日内有效</span>
            </span>
            <span v-if="scope.row.validity_time_type === 3">
              <span class="link-type">领券次日起 {{scope.row.validity_days}}日内有效</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="update(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-share" @click="grant(scope.row)"></el-button>
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
      <!--发放优惠券弹出-->
      <el-dialog :visible.sync="dialogGrant">
        <el-form :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
          <el-form-item label="券名称" label-width="18%">
            消费满<span>{{temp.require_total_pay}}</span>抵扣
            <span>{{temp.offset_money}}</span>
          </el-form-item>
          <el-form-item label="商城用户手机号" label-width="18%">
            <el-input v-model="temp.shop_customer_phone" style="width:230px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGrant = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确认发放</el-button>
        </div>
      </el-dialog>
      <!--添加编辑弹出-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCoupon">
        <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%"
                 style='width: 80%; margin-left:10%;'>
          <el-form-item label="券名称" label-width="20%" prop="coupon_name">
            <el-input v-model="temp.coupon_name" :disabled="dialogStatus === 'update'"></el-input>
          </el-form-item>
          <el-form-item label="优惠券图标">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              v-model="temp.coupon_img"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handlePictureSuccess"
              :file-list="fileList"
              name="image">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="使用人群" label-width="20%" prop="only_new_customer">
            <el-radio-group v-model="temp.only_new_customer" size="medium" :disabled="dialogStatus === 'update'">
              <el-radio-button label="1">新人可用</el-radio-button>
              <el-radio-button label="2">所有人可用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否可以叠加使用" label-width="20%" prop="is_add">
            <el-radio-group v-model="temp.is_add" size="medium" :disabled="dialogStatus === 'update'">
              <el-radio-button label="1">不叠加</el-radio-button>
              <el-radio-button label="2">可叠加</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="满减类型" label-width="20%" prop="coupon_type">
            <el-radio-group v-model="temp.coupon_type" size="medium" :disabled="dialogStatus === 'update'">
              <el-radio-button label="1">指定金额</el-radio-button>
              <el-radio-button label="2">折扣</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="满多少可用" label-width="20%" prop="require_total_pay">
            满
            <el-input v-model="temp.require_total_pay" :disabled="dialogStatus === 'update'"
                      style="width: 20%;display: inline-block;margin-left:10px;"></el-input>
            <span style="margin-left:10px;">抵扣</span>
            <div style="width: 40%;display: inline-block;margin-left:10px;" v-if="parseInt(temp.coupon_type) === 1">
              <el-input v-model="temp.offset_money" :disabled="dialogStatus === 'update'"
                        style="width: 40%;display: inline-block;margin-left:10px;margin-right:10px;"></el-input>
              元
            </div>
            <div style="width: 40%;display: inline-block;margin-left:10px;" v-if="parseInt(temp.coupon_type) === 2">
              <el-input v-model="temp.offset_percent" :disabled="dialogStatus === 'update'"
                        style="width: 40%;display: inline-block;margin-left:10px;margin-right:10px;"></el-input>
              %
            </div>
          </el-form-item>
          <el-form-item label="优惠券描述" label-width="20%" prop="coupon_remark">
            <el-input v-model="temp.coupon_remark" :disabled="dialogStatus === 'update'"></el-input>
          </el-form-item>
          <el-form-item label="优惠券数量" label-width="20%" prop="coupon_number">
            <el-input v-model="temp.coupon_number"></el-input>
          </el-form-item>
          <el-form-item label="每人最多领取数量" label-width="20%" prop="max_get_number">
            <el-input v-model="temp.max_get_number"></el-input>
          </el-form-item>
          <el-form-item label="过期类型" label-width="20%" prop="validity_time_type">
            <el-radio-group v-model="temp.validity_time_type" size="medium" :disabled="dialogStatus === 'update'">
              <el-radio-button label="1">固定日期</el-radio-button>
              <el-radio-button label="2">当日生效</el-radio-button>
              <el-radio-button label="3">次日生效</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效日期" label-width="20%" v-if="parseInt(temp.validity_time_type) === 1">
            <el-date-picker
              :disabled="dialogStatus === 'update'"
              class="filter-item"
              v-model="temp.validate_date_range"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效天数" label-width="20%" prop="validity_days" v-if="parseInt(temp.validity_time_type) !== 1">
            <el-input v-model="temp.validity_days"></el-input>
          </el-form-item>
          <el-form-item label="限制商品" label-width="20%" prop="limit_goods_type">
            <el-radio-group v-model="temp.limit_goods_type" size="medium">
              <el-radio-button label="1">全部可用</el-radio-button>
              <el-radio-button label="2">指定可用</el-radio-button>
              <el-radio-button label="3">指定禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品列表" label-width="20%" v-if="parseInt(temp.limit_goods_type) !== 1">
            <el-select
              class="filter-item"
              style="width:100%;"
              v-model="temp.limit_goods"
              clearable
              filterable
              remote
              multiple
              :remote-method="getShopGoodsCommonList"
              placeholder="请选择商品">
              <el-option
                v-for="item in goodsOptions"
                :key="item.id"
                :label="item.goods_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用等级(使用)" label-width="20%">
            <el-select
              class="filter-item"
              style="width:100%;"
              v-model="temp.distribution_level_use"
              clearable
              filterable
              multiple
              placeholder="请选择等级">
              <el-option
                v-for="item in distributionLevelOptions"
                :key="item.id"
                :label="item.distribution_level_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用等级(分享)" label-width="20%">
            <el-select
              class="filter-item"
              style="width:100%;"
              v-model="temp.distribution_level_share"
              clearable
              filterable
              multiple
              placeholder="请选择等级">
              <el-option
                v-for="item in distributionLevelOptions"
                :key="item.id"
                :label="item.distribution_level_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="20%" size="medium">
            <el-radio-group v-model="temp.status">
              <el-radio-button label="0">禁用</el-radio-button>
              <el-radio-button label="1">开启</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCoupon = false">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createData">确 定
          </el-button>
          <el-button v-else type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {
    updateShopCoupon,
    getShopCouponList,
    changeShopCouponStatus,
    getShopCouponTypeList,
    createShopCoupon,
    createShopCustomerCoupon
  } from '@/api/setting'
  import { getShopGoodsCommonList } from '@/api/goods'
  import { getShopDistributionLevelList } from '@/api/customer'

  export default {
    name: 'couponManage',
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
          typeOptions: [],
          // 满减
          coupon_type_id: undefined,
          // 不可叠加
          is_add: undefined,
          // 限时使用
          is_limit_date: undefined
        },
        fullOptions: [],
        temp: {
          is_add: '1',
          only_new_customer: '2',
          offset_money: 0,
          offset_percent: 0,
          require_total_pay: 0,
          coupon_name: undefined,
          coupon_number: undefined,
          coupon_img: undefined,
          coupon_type: '2',
          coupon_remark: undefined,
          max_get_number: 1,
          distribution_level_use: [],
          distribution_level_share: [],
          validity_time_type: '1',
          validity_days: 30,
          validate_date_range: [],
          limit_goods_type: '1',
          limit_goods: [],
          status: '0',
          shop_customer_phone:'',
        },
        dialogCoupon: false,
        dialogStatus: '',
        textMap: {
          create: '创建',
          update: '编辑'
        },
        btnLoading: false,
        rule: {},
        typeLoading: false,
        noSuperOptions: [
          {key: 1, label: '不叠加'},
          {key: 2, label: '可以叠加'}
        ],
        limitOptions: [
          {key: 1, label: '限时使用'},
          {key: 2, label: '不限时使用'}
        ],
        listLoading: true,
        list: null,
        total: null,
        pickerOptions2: {},
        dialogGrant: false,
        goodsOptions: [],
        distributionLevelOptions: [],
        uploadUrl: process.env.BASE_API + '/api/document/uploadImage',
        fileList: []
      }
    },
    created() {
      this.getList()
      this.getShopGoodsCommonList(' ')
      this.getDistributionLevelList()
    },
    methods: {
      getDistributionLevelList() {
        getShopDistributionLevelList({ page_size: 100 }).then(response => {
          this.distributionLevelOptions = response.data.data
        })
      },
      getShopGoodsCommonList(query) {
        if (query !== '') {
          getShopGoodsCommonList({ goods_name: query }).then(response => {
            this.goodsOptions = response.data.data
          })
        }
      },
      handlePictureSuccess(response, file, fileList) {
        this.temp.coupon_img = response.data.url
      },
      handleRemove(file, fileList) {

      },
      handlePictureCardPreview(file) {

      },
      getList() {
        this.listLoading = true
        getShopCouponList(this.listQuery).then(response => {
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
      // 状态开关
      handleSwitch(row) {
        changeShopCouponStatus({shop_coupon_id: row.id, status: row.status}).then(res => {
          this.$message.success('修改成功')
        })
      },
      // 券类型
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
          getShopCouponTypeList({type_name: query, page_size: 10}).then(response => {
            this.fullOptions = response.data.data
            this.typeLoading = false
          })
        }
      },
      // 创建
      create() {
        this.dialogStatus = 'create'
        this.dialogCoupon = true
        this.resetemp()
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
        })
      },
      // 发放
      grant(row) {
        this.dialogGrant = true
        this.temp = row
        this.temp.shop_coupon_id = row.id
      },
      // 确定发放
      confirm() {
        createShopCustomerCoupon(this.temp).then(response => {
          this.dialogGrant = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 编辑
      update(row) {
        this.dialogStatus = 'update'
        this.resetemp()
        this.shop_coupon_id = row.id
        this.temp = Object.assign({}, row)

        this.fileList = [{ name: 0, url: this.temp.coupon_img }]
        this.temp.limit_goods.map((item, index, array) => {
          this.temp.limit_goods[index] = parseInt(item)
        })
        this.temp.distribution_level_use.map((item, index, array) => {
          this.temp.distribution_level_use[index] = parseInt(item)
        })
        this.temp.distribution_level_share.map((item, index, array) => {
          this.temp.distribution_level_share[index] = parseInt(item)
        })
        this.temp.validate_date_range = []
        this.temp.validate_date_range[0] = this.temp.start_at
        this.temp.validate_date_range[1] = this.temp.end_at
        getShopGoodsCommonList({ shop_goods_common_ids: row.limit_goods, page_size: 100 }).then(response => {
          this.goodsOptions = response.data.data
          this.dialogCoupon = true
        })
      },
      // 创建确定
      createData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            createShopCoupon(this.temp).then(response => {
              this.getList()
              this.dialogCoupon = false
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
            tempData.shop_coupon_id = this.shop_coupon_id
            updateShopCoupon(tempData).then(response => {
              this.getList()
              this.dialogCoupon = false
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
      // 分页
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetemp() {
        this.fileList = []
        this.temp = {
          is_add: '1',
          only_new_customer: '2',
          offset_money: 0,
          offset_percent: 0,
          require_total_pay: 0,
          coupon_name: undefined,
          coupon_number: undefined,
          coupon_img: undefined,
          coupon_type: '2',
          coupon_remark: undefined,
          max_get_number: 1,
          distribution_level_use: [],
          distribution_level_share: [],
          validity_time_type: '1',
          validity_days: 30,
          validate_date_range: [],
          limit_goods_type: '1',
          limit_goods: [],
          status: '0'


        }
      }
    }
  }
</script>

<style scoped>

</style>
