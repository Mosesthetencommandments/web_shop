<template>
  <div class="app-container calendar-list-container">
    <!-- 云仓库存报表 -->
    <el-table
      :stripe="true"
      :data="dataList"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
         <span>{{scope.row.agent_goods.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.goods_specs}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="云仓库存数量">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计进货量">
        <template slot-scope="scope">
          <span>{{scope.row.cumulative_number}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getAgentGoodsReportList,
} from "@/api/agent";
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "delivery",
  directives: {
    waves
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        //请求列表
        page: 1,
        page_size: 20
      },
      dataList: [], //列表数组
      total: 0, //列表total
    };
  },
  created() {
    this.deliverys();
  },
  methods: {
    //云仓库存报表
    deliverys() {
      this.listLoading = true;
      getAgentGoodsReportList(this.listQuery).then(res => {
        this.dataList = res.data.data;
        console.log(this.dataList,1111)
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.deliverys();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.deliverys();
    },
    // 状态搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.deliverys();
    },
  }
};
</script>
