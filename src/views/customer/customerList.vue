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
        @change="handleFilter"
        style="width: 280px;"
      ></el-date-picker>
      <!--客户昵称-->
      <el-input
        v-model="listQuery.user_nickname"
        placeholder="请输入客户昵称"
        style="width: 150px;"
        class="filter-item"
        clearable
      ></el-input>
      <el-input
        v-model="listQuery.phone"
        placeholder="请输入客户电话"
        style="width: 150px;"
        class="filter-item"
        clearable
      ></el-input>
      <el-select
        @change="handleFilter"
        clearable
        style="width: 120px"
        class="filter-item"
        v-model="listQuery.is_active"
      >
        <el-option
          v-for="item in activeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        style="width: 150px"
        @change="handleFilter"
        v-model="listQuery.distribution_level_id"
        filterable
        clearable
        :remote-method="handlevipList"
        :loading="vipLoading"
        placeholder="请选择分销等级"
        class="filter-item"
      >
        <el-option
          v-for="item in vipOptions"
          :key="item.id"
          :label="item.distribution_level_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div>
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      </div>
      <div style="float: right;">
        <download-excel
          class="export-excel-wrapper"
          :data="this.list"
          :fields="json_fields"
          name="客户列表.xls"
        >
          <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
          <el-button type="primary" class="filter-item" v-waves>导出EXCEL</el-button>
        </download-excel>
      </div>
    </div>
    <template>
      <el-table
        :key="tableKey"
        :data="list"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        stripe
        fit
        highlight-current-row
        border
        style="width: 100%;"
      >
        <el-table-column label="ID" width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.customer_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" width="150" align="center">
          <template slot-scope="scope">
            <span style="color: #5f92c3fc;">{{scope.row.user_nickname}}({{scope.row.phone}})</span>
          </template>
        </el-table-column>

        <el-table-column label="分销等级" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.distribution_level_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金贝余额" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.balance_gold}}</span>
          </template>
        </el-table-column>
        <el-table-column label="银贝余额" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.balance_silver}}</span>
          </template>
        </el-table-column>
        <el-table-column label="冻结金额" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.profit_frozen}}</span>
          </template>
        </el-table-column>
        <el-table-column label="佣金" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.profit_all}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可提现佣金" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.balance}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已提现佣金" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.withdraw_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="团队人数" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.team_number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上级" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.parentinfo}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center" label="账号状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column min-width="180" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="500">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
            <el-button type="success" size="mini" @click="creaters(scope.row)">添加代理</el-button>
            <el-button type="warning" size="mini" @click="upgrade(scope.row)">升级日志</el-button>
            <el-button type="success" plain size="mini" @click="updatePid(scope.row)">修改上级</el-button>
            <el-button type="primary" plain size="mini" @click="updatas(scope.row)">修改贝壳</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog :visible.sync="dialogPid">
        <el-form
          :rules="rule"
          ref="dateForm1"
          :model="temp"
          label-position="left"
          label-width="20%"
          style="width: 80%; margin-left:10%;"
        >
          <el-form-item label="选择上级" label-width="20%" prop="pid">
            <el-select
              v-model="temp1.pid"
              filterable
              remote
              clearable
              :remote-method="handlepidList"
              :loading="pidLoading"
              placeholder="请选择上级"
              class="filter-item"
              style="width: 100%;"
            >
              <el-option
                v-for="item in pidOptions"
                :key="item.customer_id"
                :label="item.user_nickname+item.phone"
                :value="item.customer_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPid = false">取 消</el-button>
          <el-button type="primary" @click="updatePidDo">确 定</el-button>
          <el-button type="primary" @click="updataRoos">修改成无上级</el-button>
        </div>
      </el-dialog>
      <!-- 添加弹窗 -->
      <el-dialog title="添加" :visible.sync="dialogVisiblesl" width="30%">
        <el-form :model="temps" label-position="left" style="width: 90%; margin-left:5%;">
          <el-form-item label="密码 :">
            <el-input placeholder="请输入密码" style="width: 400px" v-model="temps.password"></el-input>
          </el-form-item>
          <el-form-item label="状态 :">
            <el-select
              style="width: 400px"
              class="filter-item"
              v-model="status"
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
          <el-button @click="dialogVisiblesl = false">取 消</el-button>
          <el-button type="primary" @click="createdatas">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改贝壳 -->
      <el-dialog title="修改贝壳" :visible.sync="dialogPids" width="30%" @close="handgoods">
        <el-form
          :model="datas"
          label-position="left"
          label-width="80px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label-width="20%">
            <el-select
              v-model="datas.type"
              filterable
              remote
              clearable
              :loading="pidLoading"
              placeholder="请选择贝壳类型"
              class="filter-item"
              style="width: 100%;"
            >
              <el-option
                v-for="item in opionsl"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="20%">
            <el-select
              v-model="datas.type_attr"
              filterable
              remote
              clearable
              :loading="pidLoading"
              placeholder="请选择增加或减少"
              class="filter-item"
              style="width: 100%;"
            >
              <el-option
                v-for="item in dataList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item l label-width="20%">
            <el-input v-model="datas.number" placeholder="请输入数量"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPids = false">取 消</el-button>
          <el-button type="primary" @click="updatePidDob">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogCustomer">
        <el-form
          :rules="rule"
          ref="dateForm"
          :model="temp"
          label-position="left"
          label-width="20%"
          style="width: 80%; margin-left:10%;"
        >
          <el-form-item label="客户名称" label-width="20%">
            <el-input v-model="temp.user_nickname" disabled></el-input>
          </el-form-item>
          <el-form-item label="客户电话" label-width="20%" prop="phone">
            <el-input v-model="temp.phone"></el-input>
          </el-form-item>
          <!--<el-form-item label="会员等级" label-width="20%" prop="member_level_id">
            <el-select v-model="temp.member_level_id"
                       filterable
                       remote
                       clearable
                       :remote-method="handlelevelList"
                       :loading="levelLoading"
                       placeholder="请选择会员等级"
                       class="filter-item"
                       style="width: 100%;">
              <el-option
                :disabled="item.status == '2'"
                v-for="item in levelOptions"
                :key="item.id"
                :label="item.member_level_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="分销等级" label-width="20%" prop="distribution_level_id">
            <el-select
              v-model="temp.distribution_level_id"
              filterable
              remote
              clearable
              :remote-method="handlevipList"
              :loading="vipLoading"
              placeholder="请选择分销等级"
              class="filter-item"
              style="width: 100%;"
            >
              <el-option
                v-for="item in vipOptions"
                :key="item.id"
                :label="item.distribution_level_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码" label-width="20%">
            <el-input v-model="temp.invite_code" disabled></el-input>
          </el-form-item>
          <!--<el-form-item label="开启分销" label-width="20%">
            <el-radio-group v-model="temp.is_distribution" size="medium">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="2">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="真实姓名" label-width="20%" prop="truename">
            <el-input v-model="temp.truename"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="20%" prop="idcard">
            <el-input v-model="temp.idcard"></el-input>
          </el-form-item>
          <el-form-item label="生日" label-width="20%" prop="birthday">
            <el-date-picker
              class="filter-item"
              v-model="temp.birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              :picker-options="pickerOptions2"
              @change="handleFilter"
              style="width: 180px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="工作手机" label-width="20%">
            <el-radio-group v-model="temp.is_distribution" size="medium">
              <el-radio-button label="1">否</el-radio-button>
              <el-radio-button label="2">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" label-width="20%">
            <el-radio-group v-model="temp.is_active" size="medium">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCustomer = false">取 消</el-button>
          <el-button type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVip" width="80%">
        <el-table
          :key="tableKey1"
          :data="list1"
          v-loading="listLoading1"
          element-loading-text="给我一点时间"
          stripe
          fit
          highlight-current-row
          border
          style="width: 100%;"
        >
          <el-table-column label="ID" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="升级类型" min-width="200" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">升级</span>
              <span v-else>降级</span>
            </template>
          </el-table-column>
          <el-table-column label="原等级" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.shop_distribution_level_before}}</span>
            </template>
          </el-table-column>
          <el-table-column label="现等级" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.shop_distribution_level_after}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="300" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.created_at}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading1" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page.sync="listQuery1.page"
            :page-sizes="[5,10,15,20]"
            :page-size="listQuery1.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import waves from "@/directive/waves";
import { createCustomerAgent } from "@/api/agent";
import {
  getCustomerShopList,
  changeCustomerShopStatus,
  findCustomerShop,
  updateCustomerShop,
  updateCustomerPid,
  createCustomerGoldRecord,
  updateCustomerPidTop
} from "@/api/customer";
import { getShopDistributionLevelRecordList } from "../../api/distribution";
import { getShopDistributionLevelList } from "../../api/setting";
import { updateAfterSaleOperation } from "@/api/aftersale";
export default {
  name: "customerList",
  directives: {
    waves
  },
  data() {
    return {
      status: 2,
      temps: {
        password: undefined,
        status: undefined
      },
      dialogVisiblesl: false,
      commentOptions: [
        //状态
        { key: 1, label: "待审核" },
        { key: 2, label: "正常" },
        { key: 3, label: "封禁" }
      ],
      opionsl: [
        { key: 1, label: "金贝" },
        { key: 2, label: "银贝" }
      ],
      dataList: [
        { value: "add", label: "增加" },
        { value: "sub", label: "减少" }
      ],
      datas: {
        customer_id: undefined,
        type: undefined,
        type_attr: undefined,
        number: undefined
      },
      customer_ids: undefined,
      dialogPids: false,
      tableKey: 0,
      btnLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        date_range: [],
        user_nickname: undefined,
        phone: undefined,
        distribution_level_id: undefined
      },
      listQuery1: {
        page: 1,
        page_size: 5,
        shop_customer_account_id: undefined
      },
      shop_customer_account_id: undefined,
      list: null,
      total: null,
      listLoading: false,
      tableKey1: 0,
      list1: null,
      total1: null,
      listLoading1: false,
      temp: {
        phone: undefined,
        member_level_id: undefined,
        distribution_level_id: undefined,
        is_active: "0",
        is_distribution: "0"
      },
      levelOptions: [],
      levelLoading: false,
      vipOptions: [],
      vipLoading: false,
      pidOptions: [],
      pidLoading: false,
      dialogStatus: "",
      pickerOptions2: {},
      activeOptions: [
        { key: 0, label: "冻结" },
        { key: 1, label: "开启" }
      ],
      dialogCustomer: false,
      rule: {
        //phone: [{ required: true, message: '请正确填写手机号', trigger: 'change' }]
      },
      dialogVip: false,
      dialogPid: false,
      rule1: {
        pid: [{ required: true, message: "请选择上级", trigger: "change" }]
      },
      temp1: {
        pid: undefined
      },
      json_fields: {}
    };
  },
  created() {
    this.getList();
    //this.handlelevelList(' ')
    this.handlevipList(" ");
    //this.handlepidList(' ')
  },
  methods: {
    // 修改贝壳
    updatas(row) {
      this.dialogPids = true;
      (this.datas = {
        type: undefined,
        type_attr: undefined,
        number: undefined
      }),
        (this.datas.customer_id = row.customer_id);
    },
    updatePidDob() {
      createCustomerGoldRecord(this.datas).then(res => {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
        this.dialogPids = false;
        this.getList();
      });
    },
    //添加
    creaters(row) {
      this.dialogVisiblesl = true;
      findCustomerShop({ customer_id: row.customer_id }).then(response => {
        this.temps = response.data;
      });
      this.status = 2;
      this.temps.password = undefined;
    },
    //添加确定
    createdatas() {
      this.temps.status = this.status;
      createCustomerAgent(this.temps).then(res => {
        this.$notify({
          title: "成功",
          message: "添加成功",
          type: "success",
          duration: 2000
        });
        this.dialogVisiblesl = false;
      });
    },
    //修改上级
    updataRoos() {
        this.$confirm("您确定进行修改吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            updateCustomerPidTop({ customer_id: this.customer_ids }).then(
              res => {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
                this.dialogPid = false;
                this.getList();
              }
            );
          })
          .catch(() => {
            this.dialogPid = false;
            this.$message({
              type: "info",
              message: "已取消修改"
            });
          });
    },
    getList() {
      this.listLoading = true;
      getCustomerShopList(this.listQuery).then(response => {
        this.list = response.data.data;
        console.log(this.list);
        for (const v in this.list) {
          this.json_fields.ID = "customer_id";
          this.json_fields.客户 = "user_nickname";
          this.json_fields.客户电话 = "phone";
          this.json_fields.分销等级 = "distribution_level_name";
          this.json_fields.金贝余额 = "balance_gold";
          this.json_fields.银贝余额 = "balance_silver";
          this.json_fields.冻结金额 = "profit_frozen";
          this.json_fields.佣金 = "balance";
          this.json_fields.可提现佣金 = "profit_all";
          this.json_fields.已提现佣金 = "withdraw_money";
          this.json_fields.团队人数 = "team_number";
          this.json_fields.上级 = "parentinfo";
          this.json_fields.创建时间 = "created_at";
        }
        this.total = response.data.total;
        this.tableKey++;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    update(row) {
      this.customer_id = row.customer_id;
      this.dialogCustomer = true;
      findCustomerShop({ customer_id: row.customer_id }).then(response => {
        this.temp = response.data;
        //this.temp.shop_member_level_before = response.data.member_level_id
        this.$nextTick(() => {
          this.$refs["dateForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dateForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.customer_id = this.customer_id;
          console.log(tempData.customer_id);
          updateCustomerShop(tempData).then(response => {
            this.getList();
            this.dialogCustomer = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    getList1() {
      this.listLoading1 = true;
      getShopDistributionLevelRecordList(this.listQuery1).then(response => {
        this.list1 = response.data.data;
        this.total1 = response.data.total;
        this.tableKey1++;
        this.listLoading1 = false;
      });
    },
    // 升级日志
    upgrade(row) {
      this.listQuery1.customer_id = row.customer_id;
      this.dialogVip = true;
      this.getList1();
      getShopDistributionLevelRecordList(this.listQuery1).then(response => {
        this.list1 = response.data.data;
      });
    },
    // 修改上级
    updatePid(row) {
      this.dialogPid = true;
      this.customer_id = row.customer_id;
      this.customer_ids = row.customer_id;
      this.resetemp();
      this.$nextTick(() => {
        this.$refs["dateForm1"].clearValidate();
      });
    },

    updatePidDo() {
      this.$refs["dateForm1"].validate(valid => {
        if (valid) {
          this.$confirm("您确定进行修改吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              const ttempData = {
                customer_id: this.customer_id,
                pid: this.temp1.pid
              };
              updateCustomerPid(ttempData).then(response => {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
                this.dialogPid = false;
                this.getList();
                // this.handleUpdateShopGoodsDetail(this.price1)
              });
            })
            .catch(() => {
              this.dialogPid = false;
              this.$message({
                type: "info",
                message: "已取消修改"
              });
            });
        }
      });
    },
    resetemp() {
      this.temp1 = {
        pid: undefined
      };
    },
    handletypeList() {},
    // 获取会员等级
    handlelevelList(query) {
      if (query !== "") {
        this.levelLoading = true;
        getShopMemberLevelList({
          member_level_name: query,
          page_size: 10
        }).then(response => {
          this.levelOptions = response.data.data;
          this.levelLoading = false;
        });
      }
    },
    // 获取分销等级
    handlevipList(query) {
      if (query !== "") {
        this.vipLoading = true;
        getShopDistributionLevelList({
          distribution_level_name: query,
          page_size: 10,
          status: 1
        }).then(response => {
          this.vipOptions = response.data.data;
          this.vipLoading = false;
        });
      }
    },

    handlepidList(query) {
      if (query !== "") {
        this.pidLoading = true;
        getCustomerShopList({ phone: query, page_size: 5, status: 1 }).then(
          response => {
            this.pidOptions = response.data.data;
            this.pidLoading = false;
          }
        );
      }
    },
    handleSwitch(row) {
      changeCustomerShopStatus({
        customer_id: row.customer_id,
        is_active: row.is_active
      }).then(res => {
        this.$message.success("修改成功");
      });
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange1(val) {
      this.listQuery1.page_size = val;
      this.getList1();
    },
    handleCurrentChange1(val) {
      this.listQuery1.page = val;
      this.getList1();
    }
  }
};
</script>

<style scoped>
</style>
