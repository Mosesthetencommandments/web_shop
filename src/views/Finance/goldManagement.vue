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
      <el-select placeholder="请选择金币类型" @change='handleFilter' clearable style="width: 150px" class="filter-item" v-model="listQuery.recordable_type">
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
        <el-table-column label="贝壳类型" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type | GoldTypeStatusTranslator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="贝壳数量" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type_attr == 'add'" style="color:#259b24">+{{scope.row.number}}</span>
            <span v-else style="color:#e51c23;">-{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金币操作类型" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.recordable_type | TypeStatusTranslator}}</span>
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
  import { getShopGoldRecordList } from '@/api/financial'
  import { getCustomerShopList } from '@/api/customer'

  // import { parseTime } from '@/utils/index'
  import waves from '@/directive/waves'
  export default {
    name: 'goldManagement',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        listQuery: {
          page: 1,
          page_size: 10,
          date_range: [
            // parseTime(new Date(), '{y}-{m}-{d}'),
            // parseTime(new Date(new Date().getTime() + 1000 * 3600 * 24 * 7), '{y}-{m}-{d}')
          ],
          customer_id: undefined
        },
        pickerOptions2: {},
        listLoading: true,
        list: null,
        total: null,
        typeLoading: true,
        typeOptions: [],
        goldTypeOptions: [
          { key: 'order_consume', label: '商城购物消耗' },
          { key: 'order_return', label: '商城购物' },
          { key: 'order_gain', label: '下单赠送' }
        ]
      }
    },
    filters: {
      TypeStatusTranslator(status) {
        const statusMap = {
          order_consume: '商城购物消耗',
          // 2: '签到',
          order_return: '退单返还',
          order_gain: '下单赠送'
        }
        return statusMap[status]
      },
      GoldTypeStatusTranslator(status) {
        const statusMap = {
          1: '金贝',
          2: '银贝'
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
        getShopGoldRecordList(this.listQuery).then(response => {
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
