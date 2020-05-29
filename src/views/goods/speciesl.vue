<template>
  <div class="app-container calendar-list-container">
    <!-- 刷新 -->
    <div class="filter-container">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">刷 新</el-button>
    </div>
    <!-- 积分商品列表 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格明细" align="center">
        <template slot-scope="scope">
          <span v-for="(item, i) in scope.row.species_value" :key="i">{{ item + ', ' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="originalPrice" label="原价" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.origin_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actual_price" label="实际售价" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.actual_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="assemble_price" label="拼团售价" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.assemble_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="分销售价" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.distribution_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="商品名称" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.shop_goods_common.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" align="center">
        <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleEditSet(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
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
  </div>
</template>
<script>
import {
  getShopGoodsIntegralList,
  updateShopGoodsIntegralStatus,
  delIntegralShopGoodsInfo
} from "@/api/goods";
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "speciesl",
  components: {},
  directives: {
    waves
  },
  data() {
    return {
      dataList: [], //积分列表数据
      total: 0, //分页数据
      listQuery: {
        page: 1,
        page_size: 10
      }
    };
  },
  created() {
    this.getdataList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getdataList();
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getdataList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getdataList();s
    },
    // 删除
    handleEditSet(row) {
      this.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delIntegralShopGoodsInfo({
            shop_goods_id:row.id,
            integral_status: 2,
          }).then(res => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getdataList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 积分列表
    getdataList() {
      getShopGoodsIntegralList({ integral_status: 1, ...this.listQuery }).then(
        res => {
          this.dataList = res.data.data;
          console.log(this.dataList,33333)
          this.total = res.data.total;
        }
      );
    }
  }
};
</script>
