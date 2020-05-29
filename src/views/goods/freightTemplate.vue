<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item filter-float">
        <el-button style="float:right;" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button style="float:right;" type="primary" v-waves @click="create">添加</el-button>
      </div>
      <div style="clear:both;"></div>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      stripe
      fit
      highlight-current-row
      border
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column label="ID" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="template_name" label="模板名称" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.template_name}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="remark" label="备注" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否记件" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag type="danger" size="normal">{{scope.row.charge_item | chargeItem}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="base_price" label="首重价格" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.base_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="continue_price" label="续重价格" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.continue_price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否满减" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag type="danger" size="normal">{{scope.row.is_free | isFree}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="free_condition" label="满减条件" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.free_condition}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="update(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delete1(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialogTemplate" @close="handcraetes">
      <el-form
        :rules="rule"
        ref="dateForm"
        :model="temp"
        label-position="left"
        label-width="20%"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="模板名称" label-width="20%" prop="template_name">
          <el-input type="text" v-model="temp.template_name"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="20%" prop="remark">
          <el-input  type="text" v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="首重价格" label-width="20%" prop="base_price">
          <el-input type="number" v-model="temp.base_price"></el-input>
        </el-form-item>
        <el-form-item label="续重价格" label-width="20%" prop="continue_price">
          <el-input type="number" v-model="temp.continue_price"></el-input>
        </el-form-item>
        <el-form-item label="满减条件" label-width="20%" prop="free_condition">
          <el-input type="number" min="1" v-model="temp.free_condition"></el-input>
        </el-form-item>
        <el-form-item label="模版地区选择" prop="province">
          <span class="link-type" @click="moban">请选择模版地区</span>
        </el-form-item>
        <el-form-item label="是否满减" label-width="20%">
          <el-radio-group v-model="temp.is_free" size="small">
            <el-radio-button label="1">满减包邮</el-radio-button>
            <el-radio-button label="0">不包邮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否按件计费" label-width="20%">
          <el-radio-group v-model="temp.charge_item" size="small">
            <el-radio-button label="1">按件计费</el-radio-button>
            <el-radio-button label="0">按重计费</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTemplate = false">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          :loading="btnLoading"
          type="primary"
          @click="createData"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="模版地区" :visible.sync="dialogTableVisiblesl" @close="handels">
      <el-table :data="area_set">
        <el-table-column property="date" label="地区" width="300">
          <template slot-scope="scope">
             <!-- <el-select v-if="scope.row.name"  v-model="scope.row.name" placeholder="请选择">
              <el-option
                v-for="item in regionData"
                :key="item.area_number"
                :label="item.area_name"
                :value="item.area_number"
              ></el-option>
            </el-select> -->
             <el-select v-model="scope.row.province" placeholder="请选择">
              <el-option
                v-for="item in regionData"
                :key="item.area_number"
                :label="item.area_name"
                :value="item.area_number"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="name" label="首重" width="200">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.base_price"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="address" label="续重">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.continue_price"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDatas">添加</el-button>
        <el-button @click="quxiao">取 消</el-button>
        <el-button @click="queding">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFreightTemplateList,
  getFreightTemplateInfo,
  updateFreightTemplate,
  createFreightTemplate,
  deleteFreightTemplate
} from "@/api/freight";
import waves from "@/directive/waves"; // 水波纹指令
import { getOrdersAreaList } from "@/api/goods";
export default {
  name: "freightTemplate",
  directives: {
    waves
  },
  data() {
    return {
      show:true,
      provinces: [],
      dialogTableVisiblesl: false,
      fileList: [],
      listQuery: {
        page: 1,
        page_size: 10
      },
      array: [],
      arr: "",
      regionData: [],
      tableKey: 0,
      list: [],
      total: null,
      listLoading: false,
      dialogTemplate: false,
      dialogStatus: "",
      rule: {
        template_name: [
          { required: true, message: "请正确填写模板名称", trigger: "change" }
        ],
        remark: [
          { required: true, message: "请正确填写备注", trigger: "change" }
        ],
        base_price: [
          {
            required: true,
            min: 0,
            message: "请正确填写首重价格",
            trigger: "change"
          }
        ],
        continue_price: [
          {
            required: true,
            min: 0,
            message: "请正确填写续重价格",
            trigger: "change"
          }
        ],
        free_condition: [
          {
            required: true,
            min: 0,
            message: "请正确填写满减条件",
            trigger: "change"
          }
        ],
        is_free: [
          { required: true, message: "请选择是否满减", trigger: "change" }
        ],
        charge_item: [
          { required: true, message: "请选择记件方式", trigger: "change" }
        ]
      },
      area_set: [
        {
          base_price: "",
          continue_price: "",
          province: [],
        // type :1,
          // type :2,
        }
      ],
      temp: {
        template_name: undefined,
        charge_item: undefined,
        is_free: undefined,
        base_price: undefined,
        continue_price: undefined,
        free_condition: undefined,
        remark:undefined
      },
      btnLoading: false,
      textMap: {
        create: "创建",
        update: "编辑"
      }
    };
  },
  filters: {
    chargeItem(charge_item) {
      const option = {
        1: "按件计费",
        0: "重量计费"
      };
      return option[charge_item];
    },
    isFree(is_free) {
      const option = {
        1: "满减包邮",
        0: "不包邮"
      };
      return option[is_free];
    }
  },
  created() {
    this.getList();
    this.getregionData();
  },
  methods: {
    handcraetes() {
      this.area_set = [];
    },
    quxiao() {
      // this.area_set = [];
      this.dialogTableVisiblesl = false;
    },
    queding() {
      this.dialogTableVisiblesl = false;
    },
    updateDatas() {
      this.area_set.push({ base_price: null, continue_price: null,province:[] });
    },
    moban() {
      this.dialogTableVisiblesl = true;
    },
    handleRegionChange(value) {
      this.array = value;
    },

    getregionData() {
      getOrdersAreaList().then(response => {
        // response.map(i=>{
        //      delete response.data[i].children
        // })

        this.regionData = response.data;
        console.log(this.regionData,"地区列表");
      });
    },
    getList() {
      this.listLoading = true;
      getFreightTemplateList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.tableKey++;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    create() {
      this.show = true
      this.dialogStatus = "create";
      this.dialogTemplate = true;
      this.createTemplate();
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["dateForm"].clearValidate();
        console.log(this.$refs);
      });
    },
    // 创建确定
    createData() {
      this.$refs["dateForm"].validate(valid => {
        if (valid) {
          this.temp.area_set = this.area_set;
          this.btnLoading = true;
          createFreightTemplate(this.temp)
            .then(response => {
              console.log(response, 999999999999999);
              this.area_set = response.data.area_set;
              console.log(this.area_set, 888888888);
              this.getList();
              this.dialogTemplate = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.btnLoading = false;
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    },
    delete1(row) {
      this.$confirm("此操作将永久删除邮费模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const deleteData = {
            id: row.id
          };
          deleteFreightTemplate(deleteData).then(response => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    update(row) {
      this.dialogStatus = "update";
      this.dialogTemplate = true;
      this.id = row.id;
      this.show = false
      getFreightTemplateInfo({ id: row.id }).then(response => {
        this.area_set = response.data.area_set
        this.temp = response.data;
        this.temp.area_set =  this.area_set
        this.temp.area_set.map(item=>{
            if(item.province == "110000"){
               item.province = '北京市'
            }else if(item.province == "120000"){
               item.province = '天津市'
            }else if(item.province == "130000"){
               item.province = '河北省'
            }
            else if(item.province == "140000"){
               item.province = '山西省'
            }
            else if(item.province == "150000"){
               item.province = '内蒙古自治区'
            }
            else if(item.province == "210000"){
               item.province = '辽宁省'
            }
            else if(item.province == "220000"){
               item.province = '吉林省'
            }
            else if(item.province == "230000"){
               item.province = '黑龙江省'
            }
            else if(item.province == "310000"){
               item.province = '上海市'
            }
            else if(item.province == "320000"){
               item.province = '江苏省'
            }
            else if(item.province == "330000"){
               item.province = '浙江省'
            }
            else if(item.province == "340000"){
               item.province = '安徽省'
            }
            else if(item.province == "350000"){
               item.province = '福建省'
            }else if(item.province == "360000"){
               item.province = '江西省'
            }
            else if(item.province == "370000"){
               item.province = '山东省'
            }
            else if(item.province == "410000"){
               item.province = '河南省'
            }
            else if(item.province == "420000"){
               item.province = '湖北省'
            }
            else if(item.province == "430000"){
               item.province = '湖南省'
            }else if(item.province == "440000"){
               item.province = '广东省'
            }
            else if(item.province == "450000"){
               item.province = '广西壮族自治区'
            }
            else if(item.province == "460000"){
               item.province = '海南省'
            }
            else if(item.province == "500000"){
               item.province = '重庆市'
            }
             else if(item.province == "510000"){
               item.province = '四川省'
            }else if(item.province == "520000"){
               item.province = '贵州省'
            }
            else if(item.province == "530000"){
               item.province = '云南省'
            }
            else if(item.province == "540000"){
               item.province = '西藏自治区'
            }
            else if(item.province == "610000"){
               item.province = '陕西省'
            }
              else if(item.province == "620000"){
               item.province = '甘肃省'
            }else if(item.province == "630000"){
               item.province = '青海省'
            }
            else if(item.province == "640000"){
               item.province = '宁夏回族自治区'
            }
            else if(item.province == "650000"){
               item.province = '新疆维吾尔自治区'
            }
            else if(item.province == "710000"){
               item.province = '台湾省'
            }
            else if(item.province == "810000"){
               item.province = '香港特别行政区'
            }
            else if(item.province == "820000"){
               item.province = '澳门特别行政区'
            }



        })
        console.log(this.temp, "点击编辑按钮返回的数据");
        this.fileList = [
          {
            url: row.img_url
          }
        ];
        this.dialogTemplate = true;
        this.$nextTick(() => {
          this.$refs["dateForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dateForm"].validate(valid => {
        if (valid) {
      this.temp.area_set = this.area_set
            this.temp.area_set.map(item=>{
            if(item.province == "北京市"){
               item.province = '110000'
            }else if(item.province == "天津市"){
               item.province = '120000'
            }else if(item.province == "河北省"){
               item.province = '130000'
            }
            else if(item.province == "山西省"){
               item.province = '140000'
            }
            else if(item.province == "内蒙古自治区"){
               item.province = '150000'
            }
            else if(item.province == "辽宁省"){
               item.province = '210000'
            }
            else if(item.province == "吉林省"){
               item.province = '220000'
            }
            else if(item.province == "黑龙江省"){
               item.province = '230000'
            }
            else if(item.province == "上海市"){
               item.province = '310000'
            }
            else if(item.province == "江苏省"){
               item.province = '320000'
            }
            else if(item.province == "浙江省"){
               item.province = '330000'
            }
            else if(item.province == "安徽省"){
               item.province = '340000'
            }
            else if(item.province == "福建省"){
               item.province = '350000'
            }else if(item.province == "江西省"){
               item.province = '360000'
            }
            else if(item.province == "山东省"){
               item.province = '370000'
            }
            else if(item.province == "河南省"){
               item.province = '410000'
            }
            else if(item.province == "湖北省"){
               item.province = '420000'
            }
            else if(item.province == "湖南省"){
               item.province = '430000'
            }else if(item.province == "广东省"){
               item.province = '440000'
            }
            else if(item.province == "广西壮族自治区"){
               item.province = '450000'
            }
            else if(item.province == "海南省"){
               item.province = '460000'
            }
            else if(item.province == "重庆市"){
               item.province = '500000'
            }
             else if(item.province == "四川省"){
               item.province = '510000'
            }else if(item.province == "贵州省"){
               item.province = '520000'
            }
            else if(item.province == "云南省"){
               item.province = '530000'
            }
            else if(item.province == "西藏自治区"){
               item.province = '540000'
            }
            else if(item.province == "陕西省"){
               item.province = '610000'
            }
              else if(item.province == "甘肃省"){
               item.province = '620000'
            }else if(item.province == "青海省"){
               item.province = '630000'
            }
            else if(item.province == "宁夏回族自治区"){
               item.province = '640000'
            }
            else if(item.province == "新疆维吾尔自治区"){
               item.province = '650000'
            }
            else if(item.province == "台湾省"){
               item.province = '710000'
            }
            else if(item.province == "香港特别行政区"){
               item.province = '810000'
            }
            else if(item.province == "820000"){
               item.province = '820000'
            }

      })
      console.log(this.temp.area_set,333333333)
          const tempData = Object.assign({}, this.temp);
          tempData.id = this.id;
          updateFreightTemplate(tempData).then(response => {
            this.getList();
            this.dialogTemplate = false;
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
    createTemplate() {
      this.temp = {
        template_name: undefined,
        charge_item: 1,
        base_price: undefined,
        continue_price: undefined,
        is_free: 1,
        free_condition: undefined
      };
    },
    // 分页
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

<style scoped>
</style>
