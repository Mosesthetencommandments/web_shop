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
    <!-- 状态 -->
      <el-select
        style="width: 150px"
        @change="handleFilter"
        v-model="listQuery.check_status"
        filterable
        clearable
        :loading="vipLoading"
        placeholder="状态"
        class="filter-item"
      >
      <el-option v-for="item in vipOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
    <!-- 搜索 -->
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
    <!-- 导出功能 -->
    <div style="float: right;">
        <download-excel
          class="export-excel-wrapper"
          :data="this.dataList"
          :fields="json_fields"
          name="提现列表.xls"
        >
          <el-button type="primary" class="filter-item" v-waves>导出EXCEL</el-button>
        </download-excel>
      </div>
    </div>
    <!-- 提现列表 -->
    <el-table :data="dataList" border id="outTable" style="width: 100%;">
      <el-table-column label="ID" align="center" min-width="40">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.truename}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="assemble_price" label="手机号" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.user_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.wallet_type}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开户行"
        align="center"
        prop="shop_customer_wallet.shop_bank_type.bank_type_name"
      ></el-table-column>
      <el-table-column
        label="账户"
        align="center"
        prop="shop_customer_wallet.card_number"
        min-width="120"
      ></el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.withdraw_money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center" min-width="120">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.withdraw_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag class="link-type">{{scope.row.check_status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核不通过原因" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.info}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleEditSet(scope.row)"
          >审核通过</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleEditSets(scope.row)"
          >审核不通过</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleEditSetsl(scope.row)"
          >查看详情</el-button>
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
        :page-sizes="[20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 审核通过弹窗 -->
    <el-dialog title="审核" :visible.sync="dialogVisible" width="50%" @close="handledelete">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createdata">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 审核不通过弹窗 -->
    <el-dialog title="驳回原因" :visible.sync="dialogVisibles" width="30%" @close="handledeletes">
      <el-form :model="prord" label-position="left" style="width: 90%; margin-left:5%;">
        <el-form-item label="审核不通过原因 :">
          <el-input type="textarea" :rows="5" placeholder="请输入原因" v-model="prord.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="createdatas">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情弹窗 -->
    <el-dialog title="提现详情" :visible.sync="dialogVisiblesl" width="30%">
      <el-card>
        <h4>基本信息</h4>
        <p class="data-items" style="margin-left:50px">提 现 ID : {{shops.id}}</p>
        <p
          class="data-items"
          style="margin-left:50px"
        >类 型 : {{shops.wallet_type | GoldTypeStatusTranslator}}</p>
        <p class="data-items" style="margin-left:50px">账 户 : {{shop_customer_wallet.card_number}}</p>
        <p class="data-items" style="margin-left:50px">提现人 : {{shops.user_nickname}}</p>
        <p class="data-items" style="margin-left:50px">审核人 : {{shops.admin_nickname}}</p>
        <p class="data-items" style="margin-left:50px">提现人手机号 : {{shops.user_phone}}</p>
        <p class="data-items" style="margin-left:50px">提现金额 : {{shops.withdraw_money}}</p>
        <p class="data-items" style="margin-left:50px">提现时间 : {{shops.withdraw_time}}</p>
        <p class="data-items" style="margin-left:50px">
          审核状态 :
          <el-tag class="link-type">{{shops.check_status | GoldTypeStatusTranslatls }}</el-tag>
        </p>
        <p class="data-items" style="margin-left:50px">审核不通过原因 : {{shops.info}}</p>
        <p class="data-items" style="margin-left:50px">打款交易ID : {{shops.transaction_id}}</p>
        <p class="data-items" style="margin-left:50px">打款交易凭证 :</p>
        <img :src="imgurl" style="width:400px;margin-left:50px" />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblesl = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisiblesl = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getShopBalanceWithdrawRecordList,
  passShopBalanceWithdrawRecord,
  findShopBalanceWithdrawRecordInfo,
  noPassShopBalanceWithdrawRecord
} from "@/api/financial";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "balance_Details",
  components: {},
  directives: {
    waves
  },
  data() {
    return {
      json_fields: {}, //导出数据
      imgurl: "", //打款凭证
      prord: {
        //审核不通过传参
        shop_balance_withdraw_record_id: undefined,
        info: undefined
      },
      vipOptions: [
        //状态下拉框
        { key: "1", label: "待审核" },
        { key: "2", label: "未通过" },
        { key: "4", label: "已完结" }
      ],
      vipLoading: false,
      shops: [], // 查看详情数据
      shop_customer_wallet: [],
      fileList: [], //图片路径
      baseUrl: process.env.BASE_API + "/api/document/uploadImage", //上传路径
      dialogVisible: false,
      dialogVisibles: false,
      dialogVisiblesl: false,
      dataList: [], //积分列表数据
      total: 0, //分页数据
      price: {
        //审核通过传参
        transaction_unique_id: undefined,
        transaction_proof: undefined,
        shop_balance_withdraw_record_id: undefined
      },
      id: "",
      listQuery: {
        //分页
        page: 1,
        page_size: 20,
        date_range: undefined,
        check_status: undefined
      }
    };
  },
  filters: {
    GoldTypeStatusTranslator(status) {
      const statusMap = {
        1: "银行卡",
        2: "支付宝",
        3: "微信"
      };
      return statusMap[status];
    },
    GoldTypeStatusTranslatls(status) {
      const statusMap = {
        1: "待审核",
        2: "未通过",
        3: "已通过",
        4: "已完结"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getdataList();
  },
  methods: {
    //目前没采用的导出事件，如果需要使用加点击事件就OK
    exportExcel() {
      var xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#outTable"),
        xlsxParam
      );
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      const defaultCellStyle = {
        font: { name: "Verdana", sz: 13, color: "FF00FF88" },
        fill: { fgColor: { rgb: "FFFFAA00" } },
        width: { width: "300" }
      }; //设置表格的样式
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "提现报表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //下拉框失去焦点事件
    handleFilter() {
      this.listQuery.page = 1;
      this.getdataList();
    },
    //审核不通过弹窗关闭时回调事件
    handledeletes() {
      this.prord = {};
    },
    //审核通过弹窗关闭时回调事件
    handledelete() {
      this.price = {
        transaction_unique_id: undefined,
        transaction_proof: undefined,
        shop_balance_withdraw_record_id: undefined
      };
      this.fileList = [];
    },
    //查看详情
    handleEditSetsl(row) {
      this.dialogVisiblesl = true;
      findShopBalanceWithdrawRecordInfo({
        shop_balance_withdraw_record_id: row.id,
        check_status: row.check_status
      }).then(res => {
        this.shops = res.data;
        this.shop_customer_wallet = res.data.shop_customer_wallet;
        this.imgurl = res.data.transaction_proof;
      });
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
    // 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getdataList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getdataList();
    },
    // 提现列表
    getdataList() {
      getShopBalanceWithdrawRecordList(this.listQuery).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.total;
        //以下是导出事件内容
        this.dataList.map(res => {
          if (res.wallet_type == 1) {
            res.wallet_type = "银行卡";
          } else if (res.wallet_type == 2) {
            res.wallet_type = "支付宝";
          } else if (res.wallet_type == 3) {
            res.wallet_type = "微信";
          }
          if (res.check_status == 1) {
            res.check_status = "待审核";
          } else if (res.check_status == 2) {
            res.check_status = "未通过";
          } else if (res.check_status == 3) {
            res.check_status = "已通过";
          } else if (res.check_status == 4) {
            res.check_status = "已完结";
          }
        });
          this.json_fields.ID = "id";
          this.json_fields.姓名 = "truename";
          this.json_fields.手机号 = "user_phone";
          this.json_fields.类型 = "wallet_type";
          this.json_fields.开户行 = "shop_customer_wallet.shop_bank_type.bank_type_name";
          this.json_fields.账户 = "shop_customer_wallet.card_number";
          this.json_fields.提现金额 = "withdraw_money";
          this.json_fields.提现时间 = "withdraw_time";
          this.json_fields.审核状态 = "check_status";
      });
    },
    // 审核通过
    handleEditSet(row) {
      this.dialogVisible = true;
      this.id = row.id;
    },
    // 审核通过确认
    createdata() {
      this.price.shop_balance_withdraw_record_id = this.id;
      passShopBalanceWithdrawRecord(this.price).then(res => {
        this.$notify({
          title: "成功",
          message: "审核成功",
          type: "success",
          duration: 2000
        });
        this.dialogVisible = false;
        this.getdataList();
      });
    },
    // 审核不通过方法
    handleEditSets(row) {
      this.prord.shop_balance_withdraw_record_id = row.id;
      this.dialogVisibles = true;
    },
    // 审核不通过确定按钮方法
    createdatas() {
      noPassShopBalanceWithdrawRecord(this.prord).then(res => {
        this.dialogVisibles = false;
        this.$notify({
          title: "失败",
          message: "审核失败",
          type: "success",
          duration: 2000
        });
        this.getdataList();
      });
    }
  }
};
</script>

