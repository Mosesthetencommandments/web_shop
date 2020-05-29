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
      <el-select v-model="listQuery.customer_account_id"
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
          :label="item.user_nickname"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.type">
        <el-option v-for="item in goldTypeOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.status">
        <el-option v-for="item in coldOptions" :key="item.key" :label="item.label" :value="item.key">
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
        <el-table-column label="佣金变化" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type_attr == 'add'" style="color:#259b24">+{{scope.row.profit_money}}</span>
            <span v-else style="color:#e51c23;">-{{scope.row.profit_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orders_unique_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="佣金状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | TypeStatusFilter">{{scope.row.status | TypeStatusTranslator}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="佣金类型" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.profit_type | TypeStatus}}-{{scope.row.type | TypeStatus1}}</span>
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
  import { getShopDistributionProfitRecordList, getCustomerAccountList } from '@/api/financial'
  import waves from '@/directive/waves'
  export default {
    name: 'commissionDetail',
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
        list: [],
        total: null,
        typeLoading: true,
        typeOptions: [],
        goldTypeOptions: [
          { key: 1, label: '订单反佣' },
          { key: 2, label: '退单减佣' },
          { key: 3, label: '等级奖励' }
        ],
        coldOptions: [
          { key: 1, label: '冻结中' },
          { key: 2, label: '已生效' }
        ]
      }
    },
    filters: {
      TypeStatusTranslator(status) {
        const statusMap = {
          1: '冻结中',
          2: '已生效'
        }
        return statusMap[status]
      },
      TypeStatus(status) {
        const statusMap = {
          1: '直接',
          2: '间接'
        }
        return statusMap[status]
      },
      TypeStatus1(status) {
        const statusMap = {
          1: '订单返佣',
          2: '退单减佣',
          3: '等级奖励',
        }
        return statusMap[status]
      },
      TypeStatusFilter(status) {
        const statusMap = {
          1: 'primary',
          2: 'danger'
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
        getShopDistributionProfitRecordList(this.listQuery).then(response => {
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
          getCustomerAccountList({ user_nickname: query, page_size: 10 }).then(response => {
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
