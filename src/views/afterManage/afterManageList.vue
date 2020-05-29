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
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="订单号"
                v-model="listQuery.orders_unique_id" clearable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="售后单号"
                v-model="listQuery.after_sale_unique_id" clearable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="客户电话"
                v-model="listQuery.customer_account_phone" clearable>
      </el-input>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.procedure_status">
        <el-option v-for="item in procedureOptions" :key="item.key" :label="item.label" :value="item.key">
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
        <el-table-column prop="name" label="售后单号" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sale_unique_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="售后类型" align="center" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.after_sale_type_id == 1">退货</span>
            <span v-if="scope.row.after_sale_type_id == 2">换货</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="100px">
          <template slot-scope="scope">
            {{scope.row.procedure_status|procedureStatus}}
          </template>
        </el-table-column>
        <el-table-column min-width="150" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button type="primary" @click="operation(scope.row)">操作</el-button>
            <!--<div v-if="scope.row.procedure_status == 0">-->
              <!--<el-button type="success" @click="operation(scope.row)">审核通过</el-button>-->
              <!--<el-button type="danger">审核失败</el-button>-->
            <!--</div>-->
            <!--<el-button v-else-if="scope.row.procedure_status == 6 || scope.row.procedure_status == 8" type="primary">完结</el-button>-->
            <!--<el-button v-else-if="scope.row.procedure_status == 1 || scope.row.procedure_status == 3" type="primary">关闭</el-button>-->
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
  import waves from '@/directive/waves'
  import { getAfterSaleList } from '@/api/aftersale'
  export default {
    name: 'afterManageList',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        listQuery: {
          page: 1,
          page_size:10,
          date_range: [],
          after_sale_unique_id: undefined,
          orders_unique_id: undefined,
          customer_account_phone: undefined
        },
        temp: {
        },
        procedureOptions: [
          { key: 1, label: '审核通过' },
          { key: 2, label: '审核失败' },
          { key: 3, label: '已收到退货，货物数目错误' },
          { key: 4, label: '已收到退货，退货数目正确' },
          { key: 5, label: '已收到退货，退货数目正确(换货)' },
          { key: 6, label: '已收到货,换货已发出' },
          { key: 7, label: '等待打款' },
          { key: 8, label: '已打款，等待完结' },
          { key: 9, label: '未打款，收款信息不明确' },
          { key: 10, label: '已完结' },
          { key: 11, label: '已关闭' },
          { key: 12, label: '取消' }
        ],
        pickerOptions2: {},
        list: [],
        total: null,
        listLoading: false
      }
    },
    filters: {
      procedureStatus(status) {
        const statusTransMap = {
          1: '审核通过，等待接收退货',
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
        return statusTransMap[status]
      }
    },
    created() {
      this.getList()
    },
    activated() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAfterSaleList(this.listQuery).then(response => {
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
      // 操作
      operation(row) {
        this.$router.push({
          path:'/afterManage/afterDetails',
          query:{
            after_sale_id:row.id
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
      }
    }
  }
</script>

<style scoped>

</style>
