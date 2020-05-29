<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        class="filter-item"
        placeholder="手机号"
        v-model="listQuery.phone"
        clearable
      ></el-input>
      <el-select
        @change="handleFilter"
        style="width: 200px"
        class="filter-item"
        v-model="listQuery.status"
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
       <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜 索</el-button>
      <div class="filter-float">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">刷 新</el-button>
      </div>
    </div>
    <!-- 代理列表 -->
    <el-table
      :stripe="true"
      :data="list"
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
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.customer_shop.user_nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.customer_shop.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="等级">
        <template slot-scope="scope">
          <span>{{scope.row.customer_shop.distribution_level_name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="进货量">
        <template slot-scope="scope">{{scope.row.buy}}</template>
      </el-table-column>
      <el-table-column align="center" label="提货量">
        <template slot-scope="scope">{{scope.row.sell}}</template>
      </el-table-column>
      <el-table-column  align="center" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | groupFuncTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center" >
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updata(scope.row)">修改</el-button>
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
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="dialogVisibles" width="30%">
      <el-form :model="temp" label-position="left" style="width: 90%; margin-left:5%;">
        <el-form-item label="密码 :">
          <el-input placeholder="请输入密码" style="width: 400px" v-model="passwords"></el-input>
        </el-form-item>
        <el-form-item label="状态 :">
          <el-select
            style="width: 400px"
            class="filter-item"
            v-model="temp.status"
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="createdatas">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCustomerAgentList,
  updateCustomerAgent,
  getCustomerAgentInfo,
  getAgentGoodsApprovalRecordList,
  updateAgentGoodsAgreeApproval
} from "@/api/agent";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "agentList",
  directives: {
    waves
  },
  data() {
    return {
      dataList:[],
      temp: [], //修改数组
      passwords:'',  //密码默认不显示
      dialogVisibles: false, //修改弹窗
      list: [], //列表数组
      total: 0, //列表total
      listQuery: {
        //获取列表数据
        page: 1,
        page_size: 10,
        phone: undefined,
        status: undefined
      },
      commentOptions: [
        //状态
        { key: 1, label: "待审核" },
        { key: 2, label: "正常" },
        { key: 3, label: "封禁" }
      ],
    };
  },
  filters: {
    groupFuncTranslator(func) {
      const statusMap = {
        1: "待审核",
        2: "正常",
        3: "封禁"
      };
      return statusMap[func]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //修改
    createdatas() {
      this.temp.password = this.passwords
      updateCustomerAgent(this.temp).then(res => {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
        this.dialogVisibles = false;
        this.getList();
      });
    },
    //查看详情
    updata(row) {
      this.passwords = ''
      this.dialogVisibles = true;
      getCustomerAgentInfo({
        customer_id: row.customer_id,
        shop_store_id: row.shop_store_id
      }).then(res => {
        this.temp = res.data.data;
      });
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      getCustomerAgentList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  }
};
</script>

