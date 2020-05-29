<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.status"
                 placeholder="开启">
        <el-option v-for="item in levelOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <div class="filter-float">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <template>
      <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%;margin-top: 10px;" border stripe highlight-current-row fit>
        <el-table-column label="ID" min-width="66" align="center">
          <template slot-scope ="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级名称" min-width="350" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.distribution_level_name}}</span>
            <el-tag size="mini" type="primary" v-if="scope.row.is_default_level == 1">默认等级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分销名称" min-width="350" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.agent_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否属于代理" min-width="350" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.is_agent | groupFuncTranslator }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column min-width="150" align="center" label="直接粉丝首单返佣">
          <template slot-scope="scope">
            <span>{{scope.row.first_orders_return_money_ratio}}</span>
          </template>
        </el-table-column>-->
        <el-table-column min-width="300" align="center" label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" align="center" label="开启状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center" min-width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="update(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-news" @click="find(scope.row)"></el-button>
            <!--<el-button type="danger" icon="el-icon-delete" @click="delete(scope.row)"></el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!--图片上传预览-->
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <!--创建编辑弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogLevel" >
        <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%;margin-left:20%;'>
          <el-form-item label="等级名称" label-width="20%" prop="distribution_level_name">
            <div class="basicMessage">基本信息</div>
            <el-input v-model="temp.distribution_level_name"></el-input>
          </el-form-item>
          <el-form-item label="分销名称" label-width="20%" prop="distribution_level_name">
            <div class="basicMessage">基本信息</div>
            <el-input v-model="temp.agent_name"></el-input>
          </el-form-item>
          <el-form-item label="等级图标" prop="distribution_level_img">
            <el-upload
              :action="baseUrl"
              name="image"
              :file-list="fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handleUp"
              multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过１M</span>
          </el-form-item>
          <!--<el-form-item label="等级奖励" label-width="20%" prop="level_reward_ratio">
            <el-input v-model="temp.level_reward_ratio" style="width: 94%;margin-right: 10px;"></el-input>%
          </el-form-item>
          <el-form-item label="首单返佣比例" label-width="20%" prop="first_orders_return_money_ratio">
            <el-input v-model="temp.first_orders_return_money_ratio"></el-input>
            <span style="font-size: 10px;color: #000;">以下划线分割,例如10|p-5|y-3|p,p代表按照订单百分比分成,y代表分成固定金额人民币</span>
          </el-form-item>
          <el-form-item label="逐级返佣比例" label-width="20%" prop="return_money_ratio">
            <el-input v-model="temp.return_money_ratio"></el-input>
            <span style="font-size: 10px;color: #000;">以下划线分割,例如10|p-5|y-3|p,personal_distribution_level_key,y代表分成固定金额人民币</span>
          </el-form-item>-->
          <el-form-item label="排序" label-width="20%" prop="sort">
            <el-input v-model="temp.sort"></el-input>
          </el-form-item>
           <el-form-item label="是否属于代理" label-width="20%">
            <el-radio-group v-model="is_agent" size="small">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" label-width="20%">
            <el-radio-group v-model="temp.status" size="small">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="2">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="是否默认等级" label-width="20%">
            <el-radio-group v-model="temp.is_default_level" size="small">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>-->
          <!--升级条件-->
          <el-form-item >
          <div class="basicMessage" style="width:20%;float:left;">升级条件</div>
          </el-form-item>
          <div style="border:1px solid #CFCFCF;padding:10px;" v-model="temp.uprule" v-for="(item, index) in temp.uprule">
            <el-form-item label="直接粉丝人数" label-width="20%" prop="personal_distribution_level">
              <el-select v-model="item.personal_distribution_level_key"
                         filterable
                         remote
                         clearable
                         :remote-method="handlevipList"
                         :loading="vipLoading"
                         placeholder="请选择分销等级"
                         class="filter-item"
                         style="width: 50%;">
                <el-option
                  v-for="item in vipOptions"
                  :key="item.id"
                  :label="item.distribution_level_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="item.personal_distribution_level_value" style="width:48%;"></el-input>
            </el-form-item>
            <el-form-item label="团队粉丝人数" label-width="20%" prop="team_distribution_level">
              <el-select v-model="item.team_distribution_level_key"
                         filterable
                         remote
                         clearable
                         :remote-method="handlevipList"
                         :loading="vipLoading"
                         placeholder="请选择分销等级"
                         class="filter-item"
                         style="width: 50%;">
                <el-option
                  v-for="item in vipOptions"
                  :key="item.id"
                  :label="item.distribution_level_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="item.team_distribution_level_value" style="width:48%;"></el-input>
            </el-form-item>
            <el-form-item label="自身消费" label-width="20%" prop="personal_sales_volume">
              <el-input v-model="item.personal_sales_volume"></el-input>
            </el-form-item>
            <el-form-item label="团队消费" label-width="20%" prop="team_sales_volume">
              <el-input v-model="item.team_sales_volume"></el-input>
            </el-form-item>
            <el-form-item label="升级适用于" label-width="20%" prop="team_sales_volume">
              <el-select v-model="item.uptype"
                         filterable
                         remote
                         clearable
                         :loading="uptypeLoading"
                         placeholder="请选择升级适用于"
                         class="filter-item"
                         style="width: 50%;">
                <el-option
                  v-for="items in uptypeOptions"
                  :key="items.key"
                  :label="items.label"
                  :value="items.key">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!--保级条件(上月)-->
          <!--<el-form-item label="直接粉丝消费" label-width="20%" prop="keep_level_direct_consumption_money">
            <div class="basicMessage">保级条件(上月)</div>
            <el-input v-model="temp.keep_level_direct_consumption_money"></el-input>
          </el-form-item>
          <el-form-item label="间接粉丝消费" label-width="20%" prop="keep_level_indirect_consumption_money">
            <el-input v-model="temp.keep_level_indirect_consumption_money"></el-input>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-right: 0px;">
          <el-button @click="addUprule">添加套餐</el-button>
          <el-button @click="dialogLevel = false">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createData">确 定</el-button>
          <el-button v-else type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>
      <!--直升弹窗-->
      <el-dialog :visible.sync="dialogFind" width="80%">
        <div class="filter-container">
          <div style="float: right;">
            <!--<el-button class="filter-item" type="primary" v-waves @click="handleFilter1">搜索</el-button>-->
            <el-button class="filter-item" type="primary" v-waves @click="create1">添加</el-button>
          </div>
        </div>
        <el-table :key="tableKey1" :data="list1" v-loading="listLoading1" element-loading-text="给我一点时间" style="width: 100%;margin-top: 10px;" border stripe highlight-current-row fit>
          <el-table-column label="ID" align="center" min-width="66">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="直升等级" align="center" min-width="400">
            <template slot-scope="scope">
              <span>{{scope.row.shop_distribution_level.distribution_level_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" min-width="300">
            <template slot-scope="scope">
              <span>{{scope.row.goods_common.goods_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="购买数量" align="center" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.goods_number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-delete" @click="delete1(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--直升下编辑和创建-->
      <el-dialog :visible.sync="dialogChild">
        <el-form  ref="dateForm2" :model="temp3" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
          <el-form-item label="商品" label-width="20%" prop="goods_common">
            <el-select v-model="temp3.goods_common"
                       filterable
                       remote
                       value-key="id"
                       :remote-method="handletypeList"
                       :loading="typeLoading"
                       placeholder="请选择商品"
                       class="filter-item"
                       style="width: 40%;">
              <el-option
                v-for="item in levlOptions"
                :key="item.id"
                :label="item.goods_name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品数量" label-width="20%" prop="goods_number">
            <el-input-number v-model="temp3.goods_number" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChild = false">取 消</el-button>
          <el-button v-if="dialogStatus1=='create'" :loading="btnLoading2" type="primary" @click="createDatafly">确 定</el-button>
          <el-button v-else type="primary" @click="updateDatafly">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import { getShopDistributionLevelList,
    changeShopDistributionLevelStatus,
    createShopDistributionLevel,
    findShopDistributionLevel,
    updateShopDistributionLevel,
    deleteShopDistributionLevel,
    getShopDistributionLevelUpruleGoodsList,
    createShopDistributionLevelUpruleGoods,
    deleteShopDistributionLevelUpruleGoods } from '@/api/setting'
  import { getShopGoodsCommonList } from '@/api/goods'
  import waves from '@/directive/waves'
  export default {
    name: 'disLevel',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        listQuery: {
          page: 1,
          page_size: 10,
          sort: '+sort',
          status: ''
        },
        levelOptions: [
          { key: 1, label: '开启' },
          { key: 2, label: '禁用' }
        ],
        uptypeOptions: [
            { key: '1', label: '内部' },
            { key: '2', label: '外部' }
        ],
        sortOptions: [
          { key: '+sort', label: '从低到高' },
          { key: '-sort', label: '从高到低' }
        ],
        list: null,
        total: null,
        listLoading: true,
        temp: {
          distribution_level_name: undefined,
          distribution_level_img: undefined,
          level_reward_ratio: undefined,
          first_orders_return_money_ratio: undefined,
          return_money_ratio: undefined,
          sort: undefined,
          status: '1',
          direct_people_number: undefined,
          direct_consumption_money: undefined,
          indirect_people_number: undefined,
          indirect_consumption_money: undefined,
          uprule:undefined,
          agent_name:undefined,
          is_agent:'',

        },
        is_agent:'1',
        rule: {
          distribution_level_name: [{ required: true, message: '请正确填写分销等级名称', trigger: 'change' }],
          shop_distribution_level_id: [{ required: true, message: '请正确填写分销等级', trigger: 'change' }],
          //direct_people_number: [{ required: true, message: '请正确填写直接粉丝人数', trigger: 'change' }],
          //direct_consumption_money: [{ required: true, message: '请正确填写直接粉丝消费', trigger: 'change' }],
          //indirect_people_number: [{ required: true, message: '请正确填写间接粉丝人数', trigger: 'change' }],
          //indirect_consumption_money: [{ required: true, message: '请正确填写间接粉丝消费', trigger: 'change' }],
        },
        dialogImageUrl: '',
        dialogVisible: undefined,
        textMap: {
          create: '创建',
          update: '编辑'
        },
        dialogStatus: '',
        dialogStatus1: '',
        dialogLevel: false,
        btnLoading: false,
        fileList: [],
        listQuery1: {
          page: 1,
          page_size: 10,
          shop_distribution_level_id: undefined
        },
        tableKey1: 0,
        listLoading1: true,
        list1: [],
        total1: 0,
        dialogFind: false,
        dialogChild: false,

        temp3: {
          goods_number: undefined,
          goods_common: undefined,
          // distribution_level_id: undefined,
          shop_distribution_level_id: undefined
        },
        levlOptions: [],
        typeLoading: false,
        btnLoading2: false,
        dialogStatus2: ''
      }
    },
  filters: {
    groupFuncTranslator(func) {
      const statusMap = {
        0: "否",
        1: "是",
      };
      return statusMap[func];
    }
  },
    created() {
      this.getList()
        this.handlevipList(' ')
    },
    methods: {
      getList() {
        this.listLoading = true
        getShopDistributionLevelList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.tableKey++
          this.listLoading = false
        })
      },
      // 获取直升商品
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
            getShopGoodsCommonList({ goods_name: query }).then(response => {
                console.log(response);
            this.levlOptions = response.data.data
            this.typeLoading = false
          })
        }
      },
      addUprule() {
          this.temp.uprule.push({});
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 获取分销等级
      handlevipList(query) {
          if (query !== '') {
              this.vipLoading = true
              getShopDistributionLevelList({ distribution_level_name: query, page_size: 10 ,status:1}).then(response => {
                  this.vipOptions = response.data.data
                  this.vipLoading = false
              })
          }
      },
      // 开关状态
      handleSwitch(row) {
        changeShopDistributionLevelStatus({ shop_distribution_level_id: row.id, status: row.status }).then(res => {
          console.log(status)
          this.$message.success('修改成功')
        })
      },
      //     .catch(()=> {
      //     if(row.status == )
      //   })
      // },
      // scope.row.is_default_level == 1
      //
      // .catch(()=> {
      //   if (row.status == 1) {
      //     row.status = 0
      //   } else {
      //     row.status = 1
      //   }
      // }
      // 打开创建
      create() {
        this.dialogStatus = 'create'
        this.dialogLevel = true
        this.resetemp()
        this.fileList = []
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
        })
      },
      // 编辑
      update(row) {
        this.dialogStatus = 'update'
        this.dialogLevel = true
        this.temp3.shop_distribution_level_id = row.id
        findShopDistributionLevel({ shop_distribution_level_id: row.id }).then(response => {
          this.temp = response.data
          this.fileList = [
            {
              url: row.distribution_level_img
            }
          ]
          this.dialogLevel = true
          this.$nextTick(() => {
            this.$refs['dateForm'].clearValidate()
          })
        })
      },
      // 创建确定
      createData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.temp.is_agent = this.is_agent
            createShopDistributionLevel(this.temp).then(response => {
              this.getList()
              this.dialogLevel = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.btnLoading = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      // 编辑确定
      updateData() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            this.temp.is_agent = this.is_agent
            const tempData = Object.assign({}, this.temp)
            tempData.shop_distribution_level_id = this.temp3.shop_distribution_level_id
            console.log(tempData.shop_distribution_level_id)
            updateShopDistributionLevel(tempData).then(response => {
              this.getList()
              this.dialogLevel = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      delete(row) {
        this.id = row.id
        console.log(this.id)
        deleteShopDistributionLevel({ id: row.id }).then(response => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 打开直升
      getListfind() {
        this.listLoading1 = true
          getShopDistributionLevelUpruleGoodsList(this.listQuery1).then(response => {
              console.log(response);
          this.list1 = response.data.data
          this.total1 = response.data.total
          this.tableKey1++
          this.listLoading1 = false
        })
      },
      find(row) {
        this.listQuery1.shop_distribution_level_id = row.id
        this.dialogFind = true
        this.getListfind()
      },
      // 直升创建
      create1(row) {
        this.shop_distribution_direct_upgrade_id = row.id
        console.log(this.shop_distribution_direct_upgrade_id)
        this.dialogStatus1 = 'create'
        this.dialogChild = true
        this.resetemp1()
        this.$nextTick(() => {
          this.$refs['dateForm2'].clearValidate()
        })
      },
      delete1(row) {
        this.id = row.id
        console.log(this.id)
        deleteShopDistributionLevelUpruleGoods({ id: row.id }).then(response => {
          // this.temp.shop_distribution_level_id = response.data.shop_distribution_level.id
            this.getListfind()
            this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
            })
        })
      },
      // 直升商品
      // 直升创建确定dialogStatus2
      createDatafly() {
        this.$refs['dateForm2'].validate((valid) => {
          if (valid) {
            this.btnLoading2 = true
            this.temp3.shop_distribution_level_id = this.listQuery1.shop_distribution_level_id
            this.temp3.goods_common_id = this.temp3.goods_common.id
              console.log(this.temp3);
            createShopDistributionLevelUpruleGoods(this.temp3).then(response => {
              this.getListfind()
              this.dialogChild = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.btnLoading2 = false
            }).catch(() => {
              this.btnLoading2 = false
            })
          }
        })
      },
      // 直升编辑确定
      updateDatafly() {
        this.$refs['dateForm2'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp3)
            tempData.shop_goods_common_id = tempData.goods_common.id
            tempData.shop_distribution_direct_upgrade_id = tempData.id
            tempData.shop_distribution_level_id = this.listQuery1.shop_distribution_level_id
            updateShopDistributionDirectUpgrade(tempData).then(response => {
              this.getListfind()
              this.dialogChild = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      resetemp1() {
        this.temp3 = {
          goods_number: undefined,
          goods_common: undefined,
          // distribution_level_id: undefined,
          shop_distribution_level_id: undefined
        }
      },
      handleFilter1() {
        this.listQuery1.page = 1
        this.getListfind()
      },
      // 等级图标
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!')
        }
        return isJPG && isLt2M
      },
      handleRemove() {
        this.temp.distribution_level_img = ''
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleUp(response, file, fileList) {
        this.temp.distribution_level_img = response.data.url
      },
      // 清空
      resetemp() {
        this.temp = {
          distribution_level_name: undefined,
          distribution_level_img: undefined,
          level_reward_ratio: undefined,
          first_orders_return_money_ratio: undefined,
          return_money_ratio: undefined,
          sort: undefined,
          status: '1',
          is_default_level: '1',
          direct_people_number: undefined,
          direct_consumption_money: undefined,
          indirect_people_number: undefined,
          indirect_consumption_money: undefined,
          keep_level_direct_consumption_money: undefined,
          keep_level_indirect_consumption_money: undefined
        }
      },
      // 分页
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .basicMessage{
    position: absolute;
    top: 0;
    left: -54%;
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }
  .el-dialog{
    width: 80%;
  }
</style>
