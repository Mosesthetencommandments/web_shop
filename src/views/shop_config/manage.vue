<template>
  <div>
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <el-table
      :data="activePosterList"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      stripe
      fit
      highlight-current-row
      border
      align="center"
      style="width: 100%"
    >
      <el-table-column label="序号" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.type | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海报图" min-width="180" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.template_img" alt style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column min-width="180" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="gotoPoster(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="deletes(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from "@/directive/waves";
import {
  getActivePosterList,
  getActivePosterInfo,
  changeActivePoster
} from "@/api/community";
import {
  getShopPosterTemplateList,
  deleteShopPosterTemplate,
  updateShopPosterTempStatus
} from "@/api/setting";
export default {
  name: "manage",
  directives: {
    waves
  },
  data() {
    return {
      listLoading: false,
      activePosterList: []
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        3: "分享海报",
        6: "VIP",
        7: "授权书",
      };
      return statusMap[status];
    },
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      if (this.$route.name == "manage") {
         this.getActivePosterList()
      }
    },
    getActivePosterList() {
      getShopPosterTemplateList({ limit: 3 }).then(response => {
        if (response.code === 200) {
          this.activePosterList = response.data.data;
          console.log(this.activePosterList, 3333);
        }
      });
    },
    create() {
      this.$router.push({
        name: "communityPostersl"
      });
    },
    deletes(row) {
      deleteShopPosterTemplate({ shop_template_id: row.id }).then(res => {
        this.$notify({
          title: "删除成功",
          message: "成功",
          type: "success",
          duration: 1000
        });
        this.getActivePosterList();
      });
    },
    gotoPoster(row) {
      let add = JSON.parse(localStorage.getItem("activeType"));
      if (add === null || add.length === 0) {
        localStorage.setItem("activeType", JSON.stringify(row.id));
      } else {
        localStorage.activeType = row.id;
      }
      this.$router.push({
        name: "communityPostersls"
      });
    }
  },

  created() {
    this.getActivePosterList();
  }
};
</script>

<style scoped>
</style>
