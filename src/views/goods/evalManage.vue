<template>
  <div class="app-container">
    <!--筛选条件-->
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
        @change='handleFilter'
        style="width: 240px;">
      </el-date-picker>
      <!--请选择商品-->
      <el-select v-model="listQuery.shop_goods_common_id"
                 filterable
                 remote
                 :remote-method="handletypeList"
                 :loading="typeLoading"
                 placeholder="请选择商品"
                 class="filter-item"
                 clearable>
        <el-option
          v-for="item in choosOptions"
          :key="item.id"
          :label="item.goods_name"
          :value="item.id">
        </el-option>
      </el-select>
      <!--全部评论-->
      <el-select @change='handleFilter' clearable class="filter-item" v-model="listQuery.status">
        <el-option v-for="item in commentOptions" :key="item.key" :label="item.label" :value="item.key" clearable>
        </el-option>
      </el-select>
      <!--全部状态-->
      <div style="display: inline-block;vertical-align: top!important;">
        <el-radio-group v-model="listQuery.comments_types">
          <el-radio-button :label="[]">全部</el-radio-button>
          <el-radio-button :label="[5]">好评</el-radio-button>
          <el-radio-button :label="[3,4]">中评</el-radio-button>
          <el-radio-button :label="[1,2]">差评</el-radio-button>
        </el-radio-group>
      </div>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter" style="float: right;">搜索</el-button>
    </div>
    <!--图片上传预览-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!--展开列表-->
    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              row-key="id"
              :expand-row-keys="expandList"
              @expand-change="expandRow"
              style="width: 100%" :default-expand-all="ifExpandAll" :row-class-name="tableRowClassName">
      <el-table-column type="expand" :default-expand-all="ifExpandAll">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand" style='width: 80%; margin-left:10%;'>
            <el-form-item class="textAll" style="clear: both;">
              <p style="color: #188ebd;float: left;width: 10%;">{{scope.row.customer_nickname}}</p>
              <p style="float: left;width: 70%;margin-left: 20px;">{{scope.row.comments_content}}</p>
            </el-form-item>
            <!--回复-->
            <el-form-item v-for="(item,index) in scope.row.shop_goods_common_comments_reply" :key="index" class="textAll">
              <div class="comments-reply">
                <p class="reply" style="width: 70%">{{item.reply_content}}</p>
                <p class="reply" style="width: 10%;color: #188ebd;">{{item.customer_nickname}}</p>
                <el-switch
                  v-model="item.status"
                  :active-value="2"
                  :inactive-value="1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleSwitch1(item)">
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="textAll">
              <el-input type="textarea" placeholder="请输入内容" v-model="scope.row.textarea"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="float: right;width: 30%;">
            <el-button type="primary" @click="createData(scope.row)">确 定</el-button>
          </div>
        </template>
      </el-table-column>
      <!--列表-->
      <el-table-column align="center" label="用户名" min-width="100">
        <template slot-scope="scope">
          <span style="color: #5f92c3fc;">{{scope.row.customer_nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="center" label="评价">
        <template slot-scope="scope">
          <el-rate disabled v-model="scope.row.comments_type" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </template>
      </el-table-column>
      <el-table-column min-width="200" align="center" label="评价内容">
        <template slot-scope="scope">
          <span>{{scope.row.comments_content}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="60" align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="2"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="center" label="图片内容">
        <template slot-scope="scope">
          <img v-for="item in scope.row.img_url" :src="item " alt="" class="piceureUrl" @click="handlePicture(item)">
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--列表分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // 水波纹指令
  import { getShopAssembleProductGoods } from '@/api/activity'
  import { getShopGoodsCommonCommentsList, changeShopGoodsCommonCommentsStatus, createShopGoodsCommonCommentsReply, changeShopGoodsCommonCommentReplysStatus } from '@/api/goods'
  export default {
    name: 'evalManage',
    directives: {
      waves
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: undefined,
        tableKey: 0,
        listQuery: {
          page: 1,
          page_size: 10,
          comments_types: [],
          shop_goods_common_id: undefined
        },
        list: [],
        total: null,
        listLoading: false,
        choosOptions: [],
        commentOptions: [
          { key: 1, label: '个人可见' },
          { key: 2, label: '全部可见' }
        ],
        expandList: [],
        ifExpandAll: false,
        typeLoading: false,
        pickerOptions2: {},
        temp: {
          product_goods_common_id: undefined,
          customer_account_id: undefined,
          customer_nickname: undefined,
          shop_goods_common_comments_id: undefined,
          reply_content: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    filters: {
      repurchaseStatus(status) {
        const statusTransMap = {
          1: '新',
          2: '复'
        }
        return statusTransMap[status]
      },
      orderStatusTranslator(status) {
        const statusMap = {
          0: '无效订单',
          1: '未确认',
          2: '待发货',
          3: '发货中',
          4: '断货中',
          5: '已签收',
          6: '已拒收',
          7: '已完成',
          8: '已退回',
          9: '已废弃'
        }
        return statusMap[status]
      }
    },
    methods: {
      handleType(row) {
        console.log(row)
      },
      getList() {
        this.listLoading = true
        getShopGoodsCommonCommentsList(this.listQuery).then(response => {
          // this.list = response.data.data
          this.list = response.data.data.map(item => {
            item.textarea = ''
            return item
          })
          console.log(this.list)
          this.total = response.data.total
          this.listLoading = false
        })
      },
      createData(row) {
        const tempData = {
          shop_goods_common_comments_id: row.id,
          reply_content: row.textarea,
          is_official: '0',
          status: '1'
        }
        createShopGoodsCommonCommentsReply(tempData).then(response => {
          row.shop_goods_common_comments_reply.push(response.data)
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 选择商品
      handletypeList(query) {
        if (query !== '') {
          this.typeLoading = true
          getShopAssembleProductGoods({ goods_name: query, page_size: 10 }).then(response => {
            this.choosOptions = response.data.data
            this.typeLoading = false
          })
        }
      },
      // 状态开关
      handleSwitch(row) {
        changeShopGoodsCommonCommentsStatus({ shop_goods_common_comments_id: row.id, status: row.status }).then(res => {
          this.$message.success('修改成功')
        })
      },
      handleSwitch1(item) {
        changeShopGoodsCommonCommentReplysStatus({ shop_goods_common_comments_reply_id: item.id, status: item.status }).then(res => {
          this.$message.success('修改成功')
        })
      },
      // 分页
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handlePicture(item) {
        this.dialogImageUrl = item
        this.dialogVisible = true
      },
      // 打开关闭行
      expandRow(row, expandedRows) {
        this.expandList = expandedRows.map(item => {
          return item.id
        })
        console.log(this.expandList)
      },
      tableRowClassName({ row, rowIndex }) {
        return 'colored-row'
      }
    }
  }
</script>

<style scoped>
  .piceureUrl{
    width: 50px;
    height: 40px;
    margin-right: 10px;
    line-height: 40px;
  }
  .reply {
    margin: 0;
    padding: 0;
    line-height: 30px;
    color: #7d3d3d;
    margin-right: 10px;
  }
  .textAll >>> .el-form-item__content {
    width: 100% !important;
  }
  .textAll {
    width: 80% !important;
  }
  .comments-reply {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-flow: row nowrap;
  }
</style>
