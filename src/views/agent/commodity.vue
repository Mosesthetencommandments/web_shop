<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索 | 添加 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
    </div>
    <!-- 代理商品列表 -->
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
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.goods_image" style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品规格">
        <template slot-scope="scope">
          <span>{{scope.row.goods_specs}}</span>
        </template>
      </el-table-column>
        <el-table-column align="center" label="商品状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | groupFuncTranslators}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="undercarriage(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      <!-- <el-table-column align="center" label="商品库存">
        <template slot-scope="scope">{{scope.row.stock}}</template>
      </el-table-column>-->
      <el-table-column prop="operation" label="操作" align="center" class="className">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updata(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="updatas(scope.row)">修改价格</el-button>
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
    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="dialogVisibles" width="30%" @close="createls">
      <el-form :model="temp" label-position="left" style="width: 90%; margin-left:5%;">
        <el-form-item label="商品名称 :">
          <el-input placeholder="请输入商品名称" style="width: 400px" v-model="temp.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品图片 :">
          <el-upload
            :action="baseUrl"
            v-model="temp.goods_image"
            name="image"
            :file-list="fileLists"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleExceed1"
            :on-remove="handleRemoves"
            :before-upload="beforeAvatarUploads"
            :on-success="handleUpsl"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="margin-left:73px">只能上传jpg/png文件,图片大小不能超过１M</span>
        </el-form-item>
        <el-form-item label="商品规格 :">
          <el-input placeholder="请输入商品规格" style="width: 400px" v-model="temp.goods_specs"></el-input>
        </el-form-item>
        <el-form-item label="商品价格 :">
          <el-input placeholder="请输入商品价格" style="width: 400px" v-model="temp.actual_price"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品库存 :">
          <el-input placeholder="请输入商品库存" style="width: 400px" v-model="temp.stock"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="createdata">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="dialogVisiblesl" width="30%">
      <el-form :model="temps" label-position="left" style="width: 90%; margin-left:5%;">
        <el-form-item label="商品名称 :">
          <el-input placeholder="请输入商品名称" style="width: 400px" v-model="temps.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品图片 :">
          <el-upload
            :action="baseUrl"
            v-model="temps.goods_image"
            name="image"
            :file-list="fileListsl"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleExceed1"
            :on-remove="handleRemoves"
            :before-upload="beforeAvatarUploads"
            :on-success="handleUps"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="margin-left:73px">只能上传jpg/png文件,图片大小不能超过１M</span>
        </el-form-item>
        <el-form-item label="商品规格 :">
          <el-input placeholder="请输入商品规格" style="width: 400px" v-model="temps.goods_specs"></el-input>
        </el-form-item>
        <el-form-item label="商品价格 :">
          <el-input placeholder="请输入商品价格" style="width: 400px" v-model="temps.actual_price"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品库存 :">
          <el-input placeholder="请输入商品库存" style="width: 400px" v-model="temps.stock"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblesl = false">取 消</el-button>
        <el-button type="primary" @click="updataList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 商品价格 -->
    <el-dialog :visible.sync="dialogDistributionRuleVisiable" width="40%">
      <el-form
        ref="innerDataForm4"
        :model="distributionRuleList"
        label-position="left"
        label-width="15%"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="商品-价格">
          <el-row :gutter="50" style="margin-bottom: 5px;clear: both;">
            <el-col :span="8">等级</el-col>
            <el-col :span="8">商品价格</el-col>
          </el-row>
          <el-row
            :gutter="50"
            v-for="item in distributionRuleList"
            :key="item.id"
            style="margin-bottom: 5px;clear: both;"
          >
            <el-col :span="8">
              <el-input v-model="item.agent_name" disabled="disabled"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="item.grade_price"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDistributionRuleVisiable = false">取 消</el-button>
        <el-button type="primary" @click="updateDistributionRule">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  createAgentGoods,
  getAgentGoodsList,
  updateAgentGoods,
  findAgentGoodsInfo,
  getAgentGoodsGradePriceInfo,
  dismountAgentGoods
} from "@/api/agent";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "commodity",
  directives: {
    waves
  },
  data() {
    return {
      baseUrl: process.env.BASE_API + "/api/document/uploadImage", //上传图片请求地址
      fileLists: [], //添加回显图片
      fileListsl: [],//修改回显图片
      temps: {}, //修改对象
      goods_id: undefined, //重新赋值使用
      dialogDistributionRuleVisiable:false,
      distributionRuleList:[],
      temp: {
        //添加数组
        goods_name: undefined,
        goods_image: undefined,
        goods_specs: undefined,
        actual_price: undefined,
        stock: undefined
      },
      listQuery: {
        //请求列表
        page: 1,
        page_size: 10
      },
      dialogVisiblesl: false, //修改弹窗
      dialogVisibles: false, //添加弹窗
      list: [], //列表数组
      total: 0,//列表total
      datas:[],
      grade_price:[],
      goods_ids:'',
      ids:'',
      multipleSelection:[]
    };
  },
  filters: {
    groupFuncTranslator(func) {
      const statusMap = {
        1: "待审核",
        2: "正常",
        3: "封禁"
      };
      return statusMap[func];
    },
    groupFuncTranslators(func) {
      const statusMap = {
        1: "正常",
        2: "已下架",
      };
      return statusMap[func];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //添加弹窗关闭回调函数
    createls() {
      this.temp = {
        goods_name: undefined,
        goods_specs: undefined,
        actual_price: undefined,
        stock: undefined
      };
      this.fileLists = [];
    },
    //添加
    create() {
      this.dialogVisibles = true;
    },
    //图片超出限制
    handleExceed1() {
      this.$message.error("主图限制上传一张");
    },
    //图片移除钩子函数
    handleRemoves(file, fileList) {},
    //图片上传前钩子函数
    beforeAvatarUploads(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //创建图片上传成功获取地址
    handleUpsl(response, file, fileList) {
      this.temp.goods_image = response.data.url;
    },
    //修改图片上传成功获取地址
    handleUps(response, file, fileList) {
      this.temps.goods_image = response.data.url;
    },
    undercarriage(row){
        dismountAgentGoods({goods_id:row.id,status:row.status}).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
           this.getList();
        })
       },

    //添加成功
    createdata() {
      if (
        this.temp.goods_name &&
        this.temp.goods_specs &&
        this.temp.goods_image &&
        this.temp.actual_price !== ""
      ) {
        createAgentGoods(this.temp).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            this.dialogVisibles = false;
            this.getList();
          }
        });
      }else{
        this.$message.error('请完善商品信息')
      }
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      getAgentGoodsList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    //查看商品价格信息详情
    updatas(row) {
      this.dialogDistributionRuleVisiable = true
      this.datas = []
      this.goods_ids = row.id
      const tempQuery = {};
      tempQuery.goods_id = row.id;
       getAgentGoodsGradePriceInfo(tempQuery).then(response => {
         this.distributionRuleList = response.data;
         this.distributionRuleList.map(v=> {
            for(const key in v.grade_price) {
               v.grade_price=v.grade_price[key]
            }
        });
      });
    },
    // 查看商品价格详情确定
    updateDistributionRule(){
        this.distributionRuleList.map(v=>{
            let obj = {}
            obj[v.id]=parseFloat(v.grade_price)
            this.datas.push(obj)
        })
        updateAgentGoods({grade_price:this.datas,goods_id:this.goods_ids}).then(res=>{
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        })
        this.dialogDistributionRuleVisiable = false
        this.getList();
    },
    //查看详情
    updata(row) {
      this.goods_id = row.id;
      this.dialogVisiblesl = true;
      findAgentGoodsInfo({
        goods_id: row.id
      }).then(res => {
        this.temps = res.data;
        this.fileListsl = [
          {
            url: row.goods_image
          }
        ];
      });
    },
    //修改
    updataList() {
      this.temps.goods_id = this.goods_id;
      updateAgentGoods(this.temps).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
          this.dialogVisiblesl = false;
          this.getList()
        }
      });
    },
    //搜索
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
    }
  }
};
</script>
