<template>
   <div class="orderList">
     <div class="orderList-box">
       <el-container>
         <el-header>主订单详情</el-header>
         <el-main>
           <div class="orderInfo">
             <div>订单详情：</div>
             <div>订单编号:<span>{{this.orders_main_info.orders_shop_unique_id}}</span></div>
             <div>订单总费用:<span>{{this.orders_main_info.actual_pay}}元</span>
               <span v-if="this.orders_main_info.freight !== null || this.orders_main_info.freight !== '' || this.orders_main_info.freight !== undefined">(包含运费{{this.orders_main_info.freight}}元)</span></div>
             <div>订单生成时间:<span>{{this.orders_main_info.created_at}}</span></div>
             <div>
               订单状态:
               <span v-if="this.orders_main_info.if_pay === 1">待付款</span>
               <span v-if="this.orders_main_info.if_pay === 2 && this.orders_main_info.if_received === 0">待发货</span>
               <span v-if="this.orders_main_info.if_pay === 2 && this.orders_main_info.if_received === 1">待收货</span>
               <span v-if="this.orders_main_info.if_pay === 2 && this.orders_main_info.if_received === 2">已完成</span>
             </div>
           </div>
           <div class="getPeople">
             <div>收货详情：
               <div>联系人:<span>{{this.orders_receiver_info.receive_name}}</span></div>
               <div>联系电话:<span>{{this.orders_receiver_info.phone}}</span></div>
               <div>收货地址:
                 <span>{{this.orders_receiver_info.province_name}}</span>
                 <span>{{this.orders_receiver_info.city_name}}</span>
                 <span>{{this.orders_receiver_info.district_name}}</span>
                 <span>{{this.orders_receiver_info.address}}</span>
               </div>
               <div>创建时间: <span>{{this.orders_receiver_info.created_at}}</span></div>
<!--               <div>发货状态:-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 0">无效订单</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 1">未确认</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 2">待发货</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 3">发货中</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 4">断货中</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 5">已签收</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 6">已拒收</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 7">已完成</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 8">已退回</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 9">已废弃</span>-->
<!--                 <span v-if="this.orders_main_info.shop_orders_status === 10">已退款</span>-->
<!--               </div>-->
             </div>
           </div>
         </el-main>
       </el-container>
       <el-container>
         <el-header>
          <div>子订单详情</div>
         </el-header>
         <el-table
          align="center"
           :data="orders_branch_info"
           style="width: 100%">
           <el-table-column
             prop="id"
             align="center"
             label="子订单id"
             width="180">
           </el-table-column>
           <el-table-column
             align="center"
             prop="orders_unique_id"
             label="子订单编号"
             min-width="180">
           </el-table-column>
           <el-table-column
             align="center"
             prop="actual_pay"
             label="子订单价格(运费)"
             width="180">
             <template slot-scope="scope">
              <span>{{scope.row.actual_pay}}</span>
               <span>({{scope.row.freight_pay}})</span>
            </template>
           </el-table-column>

           <el-table-column
             align="center"
             label="子订单下单时间"
             prop="created_at"
             width="180">
           </el-table-column>
           <el-table-column
             align="center"
             prop="status"
             label="子订单发货信息"
             width="180">
             <template slot-scope="scope">
               <span v-if="scope.row.status === 0">无效订单</span>
               <span v-if="scope.row.status === 1">未确认</span>
               <span v-if="scope.row.status === 2">待发货</span>
               <span v-if="scope.row.status === 3">发货中</span>
               <span v-if="scope.row.status === 4">断货中</span>
               <span v-if="scope.row.status === 5">已签收</span>
               <span v-if="scope.row.status === 6">已拒收</span>
               <span v-if="scope.row.status === 7">已完成</span>
               <span v-if="scope.row.status === 8">已退回</span>
               <span v-if="scope.row.status === 9">已废弃</span>
               <span v-if="scope.row.status === 10">已退款</span>
             </template>
           </el-table-column>
           <el-table-column
             align="center"
             prop="orders_logistics.logistics_name"
             label="物流信息"
             width="180"
           >
           </el-table-column>
           <el-table-column
             align="center"
             prop="orders_logistics.logistics_number"
             label="物流单号">
           </el-table-column>
           <el-table-column
             label="物流详情"
             min-width="150px"
             align="center"
           >
             <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" @click="getInfo(scope.row)"></el-button>
             </template>
           </el-table-column>
         </el-table>
       </el-container>
       <el-container>
         <el-header>货物信息</el-header>
         <template>
           <el-table
             :data="tableData"
             style="width: 100%">
             <el-table-column
               align="center"
               prop="shop_goods_common.goods_title"
               label="货物名称"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               label="货物图片"
               prop="shop_goods.image_thumb"
               min-width="180">
               <template slot-scope="scope">
                 <img :src="scope.row.shop_goods.image_thumb" width="150" height="150"/>
               </template>
             </el-table-column>
             <el-table-column
               align="center"
               prop="price"
               label="货物单价"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               prop="number"
               label="货物数量"
               min-width="180"
             >
             </el-table-column>
             <el-table-column
               align="center"
               prop="actual_pay"
               label="货物总价格">
             </el-table-column>
           </el-table>
         </template>
       </el-container>
       <el-container v-if="this.shop_record !== null ">
         <el-header>分佣明细</el-header>
         <template>
           <el-table
             align="center"
             :data="shop_record"
             style="width: 100%">
             <el-table-column
               align="center"
               prop="goods_name"
               label="货物名称"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               label="分佣顾客id"
               prop="customer_id"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               label="分佣顾客信息"
               min-width="180">
               <template slot-scope="scope">
<!--                 <span v-if="scope.row.customer_shop.user_nickname === null || scope.row.customer_shop.user_nickname === '' || scope.row.customer_shop.user_nickname === undefined">{{scope.row.customer_shop.phone}}</span>-->
<!--                 <span v-else>{{scope.row.customer_shop.user_nickname}}</span>-->
                 <span v-if="scope.row.customer_shop === null || scope.row.customer_shop === undefined || scope.row.customer_shop === ''">暂无信息</span>
                 <span v-else-if="scope.row.customer_shop.user_nickname === null || scope.row.customer_shop.user_nickname === '' || scope.row.customer_shop.user_nickname === undefined">{{scope.row.customer_shop.phone}}</span>
                 <span v-else>{{scope.row.customer_shop.user_nickname}}</span>
               </template>
             </el-table-column>
             <el-table-column
               align="center"
               label="购买顾客id"
               prop="from_customer_id"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               prop="profit"
               label="分佣金额"
               min-width="180">
             </el-table-column>
             <el-table-column
               align="center"
               prop="number"
               label="货物数量"
               min-width="180"
             >
             </el-table-column>
             <el-table-column
               align="center"
               prop="actual_pay"
               label="分佣金额状态">
               <template slot-scope="scope">
                 <span v-if="scope.row.status === 1">冻结</span>
                 <span v-if="scope.row.status === 2">可用</span>
                 <span v-if="scope.row.status === 3">无效</span>
               </template>
             </el-table-column>
           </el-table>
         </template>
       </el-container>
       <el-dialog title="物流详情" :visible.sync="dialogCoupon">
         <el-table :data="gridData">
           <el-table-column property="time" align="center" label="日期" min-width="200"></el-table-column>
           <el-table-column property="status" align="center" label="状态" min-width="700"></el-table-column>
         </el-table>
       </el-dialog>
     </div>
   </div>
</template>

<script>
  import {getListInfo} from "@/api/orders"
    export default {
      name: "ordersList",
      data(){
        return{
          orders_shop_id:null,
          orders_main_info:[],
          orders_receiver_info:{},
          shop_record:[],
          tableData: [],
          orders_branch_info:[],
          dialogCoupon: false,
          gridData:[],
        }
      },
      created() {
        this.orders_shop_id= this.$route.params.id / 1
        getListInfo({orders_shop_id:this.orders_shop_id}).then(response => {
          this.orders_main_info = response.data
          // console.log(this.orders_main_info)
          this.orders_receiver_info = response.data.orders_shop_receiver_info
          // console.log(this.orders_receiver_info)
          this.tableData = response.data.orders_shop_items
          // console.log(this.tableData)
          this.shop_record = response.data.shop_balance_profit_record
          // console.log(this.shop_record)
          this.orders_branch_info = response.data.orders
          // console.log(this.orders_branch_info)
        })
      },
      methods:{
        getInfo(row){
          this.dialogCoupon = true
          this.gridData = row.orders_logistics.trace
        }
      },
    }
</script>

<style scoped lang="scss">
  .orderList{
    width:100%;
    height:100%;
    .orderList-box{
     margin:20px;
    }
  }
  .el-container{
    .el-header{
     text-align: left;
    }
    .el-main{
      line-height:50px;
      .orderInfo{
        width:50%;
        float:left;
      }
      .getPeople {
        width: 50%;
        float: right;
      }
      div{
        line-height:50px;
        text-align: left;
      }
      .el-main-box{
        word-break: break-word; /* 文本行的任意字内断开 */
        word-wrap: break-word; /* IE */
        white-space: -hp-pre-wrap; /* HP printers */
        white-space: -o-pre-wrap; /* Opera 7 */
        white-space: -pre-wrap; /* Opera 4-6 */
        white-space: -moz-pre-wrap; /* Mozilla */
        white-space: pre; /* CSS2 */
        white-space: pre-wrap; /* CSS 2.1 */
        white-space: pre-line; /* CSS 3 (and 2.1 as well, actually) */
        p{
          width:100%;
        }

      }
    }
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
