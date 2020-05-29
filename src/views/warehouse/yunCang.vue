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
        @change="handleFilter"
      ></el-date-picker>
      <!-- 类型 -->
      <el-select class="filter-item" style="width: 203px" filterable clearable placeholder="选择类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 手机号 -->
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        v-model="listQuery.phone"
        clearable
        class="filter-item"
        placeholder="手机号"
      ></el-input>
      <!-- 微信名称 -->
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        v-model="listQuery.user_nickname"
        clearable
        class="filter-item"
        placeholder="微信名称"
      ></el-input>
      <!-- 搜索、添加、导出 -->
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="createList">添加</el-button>
      <download-excel
        class="export-excel-wrapper"
        :data="this.dataList"
        :fields="json_fields"
        name="提现列表.xls"
      >
        <el-button type="primary" class="filter-item" v-waves>导出EXCEL</el-button>
      </download-excel>
    </div>
    <!-- 表格 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column label="ID" align="center">
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
      <el-table-column prop="customer_shop_pid.user_nickname" label="所属上级微信名称" align="center"></el-table-column>
      <el-table-column prop="customer_shop_pid.phone" label="所属上级手机号" align="center"></el-table-column>
      <el-table-column prop="address" label="佣金" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.profit_all}}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结佣金" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.profit_frozen}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已提现佣金" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.profit_withdraw}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updatasList(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteList(scope.row)">删除</el-button>
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
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加弹窗 -->
    <!-- <el-dialog title="添加" :visible.sync="dialogVisible" width="50%" @close="handledelete">
      <el-form
        ref="dataPrice"
        :model="price"
        label-position="left"
        style="width: 100%; margin-left:5%;"
      >
        <el-form-item label="打 款 交 易 ID : ">
          <el-input placeholder="请输入ID" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="打款交易凭证 :">
          <el-upload
            :action="baseUrl"
            name="image"
            :limit="1"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleUp"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="margin-left:100px">只能上传jpg/png文件,图片大小不能超过2M</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createdata">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- 修改弹窗 -->
    <!-- <el-dialog title="修改" :visible.sync="dialogVisibles" width="50%">
      <el-form
        ref="dataPrice"
        :model="price"
        label-position="left"
        style="width: 100%; margin-left:5%;"
      >
        <el-form-item label="打 款 交 易 ID : ">
          <el-input v-model="price.transaction_unique_id" placeholder="请输入ID" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="打款交易凭证 :">
          <el-upload
            :action="baseUrl"
            name="image"
            :limit="1"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleUp"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="margin-left:100px">只能上传jpg/png文件,图片大小不能超过2M</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="updatas">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { getShopBalanceProfitRecordList } from "@/api/financial"; //引入api
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "yunCang",
  components: {//引入组件
  },
  directives: {// 水波纹
    waves
  },
  data() {// 状态值
    return {
      baseUrl: process.env.BASE_API + "/api/document/uploadImage", //上传路径
     fileList: [], //图片路径
      options: [
        {
          value: 3,
          label: "分享海报"
        },
        {
          value: 6,
          label: "VIP"
        }
      ],
      json_fields: {}, //导出数据
      dataList: [], //列表數據
      total: 0, //分页数据
      vipOptions: [],
      vipLoading: false, //加载
      listQuery: {
        phone: undefined, //手机号
        user_nickname: undefined, //微信名称
        distribution_level_id: undefined, //等级
        date_range: undefined, //时间
        page: 1, //分页
        page_size: 20, //分页
        sort: -1 //排序
      },
      dialogVisible:false,
      dialogVisibles:false,
    };
  },

  filters: {// 过滤
    statusFilter(status) {
      const statusMap = {
        1: "",
        2: "",
        3: ""
      };
      return statusMap[status];
    }
  },
  created() {},
  methods: {
    //获取列表数据和搜索方法
    getdatalist() {
      getShopBalanceProfitRecordList(this.listQuery).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.total;
        for (const v in this.dataList) {
          this.json_fields.ID = "id";
          this.json_fields.姓名 = "truename";
          this.json_fields.手机号 = "user_phone";
          this.json_fields.类型 = "wallet_type";
          this.json_fields.开户行 = "shop_customer_wallet.shop_bank_type.bank_type_name";
          this.json_fields.账户 = "shop_customer_wallet.card_number";
          this.json_fields.提现金额 = "withdraw_money";
          this.json_fields.提现时间 = "withdraw_time";
          this.json_fields.审核状态 = "check_status";
        }
      });
    },
    // 添加按钮
    createList() {
      this.dialogVisible = true
    },
   // 添加弹窗确定方法
    createdata(){},
   // 添加弹窗关闭回调方法
    handledelete(){},
   // 修改按钮查看详情
    updatasList(row) {},
   // 修改弹窗确定方法
    updatas() {},
    // 删除按钮
    deleteList(row) {},
    // 下拉框失去焦点事件和搜索事件
    handleFilter() {
      this.listQuery.page = 1;
      this.getdatalist();
    },
    // 上传成功函数
    handleUp(response, file, fileList) {
      this.price.transaction_proof = response.data.url;
    },
    // 上传失败函数
    handleRemove() {
      this.price.transaction_proof = "";
    },
    // 上传时效验函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getdatalist();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getdatalist();
    }
  }
};
</script>
