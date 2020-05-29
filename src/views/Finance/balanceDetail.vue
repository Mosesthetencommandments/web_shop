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
        style="width: 320px;">
      </el-date-picker>
      <el-select placeholder="请选择用户" v-model="listQuery.customer_id"
                 filterable
                 style="width: 150px"
                 remote
                 :remote-method="handletypeList"
                 clearable
                 :loading="typeLoading"
                 class="filter-item"
                 @change='handleFilter'>
        <el-option
          v-for="item in typeOptions"
          :key="item.id"
          :label="item.user_nickname + '(' + item.phone + ')'"
          :value="item.customer_id">
        </el-option>
      </el-select>
      <el-select placeholder="请选择余额类型" @change='handleFilter' clearable style="width: 140px" class="filter-item" v-model="listQuery.recordable_type">
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
        <el-table-column label="用户名" min-width="300" align="center">
          <template slot-scope="scope">
            <span style="color: #5f92c3fc;">{{scope.row.customer_shop.user_nickname}}({{scope.row.customer_shop.phone}})</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" min-width="250" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type_attr == 'add'" style="color:#259b24">+{{scope.row.money}}</span>
            <span v-else style="color:#e51c23;">-{{scope.row.money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额操作类型" min-width="250" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.recordable_type  | TypeStatusTranslator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="250" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.recordable">{{scope.row.recordable.info}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
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
    </template>
  </div>
</template>

<script>
  import { getShopBalanceRecordList } from '@/api/financial'
  import { getCustomerShopList } from '@/api/customer'
  import waves from '@/directive/waves'
  export default {
    name: 'balanceDetail',
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
          customer_id: undefined,
          recordable_type: ''
        },
        pickerOptions2: {},
        listLoading: true,
        list: null,
        total: null,
        typeLoading: true,
        typeOptions: [],
        goldTypeOptions: [
          { key: 'order_balance_profit', label: '佣金获利' },
          { key: 'order_balance_consume', label: '下单消费' },
          { key: 'order_balance_return', label: '取消订单返还' },
          { key: 'order_balance_withdraw', label: '提现' }
        ]
      }
    },
    filters: {
      TypeStatusTranslator(status) {
        const statusMap = {
          order_balance_profit: '佣金获利',
          order_balance_consume: '下单消费',
          order_balance_return: '取消订单返还',
          order_balance_withdraw: '提现'
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
        getShopBalanceRecordList(this.listQuery).then(response => {
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
      // 用户名筛选
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
          getCustomerShopList({ phone: query, page_size: 10 }).then(response => {
            this.typeOptions = response.data.data
            this.typeLoading = false
          })
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
