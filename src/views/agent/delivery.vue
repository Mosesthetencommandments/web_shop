<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索 | 添加1 -->
    <div class="filter-container">
      <el-select
        @change="handleFilter"
        style="width: 200px"
        class="filter-item"
        v-model="recordList.status"
        placeholder="状态"
        clearable
      >
        <el-option
          v-for="item in commentOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        @change="handleFilterl"
        style="width: 200px"
        class="filter-item"
        v-model="recordList.is_warehouse"
        placeholder="请选择"
        clearable
      >
        <el-option
          v-for="item in commentOption"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
    </div>
    <!-- 查看提货单 -->
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
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品ID" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.agent_goods.goods_image" style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="凭证" >
        <template slot-scope="scope">
          <img :src="scope.row.payment_img" style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品价格" >
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.actual_price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品规格" >
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.goods_specs}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进货量" >
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进货人" >
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进货时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | groupFuncTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_warehouse == 1" type="success" size="mini" @click="yes(scope.row)">同意</el-button>
          <el-button v-if="scope.row.is_warehouse == 1" type="danger" size="mini" @click="no(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="recordList.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="recordList.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getCustomerAgentInfo,
  getAgentGoodsApprovalRecordList,
  updateAgentGoodsAgreeApproval
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
      commentOptions: [
        //状态
        { key: 1, label: "审批通过" },
        { key: 2, label: "审批拒绝" },
        { key: 3, label: "待审批" }
      ],
      commentOption: [
        //状态
        { key: 1, label: "总部提货" },
        { key: 2, label: "非总部提货" }
      ],
      names: "1", //选项卡默认值
      dataList: [], //列表数组
      total: 0, //列表total
      recordList: {
        //货单
        is_warehouse: "",
        type: 1,
        status: "",
        page: 1,
        page_size: 10
      },
      orders: {
        //同意
        approval_id: undefined,
        status: 1,
        type: 1,
        goods_id: undefined,
        customer_id: undefined,
        number: undefined
      },
      ordersl: {
        //拒绝
        approval_id: undefined,
        status: 2,
        type: 1,
        goods_id: undefined,
        customer_id: undefined,
        number: undefined
      }
    };
  },
  filters: {
    groupFuncTranslator(func) {
      const statusMap = {
        1: "审批通过",
        2: "审批拒绝",
        3: "待审批"
      };
      return statusMap[func];
    }
  },
  created() {
    this.deliverys();
  },
  methods: {
    //查看进货单
    deliverys() {
      this.listLoading = true;
      getAgentGoodsApprovalRecordList(this.recordList).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    //查看提货单同意
    yes(row) {
      this.orders.number = row.number;
      this.orders.customer_id = row.customer_id;
      this.orders.approval_id = row.id;
      this.orders.goods_id = row.agent_goods.id;
      updateAgentGoodsAgreeApproval(this.orders).then(res => {
        this.$notify({
          title: "成功",
          message: "已审批",
          type: "success",
          duration: 2000
        });
        this.deliverys();
      });
    },
    //查看提货单拒绝
    no(row) {
      this.ordersl.number = row.number;
      this.ordersl.customer_id = row.customer_id;
      this.ordersl.approval_id = row.id;
      this.ordersl.goods_id = row.agent_goods.id;
      updateAgentGoodsAgreeApproval(this.ordersl).then(res => {
        this.$notify({
          title: "成功",
          message: "已拒绝",
          type: "success",
          duration: 2000
        });
        this.deliverys();
      });
    },
    //分页
    handleSizeChange(val) {
      this.recordList.page_size = val;
      this.deliverys();
    },
    handleCurrentChange(val) {
      this.recordList.page = val;
      this.deliverys();
    },
    // 状态搜索
    handleFilter() {
      this.recordList.page = 1;
      this.deliverys();
    },
    //总部提货搜索
    handleFilterl() {
      // if (this.recordList.is_warehouse == 1) {
      //   this.recordList.distribution_level_id = 6;
      // } else {
      //   this.recordList.distribution_level_id = "";
      // }
      this.recordList.page = 1;
      this.deliverys();
    }
  }
};
</script>
