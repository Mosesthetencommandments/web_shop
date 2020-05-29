<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- 日期 -->
      <el-date-picker
        class="filter-item"
        v-model="listQuery.date_range"
        type="daterange"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="-"
        unlink-panels
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change='handleFilter'
      ></el-date-picker>
      <!-- 手机号 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" v-model="listQuery.phone" clearable  class="filter-item"  placeholder="手机号"></el-input>
      <!-- 微信名称 -->
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" v-model="listQuery.user_nickname" clearable  class="filter-item" placeholder="微信名称"></el-input>
      <!-- 等级 -->
      <el-select
        style="width: 150px"
        @change='handleFilter'
        v-model="listQuery.distribution_level_id"
        filterable
        clearable
        remote
        :remote-method="handlevipList"
        :loading="vipLoading"
        placeholder="等级"
        class="filter-item">
          <el-option
            v-for="item in vipOptions"
            :key="item.id"
            :label="item.distribution_level_name"
            :value="item.id">
          </el-option>
        </el-select>
      <!-- 搜索 -->
      <el-button class="filter-item" type="primary" v-waves  @click="handleFilter">搜索</el-button>
    </div>
      <!-- 表格 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column  label="ID" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
      </el-table-column>
      <el-table-column label="微信名称" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.user_nickname}}</span>
          </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
         <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
      </el-table-column>
      <el-table-column label="用户等级" align="center">
           <template slot-scope="scope">
            <span>{{scope.row.shop_distribution_level.distribution_level_name }}</span>
          </template>
      </el-table-column>
      <el-table-column prop="customer_shop_pid.user_nickname" label="所属上级微信名称" align="center">
      </el-table-column>
      <el-table-column prop="customer_shop_pid.phone" label="所属上级手机号" align="center">
      </el-table-column>
      <el-table-column prop="address" label="佣金" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.profit_all}}</span>
          </template>
      </el-table-column>
      <el-table-column  label="冻结佣金" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.profit_frozen}}</span>
          </template>
      </el-table-column>
      <el-table-column  label="可提现佣金" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.profit}}</span>
          </template>
      </el-table-column>
      <el-table-column label="已提现佣金" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.profit_withdraw}}</span>
          </template>
      </el-table-column>
    </el-table>
      <!-- 分页 -->
     <div class="pagination-container">
     <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[20,30, 50]" :page-size="listQuery.page_size"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
     </div>
  </div>
</template>
<script>
import {getShopBalanceProfitRecordList} from '@/api/financial'
import {getShopDistributionLevelList} from "../../api/setting";
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "balance_cash",
  components: {},
  directives: {
    waves
  },
  data() {
    return {
      dataList:[],//列表數據
      total:0,   //分页数据
      vipOptions:[],
      vipLoading: false, //加载
      listQuery: {
        phone:undefined,//手机号
        user_nickname:undefined,//微信名称
        distribution_level_id:undefined, //等级
        date_range:undefined, //时间
        page:1, //分页
        page_size:20, //分页
        sort:-1 //排序
      },
    };
  },
  created() {
    this.handlevipList(' ')
  },
  methods: {
    //分頁
    handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getdatalist()
      },
    handleCurrentChange(val) {
        this.listQuery.page = val
        this.getdatalist()
      },
    // 下拉框失去焦点事件和搜索事件
    handleFilter() {
        this.listQuery.page = 1
        this.getdatalist()
    },
    //获取列表数据和搜索方法
    getdatalist(){
        getShopBalanceProfitRecordList(this.listQuery).then(res=>{
          this.dataList  = res.data.data
          this.total = res.data.total
        })
    },
      // 获取等级
    handlevipList(query) {
        if (query !== '') {
          this.vipLoading = true
          getShopDistributionLevelList({ distribution_level_name: query, page_size: 10 ,status:1}).then(response => {
            this.vipOptions = response.data.data
            this.vipLoading = false
          })
        }
      },
  }
};
</script>
