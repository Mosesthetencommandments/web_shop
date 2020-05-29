<template>
  <div class="app-container calendar-list-container">
    <!-- 添加 -->
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
      >添加</el-button>
    </div>
    <!-- 免费领会员列表 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
     <el-table-column label="简介" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.introduce}}</span>
        </template>
      </el-table-column>
       <el-table-column label="持续时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.duration}}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始次数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.initial_number}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="originalPrice" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag class="link-type">{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="备注" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" align="center" min-width="130px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="fistlist(scope.row)">会员用户</el-button>
          <el-button type="success" size="mini" @click="updatalist(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deletelist(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 免费领会员列表分页 -->
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
    <!-- 添加弹窗 -->
    <el-dialog title="创建" :visible.sync="dialogVisible" width="30%" @close="handgoods">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称 :">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="简介 :">
          <el-input v-model="temp.introduce"></el-input>
        </el-form-item>
        <el-form-item label="备注 :">
          <el-input v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="所属分类 :">
           <el-select v-model="temp.shop_goods_group_ids" style="width:320px" placeholder="请选择">
              <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.group_name"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="初始次数 :">
          <el-input-number v-model="temp.initial_number" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="持续时间 :">
          <el-input-number v-model="temp.duration" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="试用次数 :">
          <el-input-number v-model="temp.try_number" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="试用期限 :">
          <el-input-number v-model="temp.try_term" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态 :" size="medium">
          <el-radio-group v-model="temp.status">
            <el-radio-button label="0">禁用</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createdata">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="dialogVisiblels" width="30%" @close="handgoods">
      <el-form
        ref="dataForm"
        :model="temps"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称 :">
          <el-input v-model="temps.name"></el-input>
        </el-form-item>
        <el-form-item label="简介 :">
          <el-input v-model="temps.introduce"></el-input>
        </el-form-item>
        <el-form-item label="备注 :">
          <el-input v-model="temps.remark"></el-input>
        </el-form-item>
        <el-form-item label="所属分类 :">
           <el-select v-model="temps.shop_goods_group_ids" style="width:320px" placeholder="请选择" >
              <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.group_name"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="初始次数 :">
          <el-input-number v-model="temps.initial_number" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="持续时间 :">
          <el-input-number v-model="temps.duration" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="试用次数 :">
          <el-input-number v-model="temps.try_number" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="试用期限 :">
          <el-input-number v-model="temps.try_term" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态 :" size="medium">
          <el-radio-group v-model="temps.status">
            <el-radio-button label="0">禁用</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblels=false">取 消</el-button>
        <el-button type="primary" @click="updata">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 会员用户列表 -->
    <el-dialog :visible.sync="dialogVisibles" width="70%" >
      <el-table :data="firstList" border style="width: 100%">
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
        <el-table-column label="会员ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.member_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.customer_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用次数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.use_number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.start_time}}</span>
        </template>
      </el-table-column>
       <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="originalPrice" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag class="link-type">{{scope.row.status | statusFilters}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column prop="price" label="操作" align="center" min-width="130px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updatafist(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deletelists(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 会员用户修改 -->
    <el-dialog
      width="30%"
      title="修改"
      :visible.sync="innerVisible"
      append-to-body>
        <el-form
        ref="dataForm"
        :model="tempsl"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="使用次数 :">
           <el-input-number v-model="tempsl.use_number"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible=false">取 消</el-button>
        <el-button type="primary" @click="updatatempsl">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 会员用户列表分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery1.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery1.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      ></el-pagination>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShopGoodsMemberInfoList,
  createShopGoodsMemberInfo,
  getShopGoodsGroupList,
  getShopGoodsCategoryTree,
  deleteShopGoodsMemberInfo,
  getShopGoodsMemberCustomerList,
  findShopGoodsMemberInfo,
  updateShopGoodsMemberInfo,
  deleteShopGoodsMemberCustomer,
  findShopGoodsMemberCustomer,
  updateShopGoodsMemberCustomer
} from "@/api/goods";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "communityPosters",
  directives: {
    waves
  },
  data() {
    return {
      innerVisible:false, //会员用户列表修改弹窗
      data:[],    //存储数据并赋值调用刷新页面使用
      total: 0, //会员信息total
      total1:0,  //会员用户列表total
      dataList: [], //会员信息列表
      firstList:[], //会员用户列表
      dialogVisibles:false,   //会员列表弹窗
      dialogVisible: false,  //添加弹窗
      dialogVisiblels:false, //修改弹窗
      classOptions: [],     //分类数据
      listQuery: {    // //会员信息
        page: 1,
        page_size: 10
      },
      listQuery1: { //会员列表
        page: 1,
        page_size: 10,
        member_id:undefined

      },
      tempsl:{},//会员用户列表查看详情和修改对象
      temp: {   //添加时所传参数
        name: null,
        introduce: null,
        remark: undefined,
        shop_goods_group_ids: '',
        initial_number: 0,
        duration: 0,
        status: 1,
        try_number: 0,
        try_term: 0
      },
      temps:{//会员列表查看详情和修改对象
        name: null,
        introduce: null,
        remark: undefined,
        shop_goods_group_ids: [],
        initial_number: 0,
        duration: 0,
        status: 1,
        try_number: 0,
        try_term: 0
      }
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
         0:'禁用',
         1:'开启'
      };
      return statusMap[status];
    },
    statusFilters(status) {
      const statusMap = {
         0:'到期',
         1:'会员',
         2:'体验',
      };
      return statusMap[status];
    }
  },
  created() {
    this.getdatalist()
    this.handleChange();
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getdatalist();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getdatalist();
    },
    // 商品属性下所有分类
    handleChange() {
      getShopGoodsGroupList().then(res => {
        this.classOptions = res.data;
      });
    },
    // 会员信息列表
    getdatalist() {
      getShopGoodsMemberInfoList(this.listQuery).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.total;
      });
    },
    // 添加按钮
    handleCreate() {
      this.dialogVisible = true;
    },
    // 添加确定按钮
    createdata(){
         createShopGoodsMemberInfo(this.temp).then(res=>{
             this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
             this.getdatalist()
             this.dialogVisible = false
         })
    },
    // 会员信息列表删除
    deletelist(row){
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteShopGoodsMemberInfo({
            id:row.id,
          }).then(res => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.getdatalist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 会员用户列表
    fistlist(row) {
      this.data = row
      this.listQuery1.member_id = row.id
      this.dialogVisibles = true
      getShopGoodsMemberCustomerList(this.listQuery1).then(res => {
        this.firstList = res.data.data
        this.total1 = res.data.total
      });
    },
    // 添加弹窗关闭时的回调函数
    handgoods(){
       this.temp = {
        name: null,
        introduce: null,
        remark: undefined,
        shop_goods_group_ids: '',
        initial_number: 0,
        duration: 0,
        status: 1,
        try_number: 0,
        try_term: 0
       }
    },
    // 修改按钮获取详情
    updatalist(row){
      this.dialogVisiblels = true
      findShopGoodsMemberInfo({id:row.id}).then(res=>{
      this.temps = res.data
      this.classOptions.map(item=>{
      if(this.temps.shop_goods_group_ids == item.id){
           this.temps.shop_goods_group_ids = item.group_name
        }
      })
      })
    },
    //修改
    updata(){
      updateShopGoodsMemberInfo(this.temps).then(res=>{
          this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
             this.getdatalist()
             this.dialogVisiblels = false
      })
    },
    // 会员用户列表删除
    deletelists(row){
       this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteShopGoodsMemberCustomer({
            id:row.id,
          }).then(res => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.fistlist(this.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 会员用户列表查看详情
    updatafist(row){
      this.innerVisible = true
       findShopGoodsMemberCustomer({id:row.id}).then(res=>{
           this.tempsl = res.data
       })
    },
     // 会员用户列表修改
    updatatempsl(){
      updateShopGoodsMemberCustomer(this.tempsl).then(res=>{
          this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
          })
          this.fistlist(this.data)
          this.innerVisible = false
      })
    }
  }
};
</script>
