<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-float">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">回到首页</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="create">添加</el-button>
      </div>
    </div>
    <template>
      <el-table
        :key="tableKey"
        :data="broadcasts"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        stripe
        fit
        highlight-current-row
        border
        style="width: 100%;"
      >
        <el-table-column prop="ID" label="ID" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.live_room.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="主播手机号" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.customer_shop !== null">{{scope.row.customer_shop.phone}}</span>
            <span v-else>暂无信息</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="主播昵称" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="主播房间号" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.live_room.room_number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="主播头像" width="150" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.head_img" alt width="120" height="120" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="直播封面图" width="170" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.live_room.room_img" alt width="120" height="120" />
          </template>
        </el-table-column>
        <el-table-column label="关注人数" align="center" width="90">
          <template slot-scope="scope">
            <span>{{scope.row.live_room.follow_count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="观看人数" align="center" width="90">
          <template slot-scope="scope">
            <span>{{scope.row.live_room.look_count}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90" align="center" label="开播状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.live_room.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="90" align="center" label="转盘状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.live_room.draw_status"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchs(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="600">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="choose(scope.row)">主播信息</el-button>
            <el-button type="success" size="small" @click="Aboutgoods(scope.row)">关联商品</el-button>
            <el-button type="warning" size="small" @click="gotoVideo(scope.row)">视频列表</el-button>
            <el-button type="danger" size="small" @click="gotoPoster(scope.row)">海报管理</el-button>
            <el-button type="success" size="small" @click="getposts(scope.row)">转盘设置</el-button>
            <el-button type="primary" plain size="small" @click="zhongjiang(scope.row)">中奖纪录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="broadCast.page"
          :page-sizes="[5,8]"
          :page-size="broadCast.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!--添加编辑弹出-->
      <el-dialog :visible.sync="dialogCoupon" @close="dialogClose" width="60%">
        <!--  内层弹出框       -->
        <el-dialog :visible.sync="dialogCouponIn" @close="dialogCouponInClose" append-to-body>
          <el-form label-position="left" label-width="20%" style="width: 80%; margin-left:10%;">
            <!-- <el-form-item label="商品搜索" v-if="dialogStatusIn === 'gods'">
              <div class="search" label="请选择商品" label-width="20%" v-if="dialogStatusIn === 'gods'">
                <el-input v-model="searchQuery.goods_name"
                          placeholder="请输入商品名称"
                          style="width:400px"
                          clearable
                ></el-input>
                <el-button
                  type="primary"
                  @click="searchGods()">搜索</el-button>
              </div>
            </el-form-item>-->
            <el-form-item label="请选择商品" label-width="20%" v-if="dialogStatusIn === 'gods'">
              <template>
                <!-- <el-select
                  multiple
                  remote
                  reserve-keyword
                  v-model="selectGods.shop_goods_common_id"
                  clearable filterable
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                @change="getSelectGods">-->
                <el-select
                  remote
                  v-model="selectGods.shop_goods_common_id"
                  clearable
                  filterable
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="getSelectGods"
                >
                  <el-option
                    v-for="(item,index) in shopGods"
                    :value-key="item.id"
                    :key="index"
                    :label="item.goods_title"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="selectSku"
                  filterable
                  clearable
                  style="margin-left: 20px;"
                  placeholder="请选择规格"
                  @change="getSelectSku"
                >
                  <el-option
                    v-for="(items,index) in shopSku"
                    clearable
                    :value-key="items.id"
                    :key="index"
                    :label="items.sku"
                    :value="items.id"
                    :disabled="items.isdisable"
                  ></el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="推送描述" label-width="20%" v-if="dialogStatusIn === 'gods'">
              <el-input v-model="addInfo.goods_introduce"></el-input>
            </el-form-item>
            <el-form-item label="修改推送描述" label-width="20%" v-if="dialogStatusIn === 'word'">
              <el-input v-model="changeIntroduceInfo.goods_introduce"></el-input>
            </el-form-item>
          </el-form>
          <el-form label-position="left" label-width="20%" style="width: 80%; margin-left:10%;">
            <el-form-item label="直播间ID" v-if="dialogStatusIn === 'blacklist'">
              <el-col :span="8">
                <el-input v-model="black_Query.live_room_id" :disabled="true" width="40%"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="请选择用户" label-width="20%" v-if="dialogStatusIn === 'blacklist'">
              <template>
                <el-select
                  remote
                  v-model="black_Query.customer_id"
                  filterable
                  clearable
                  placeholder="请选择用户"
                  :remote-method="searchPeople"
                  :loading="loadingPeople"
                >
                  <el-option
                    v-for="(item,index) in list"
                    :value-key="item.user_nickname"
                    :key="index"
                    :label="item.user_nickname"
                    :value="item.customer_id"
                  ></el-option>
                  <div class="getPage">
                    <span class="prevePage" @click="toPreve" v-show="listQuery.page > 1">上一页</span>
                    <span class="nextPage" @click="toNext" v-show="listQuery.page < allPageCount">下一页</span>
                  </div>
                </el-select>
                <el-button type="primary" style="margin-left:20px" @click="addBlackList()">添 加</el-button>
              </template>
            </el-form-item>
          </el-form>
          <el-table
            :key="tableKey1"
            :data="LiveBlackList"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            stripe
            fit
            highlight-current-row
            border
            style="width: 100%;"
            v-if="dialogStatusIn === 'blacklist'"
          >
            <el-table-column prop="ID" label="ID" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.customer_id}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="昵称" min-width="100" align="center">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.blacklist_customer !== '' && scope.row.blacklist_customer !== null && scope.row.blacklist_customer !== undefined "
                >{{scope.row.blacklist_customer.user_nickname}}</span>
                <span v-else>暂无信息</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="手机号" min-width="100" align="center">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.blacklist_customer !== '' && scope.row.blacklist_customer !== null && scope.row.blacklist_customer !== undefined "
                >{{scope.row.blacklist_customer.phone}}</span>
                <span v-else>暂无信息</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="拉黑日期" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.created_at}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="do" label="操作" min-width="100" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="outBlackList(scope.row)">解除黑名单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="dialogStatusIn === 'blacklist' && !listLoading" class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3"
              :current-page.sync="getLiveBlack.page"
              :page-size="getLiveBlack.size"
              :page-sizes="[5,8]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total3"
            ></el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCouponIn = false">取 消</el-button>
            <el-button v-if="dialogStatusIn === 'gods'" type="success" @click="addLiveGods">添 加</el-button>
            <el-button
              v-else-if="dialogStatusIn === 'word'"
              type="primary"
              @click="getNewIntroduce"
            >修 改</el-button>
            <el-button
              v-else-if="dialogStatusIn === 'blacklist'"
              type="primary"
              @click="dialogCouponIn = false"
            >确 定</el-button>
          </div>
        </el-dialog>
        <el-form label-position="left" label-width="20%" style="width: 80%; margin-left:10%;">
          <el-form-item
            label="主播手机号"
            label-width="20%"
            v-if="dialogStatus === 'change'||  dialogStatus === 'create'"
          >
            <el-input
              v-model="customer_phone"
              :disabled="dialogStatus === 'change'|| dialogStatus === 'gods'"
            ></el-input>
          </el-form-item>
          <el-form-item label="直播间号码" label-width="20%" v-if="dialogStatus === 'gods'">
            <el-input
              v-model="lr_id"
              :disabled="dialogStatus === 'change'|| dialogStatus === 'gods'"
            ></el-input>
          </el-form-item>
          <el-form-item label="添加商品" v-if="dialogStatus === 'gods'">
            <div class="search" label-width="20%">
              <el-button type="success" @click="addShopGods">添加商品</el-button>
            </div>
          </el-form-item>
          <el-form-item label="rtmp地址" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input v-model="broadcastStream.pushUrl" :disabled="dialogStatus === 'change'"></el-input>
          </el-form-item>
          <el-form-item label="直播码" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input
              v-model="broadcastStream.stream_key_push"
              :disabled="dialogStatus === 'change'"
            ></el-input>
          </el-form-item>
          <el-form-item label="直播码二维码" label-width="20%" v-if="dialogStatus === 'change'">
            <img :src="liveCode" alt v-if="this.live_status === 1" />
            <span v-else>暂无信息</span>
          </el-form-item>
          <el-form-item label="主播昵称" label-width="20%" v-if="dialogStatus == 'change'">
            <el-input v-model="changeBroadcastInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="主播简介" label-width="20%" v-if="dialogStatus == 'change'">
            <el-input v-model="changeBroadcastInfo.desc"></el-input>
          </el-form-item>
          <el-form-item label="直播公告" label-width="20%" v-if="dialogStatus == 'change'">
            <el-input v-model="changeBroadcastInfo.live_notice"></el-input>
          </el-form-item>
          <el-form-item
            label="直播封面"
            label-width="20%"
            prop="img_url"
            v-if="dialogStatus === 'change'"
          >
            <el-upload
              :action="baseUrl"
              name="image"
              :file-list="fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreviews"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handleUp"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过１M</span>
          </el-form-item>
          <el-form-item
            label="主播头像"
            label-width="20%"
            prop="img_url"
            v-if="dialogStatus === 'change'"
          >
            <el-upload
              :action="baseUrl"
              name="image"
              :file-list="fileImg"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview1"
              :on-remove="handleRemove1"
              :before-upload="beforeAvatarUpload1"
              :on-success="handleUp1"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过１M</span>
          </el-form-item>
          <el-form-item label="查看黑名单" label-width="20%" v-if="dialogStatus === 'change'">
            <el-button type="info" size="small" @click="getBlackList">黑名单</el-button>
            <el-button type="info" size="small" @click="gotoDanmuList">弹幕列表</el-button>
          </el-form-item>
          <el-form-item label="随机购买" label-width="20%" v-if="dialogStatus === 'change'">
            <el-switch
              v-model="random_yellow_car"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeRandom()"
            ></el-switch>
          </el-form-item>
          <el-form-item label="开播提示" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input v-model="customer_title" :disabled="dialogStatus === 'create'"></el-input>
          </el-form-item>
          <el-form-item label="下次直播时间" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input v-model="next_live_time" :disabled="dialogStatus === 'create'"></el-input>
          </el-form-item>
          <el-form-item label="关注人数" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input v-model="follow_count" :disabled="dialogStatus === 'create'"></el-input>
          </el-form-item>
          <el-form-item label="观看人数" label-width="20%" v-if="dialogStatus === 'change'">
            <el-input v-model="look_count" :disabled="dialogStatus === 'create'"></el-input>
          </el-form-item>
        </el-form>
        <el-table
          :key="tableKey"
          :data="listgods"
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          stripe
          fit
          highlight-current-row
          border
          style="width: 100%;"
          v-if="dialogStatus === 'gods'"
        >
          <el-table-column prop="ID" label="ID" width="60" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="商品名称" min-width="120" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.shop_goods !== null"
              >{{scope.row.shop_goods.shop_goods_common.goods_title}}</span>
              <span v-else>暂无信息</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品价格" min-width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.shop_goods !== null">{{scope.row.shop_goods.actual_price}}</span>
              <span v-else>暂无信息</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品图片" min-width="200" align="center">
            <template slot-scope="scope">
              <img
                :src="scope.row.shop_goods.image_thumb"
                alt
                width="150"
                height="150"
                v-if="scope.row.shop_goods !== null"
              />
              <span v-else>暂无信息</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品推送" min-width="200" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.goods_introduce !=='' && scope.row.goods_introduce !== null && scope.row.goods_introduce !== undefined"
              >{{scope.row.goods_introduce}}</span>
              <span v-else>暂无信息</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="200" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteToLive(scope.row)">删除</el-button>
              <el-button type="primary" @click="changeIntroduce(scope.row)">修改推送</el-button>
            </template>
          </el-table-column>
          <el-table-column min-width="80px" align="center" label="主推">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.master_push"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="masterGods(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="dialogStatus === 'gods' && !listLoading" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page.sync="lr_Query.page"
            :page-size="lr_Query.size"
            :page-sizes="[3,5]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
        <el-table
          :key="tableKey2"
          :data="videolist"
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          stripe
          fit
          highlight-current-row
          border
          style="width: 100%;"
          v-if="dialogStatus === 'live'"
        >
          <el-table-column prop="ID" label="我的视频" style="width: 50%;" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.coverURL" alt width="150" height="150" />
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="视频ID" style="width: 20%;" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.video_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="添加时间" style="width: 30%;" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.created_at}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="操作" style="width: 20%;" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteVideo(scope.row)">删除</el-button>
              <el-button type="primary" @click="gotoVideoPoster(scope.row)">海报管理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="dialogStatus === 'live' && !listLoading" class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="liveVideo.page"
            :page-size="liveVideo.size"
            :page-sizes="[3,6]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCoupon = false">取 消</el-button>
          <el-button v-if="dialogStatus === 'create'" type="success" @click="createData">确定</el-button>
          <el-button
            v-else-if="dialogStatus === 'gods'"
            type="primary"
            @click="dialogCoupon = false"
          >确定</el-button>
          <el-button v-else-if="dialogStatus === 'live'" type="success" @click="addVideo">添加</el-button>
          <el-button v-else type="primary" @click="changeInfo">确 定</el-button>
        </div>
      </el-dialog>

      <!--转盘列表弹出-->
      <el-dialog :visible.sync="dialogCoupons" width="70%">
        <div class="filter-container">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            @click="handleCreate"
            type="primary"
            icon="el-icon-edit"
          >添加</el-button>
        </div>
        <el-table :data="dataList" border style="width: 100%"  v-loading="listLoadingZP"
          element-loading-text="给我一点时间">
          <el-table-column label="ID" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="奖项" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.prize_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="奖项图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.prize_img" style="width:100px;height:100px" />
            </template>
          </el-table-column>
           <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.prize_number}}</span>
            </template>
          </el-table-column>
             <el-table-column label="权重" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.weight}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.draw_type | statusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEditSet(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加弹窗 -->
        <el-dialog width="25%" title="创建" :visible.sync="innerVisibles" append-to-body @close="handroos">
          <el-form ref="forms" :model="loginForm">
            <el-form-item label="奖项 :">
              <el-input v-model="loginForm.prize_name" style="width: 300px; margin-left:28px"></el-input>
            </el-form-item>
            <el-form-item label="数量 :">
              <el-input v-model="loginForm.prize_number" style="width: 300px;margin-left:28px"  ></el-input>
            </el-form-item>
            <el-form-item label="权重 :">
              <el-input v-model="loginForm.weight" style="width: 300px;margin-left:28px" ></el-input>
            </el-form-item>
            <el-form-item label="类型 :">
              <el-select v-model="loginForm.draw_type" placeholder="请选择" style="width: 300px;margin-left:28px" @change="handfills">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优惠券ID :" v-if="yhj">
               <el-input  v-model="loginForm.draw" style="width: 300px;"></el-input>
            </el-form-item>
             <el-form-item label="金贝 :"  v-if="jb">
              <el-input v-model="loginForm.draw" style="width: 300px;margin-left:28px"></el-input>
            </el-form-item>
             <el-form-item label="银贝 :" v-if="yb">
              <el-input  v-model="loginForm.draw" style="width: 300px;margin-left:28px"></el-input>
            </el-form-item>
            <el-form-item label="图片 :">
              <div class="upload">
              <el-upload
                :action="baseUrl"
                name="image"
                :file-list="fileLists"
                list-type="picture-card"
                :on-remove="handleRemoves"
                :before-upload="beforeAvatarUploads"
                :on-success="handleUpsl"
                :limit="1"
                :on-exceed="handleExceed1"
                multiple
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              </div>
              <span style="margin-left:75px">只能上传png文件,图片大小不能超过１M</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisibles = false">取 消</el-button>
            <el-button type="primary" @click="praevsorsl()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改弹窗 -->
        <el-dialog width="25%" title="修改" :visible.sync="innerVisible" append-to-body>
          <el-form ref="forms" :model="loginFormls" >
            <el-form-item label="奖项 :">
              <el-input v-model="loginFormls.prize_name" style="width: 300px;margin-left:28px" ></el-input>
            </el-form-item>
            <el-form-item label="数量 :">
              <el-input v-model="loginFormls.prize_number" style="width: 300px;margin-left:28px" ></el-input>
            </el-form-item>
            <el-form-item label="权重 :">
              <el-input v-model="loginFormls.weight" style="width: 300px;margin-left:28px" ></el-input>
            </el-form-item>
              <el-form-item label="类型 :">
              <el-select v-model="loginFormls.draw_type" placeholder="请选择" style="width: 300px;margin-left:28px" @change="handsrool">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="优惠券ID :" v-if="xgyhj">
              <el-input  v-model="loginFormls.draw" style="width: 300px;" ></el-input>
            </el-form-item>
             <el-form-item label="金贝 :"  v-if="xgjb">
              <el-input v-model="loginFormls.draw" style="width: 300px;margin-left:28px"></el-input>
            </el-form-item>
             <el-form-item label="银贝 :" v-if="xgyb">
              <el-input  v-model="loginFormls.draw" style="width: 300px;margin-left:28px"></el-input>
            </el-form-item>
            <el-form-item label="图片 :">
            <div class="upload">
              <el-upload
                :action="baseUrl"
                v-model="loginFormls.prize_img"
                name="image"
                :file-list="fileLists"
                list-type="picture-card"
                :limit="1"
                :on-exceed="handleExceed1"
                :on-remove="handleRemoves"
                :before-upload="beforeAvatarUploads"
                :on-success="handleUprs"
                multiple
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              </div>
              <span style="margin-left:75px">只能上传png文件,图片大小不能超过１M</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="praevsors()">确 定</el-button>
          </div>
        </el-dialog>
      </el-dialog>
      <!-- 中奖纪录弹出 -->
      <el-dialog :visible.sync="dialogCouponsl" width="80%" @close="handdelets">
    <div class="filter-container">

    <!-- 类型 -->
      <el-select
        style="width: 150px"
        @change="handleFilters"
        v-model="list_Query.prize_id"
        filterable
        clearable
        placeholder="类型"
        class="filter-item"
      >
      <el-option v-for="item in optionsl" :key="item.id" :label="item.prize_name" :value="item.id"></el-option>
      </el-select>
    </div>
        <el-table :data="datas" border style="width: 100%" v-loading="listLoadPrize">
          <el-table-column label="ID" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="奖项" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.winner_draw_record_draw.prize_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="奖项图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.prize_img" style="width:100px;height:100px" />
            </template>
          </el-table-column>
           <el-table-column label="奖品数量" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.winner_draw_record_draw.prize_number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="中奖数量" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.winner_draw_record_draw.winner_prize_number}}</span>
            </template>
          </el-table-column>
             <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.winner_draw_record_draw.draw_type | statusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="中奖姓名" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.name}}</span>
            </template>
          </el-table-column>
            <el-table-column label="电话" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.phone}}</span>
            </template>
          </el-table-column>
             <el-table-column label="地址" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.addr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="中奖时间" align="center"  width="200" >
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.winner_draw_time}}</span>
            </template>
          </el-table-column>
        </el-table>
       <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChangesls"
          @current-change="handleCurrentChangesls"
          :current-page.sync="list_Query.page"
          :page-sizes="[10,20,30]"
          :page-size="list_Query.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"

        ></el-pagination>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import waves from "@/directive/waves";
import { getCustomerShopList } from "@/api/customer";
import {
  createRoom,
  getBroadcast,
  getliveStream,
  beginshow,
  changeInfo,
  getLiveGods,
  getALLGods,
  deleteToLive,
  getLiveCode,
  getLiveVideoList,
  deleteVideoInfo,
  addToLive,
  masterPush,
  changeIntroduce,
  pullBlackList,
  getLiveBlackList,
  removeBlackList,
  getRoomDanmuList,
  getDrawPrizeList,
  createDrawPrize,
  findDrawPrizeInfo,
  updateDrawPrizeInfo,
  getWinnerDrawRecordList,
  findPrizeStatus,
  updatePrizeStatus,
  getPrizeList
} from "@/api/liveBroadcast";
import { getShopGoodsCommonList } from "@/api/goods";
export default {
  name: "setRoom",
  directives: {
    waves
  },
  data() {
    return {
      listLoadPrize:false,
      listLoadingZP:false,
      roos:'',
      datas:[],
      dialogCouponsl:false,
      data:'',
      isReloadData: true,
      live_room_id:undefined,
      yhj :false,
      jb:false,
      yb:false,
      xgyhj :false,
      xgjb:false,
      xgyb:false,
      optionsl:[],
      options: [{
          value: '1',
          label: '实物'
        }, {
          value: '2',
          label: '优惠券'
        }, {
          value: '3',
          label: '金贝'
        }, {
          value: '4',
          label: '银贝'
        }],
      fileLists: [],
       loginFormls: {
        prize_name: undefined,
        prize_img: "",
        prize_number: undefined,
        live_room_id: undefined,
        draw: undefined,
        draw_type: undefined,
        weight:undefined,
      },
      loginForm: {
        prize_name: undefined,
        prize_img: "",
        prize_number: undefined,
        live_room_id: undefined,
        draw: undefined,
        draw_type: undefined,
        weight:undefined,
      },
      totals:0,
      innerVisibles: false,
      innerVisible: false,
      dialogCoupons: false,
      dataList: [],
      baseUrl: process.env.BASE_API + "/api/document/uploadImage",
      selectGoods: [],
      loading: false,
      fileList: [],
      fileImg: [],
      allgods: [],
      listgods: [],
      lr_id: null,
      liveCode: null,
      live_status: 0,
      value: "",
      LiveCode: [],
      LiveBlackList: [],
      lr_Query: {
        lr_id: null,
        page: 1,
        size: 3
      },
      list_Query: {
        live_room_id: null,
        page: 1,
        size: 10,
        prize_id:''
      },
      temp: {
        type: "1",
        img_url: undefined,
        head_img: undefined,
        link: undefined,
        remark: undefined,
        sort: undefined
      },
      getLiveBlack: {
        page: 1,
        size: 5,
        live_room_id: null
      },
      black_Query: {
        live_room_id: null,
        customer_id: null
      },
      removeBlack_Query: {
        live_room_id: null,
        customer_id: null
      },
      tableKey: 0,
      tableKey1: 0,
      tableKey2: 0,
      listQuery: {
        user_nickname: undefined,
        page:1,
        page_size:10,
        phone: undefined,
      },
      allPageCount:2,
      searchQuery: {
        lr_id: null,
        is_sale: 1,
        goods_name: "asdfghjkl"
      },
      addInfo: {
        lr_id: null,
        shop_goods_id: null,
        goods_introduce: ""
      },
      deleteInfo: {
        lr_id: null,
        shop_goods_id: null
      },
      broadCast: {
        page: 1,
        size: 10,
      },
      shopGodsQuery: {
        lr_id: null,
        is_sale: 1,
        goods_name: null
      },
      godsMasterPush: {
        live_room_id: null,
        master_push: null,
        shop_goods_id: null
      },
      changeIntroduceInfo: {
        lr_id: null,
        goods_introduce: "",
        shop_goods_id: null
      },
      shopGods: [],
      shopSku: [],
      selectGods: { shop_goods_common_id: null },
      selectSku: null,
      changeBroadcastInfo: {
        title: null,
        room_img: null,
        head_img: null,
        anchor_id: null,
        desc: null,
        follow_count: null,
        look_count: null,
        nickname: null,
        live_notice: null,
        next_live_time: "",
        random_yellow_car: null,
        type: "anchor"
      },
      head_img: "",
      img_url: "",
      random_yellow_car: null,
      searchPhone: null,
      customer_phone: null,
      customer_state: [],
      customer_id: null,
      customer_title: "",
      follow_count: null,
      look_count: null,
      next_live_time: "",
      fullOptions: [],
      broadcasts: [],
      dialogImageUrl: "",
      dialogVisible: undefined,
      inshows: {
        live_room_id : undefined,
        draw_status : undefined
      },
      inshow: {
        anchor_id: undefined,
        status: undefined
      },
      broadcastStream: {
        pushUrl: null,
        stream_key_push: null
      },
      liveVideo: {
        lr_id: null,
        type: "many",
        page: 1,
        size: 3
      },
      deleteVideoInfo: {
        lr_id: null,
        video_id: null
      },
      live_room_id:undefined,
      dialogCoupon: false,
      dialogCouponIn: false,
      dialogStatus: "",
      dialogStatusIn: "",
      listLoading: true,
      list: null,
      total: null,
      total1: null,
      total2: null,
      total3: null,
      pickerOptions2: {},
      dialogGrant: false,
      goodsOptions: [],
      draw_status:'',
      distributionLevelOptions: [],
      videolist: [],
      danmuRoomId: {
        live_room_id: null
      },
      ids:undefined,
      loadingPeople: false
    };

  },
  created(){
    this.getList();
    this.getBroadcast();
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '实物',
          2: '优惠券',
          3: '金贝',
          4: '银贝'
        }
        return statusMap[status]
      },
    },
    methods: {
      handfills(parmas){
        if(parmas == 1){
            this.yhj = false
            this.jb = false
            this.yb = false
        }else if(parmas == 2){
            this.yhj = true
            this.jb = false
            this.yb = false
        }else if(parmas == 3){
            this.yhj = false
            this.jb = true
            this.yb = false
        }
        else if(parmas == 4){
            this.yhj = false
            this.jb = false
            this.yb = true
        }
      },
      handsrool(parmas){
        if(parmas == 1){
            this.xgyhj = false
            this.xgjb = false
            this.xgyb = false
        }else if(parmas == 2){
            this.loginFormls.draw = ''
            this.xgyhj = true
            this.xgjb = false
            this.xgyb = false
        }else if(parmas == 3){
           this.loginFormls.draw = ''
            this.xgyhj = false
            this.xgjb = true
            this.xgyb = false
        }
        else if(parmas == 4){
            this.loginFormls.draw = ''
            this.xgyhj = false
            this.xgjb = false
            this.xgyb = true
        }
      },
    //中奖列表弹窗关闭事件
    handdelets(){
        this.list_Query.prize_id = ''
    },
    //中奖列表列表搜索事件
    handleFilters() {
      this.list_Query.page = 1;
      this.zhongjiang(this.roos);
    },
    //中奖纪录列表
    zhongjiang(row){
       this.roos = row
       this.dialogCouponsl = true
       this.listLoadPrize = true
       this.list_Query.live_room_id = row.live_room.id
       getPrizeList({live_room_id:row.live_room.id}).then(res=>{
             this.optionsl = res.data
       })
       getWinnerDrawRecordList(this.list_Query).then(res=>{
         this.datas = res.data.data
         this.totals = res.data.total
         this.listLoadPrize = false
       })
    },
    //获取转盘商品列表
    getposts(row) {
      this.listLoadingZP = true
      this.data = row
      this.live_room_id = this.data.live_room.id;
      this.dialogCoupons = true;
      getDrawPrizeList({live_room_id:row.live_room.id}).then(res => {
        this.dataList = res.data;
        this.listLoadingZP = false
        if(this.dataList.draw_type == 1){
           this.dataList.draw_type = "实物"
        }else if(this.dataList.draw_type == 2){
           this.dataList.draw_type = "优惠券"
        }else if(this.dataList.draw_type == 3){
           this.dataList.draw_type = "金贝"
        }else if(this.dataList.draw_type == 4){
           this.dataList.draw_type = "银贝"
        }
      });
    },
    //添加弹窗
    handleCreate() {
      this.innerVisibles = true;
      this.loginForm = {}
      this.fileLists = [];
      this.yhj = false,
      this.jb = false
      this.yb = false
    },
    //添加确定事件
    praevsorsl() {
      this.loginForm.live_room_id = this.live_room_id
      createDrawPrize(this.loginForm).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 1000
          });
        }
        this.innerVisibles = false;
        this.getposts(this.data)
      });
    },
    //修改事件
    praevsors(row) {
      if(this.loginFormls.draw_type == '实物'){
        this.loginFormls.draw_type = 1
      }else if(this.loginFormls.draw_type == '优惠券'){
        this.loginFormls.draw_type = 2
      }
      else if(this.loginFormls.draw_type == '金贝'){
        this.loginFormls.draw_type = 3
      }
      else if(this.loginFormls.draw_type == '银贝'){
        this.loginFormls.draw_type = 4
      }
      updateDrawPrizeInfo(this.loginFormls).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 1000
          });
        }
        this.innerVisible = false;
        this.getposts(this.data)
      });
    },
    //添加弹窗关闭时候的回调事件
    handroos() {
      this.loginForm = {}
      this.fileLists = [];
    },
    //限制图片只传一张
    handleExceed1() {
        this.$message.error('主图限制上传一张')
      },
    //转盘修改
    handleEditSet(row) {
      this.innerVisible = true;
      findDrawPrizeInfo({ id: row.id }).then(res => {
        this.loginFormls = res.data;
        if(this.loginFormls.draw_type == 1){
           this.loginFormls.draw_type = "实物"
        }else if(this.loginFormls.draw_type == 2){
           this.loginFormls.draw_type = "优惠券"
        }else if(this.loginFormls.draw_type == 3){
           this.loginFormls.draw_type = "金贝"
        }else if(this.loginFormls.draw_type == 4){
           this.loginFormls.draw_type = "银贝"
        }
        if(this.loginFormls.draw_type == '实物'){
           this.xgyhj = false
           this.xgjb= false
           this.xgyb =false
        }else if(this.loginFormls.draw_type == '优惠券'){
           this.xgyhj = true
           this.xgjb= false
           this.xgyb =false
        }
        else if(this.loginFormls.draw_type == '金贝'){
           this.xgyhj = false
           this.xgjb= true
           this.xgyb =false
        }
        else if(this.loginFormls.draw_type == '银贝'){
           this.xgyhj = false
           this.xgjb= false
           this.xgyb =true
        }
        this.fileLists = [
          {
            url: row.prize_img
          }
        ];
      });
    },
    //创建图片上传成功获取地址
     handleUpsl(response, file, fileList) {
      this.loginForm.prize_img = response.data.url;
    },
    // 修改图片上传成功获取地址
    handleUprs(response, file, fileList) {
      this.loginFormls.prize_img = response.data.url;
    },
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
    //图片移除钩子函数
    handleRemoves(file, fileList) {},
    //获取直播间商品
    getLiveGods() {
      this.listLoading = true;
      this.lr_Query.lr_id = this.lr_id;
      getLiveGods(this.lr_Query)
        .then(response => {
          this.listgods = response.data.data;
          this.listLoading = false;
          this.total1 = response.data.total;
        })
        .catch(e => {
          this.listgods = [];
          this.listLoading = false;
        });
    },
    toPreve(){
      this.loadingPeople = true;
      this.list = []
      this.listQuery.page--
      getCustomerShopList(this.listQuery).then(response => {
        this.list = response.data.data
        if(this.listQuery.page <= 1){
          this.listQuery.page = 1
        }
        this.tableKey--;
        this.loadingPeople = false;
      })
    },

    toNext(){
      this.loadingPeople = true;
      this.list = []
      this.listQuery.page++
      getCustomerShopList(this.listQuery).then(response => {
        this.allPageCount = response.data.last_page
        this.list = response.data.data
        this.tableKey++;
        this.loadingPeople = false;
      })
    },
    getList() {
      getCustomerShopList(this.listQuery).then(response => {
        this.list = response.data.data
        this.tableKey++;
        this.listLoading = false;
      });
    },
    //搜索商品
    remoteMethod(query) {
      let word = query;
      if (word === undefined || word === null || word === "") {AAA
        this.shopGods = [];
        return;
      }
      this.shopGodsQuery.goods_name = word;
      this.getShopGods();
    },
    //获取商品列表
    getShopGods() {
      this.shopGodsQuery.lr_id = this.lr_id;
      getShopGoodsCommonList(this.shopGodsQuery).then(response => {
        // console.log(this.shopGodsQuery)
        this.shopGods = response.data.data;
        // console.log(this.shopGods)
      });
    },
    //修改红字打开弹出层
    changeIntroduce(row) {
      this.dialogCouponIn = true;
      this.dialogStatusIn = "word";
      this.changeIntroduceInfo.lr_id = row.lr_id;
      this.changeIntroduceInfo.shop_goods_id = row.shop_goods_id;
    },
    //修改红字
    getNewIntroduce() {
      if (
        this.changeIntroduceInfo.goods_introduce === "" ||
        this.changeIntroduceInfo.goods_introduce === null ||
        this.changeIntroduceInfo.goods_introduce === undefined
      ) {
        delete this.changeIntroduceInfo.goods_introduce;
      }
      // console.log(this.changeIntroduceInfo)
      changeIntroduce(this.changeIntroduceInfo).then(response => {
        if (response.code === 200) {
          this.dialogCouponIn = false;
          this.getLiveGods();
          this.changeIntroduceInfo.goods_introduce = "";
        }
      });
    },
    //打开内层弹出框
    addShopGods() {
      this.dialogCouponIn = true;
      this.dialogStatusIn = "gods";
      // this.getShopGods()
      this.remoteMethod();
    },
    //关闭内层弹出框
    dialogCouponInClose() {
      this.selectGods.shop_goods_common_id = null;
      this.searchQuery.goods_name = "";
      this.shopGods = [];
      this.selectSku = null;
      this.shopSku = [];
      this.list = [];
      this.black_Query.customer_id = null;
      this.listQuery.user_nickname = "";
      this.LiveBlackList = [];
      this.getLiveBlack.page = 1;
      this.danmuList = [];
      this.listQuery.page = 1
      this.allPageCount = 2
    },
    //选取商品
    getSelectGods() {
      if (
        this.selectGods.shop_goods_common_id === null ||
        this.selectGods.shop_goods_common_id === "" ||
        this.selectGods.shop_goods_common_id === undefined
      ) {
        this.shopGods = [];
        this.shopSku = [];
        return;
      } else {
        this.getSkuInfo();
        this.selectSku = null;
      }
      // if(this.selectGods.shop_goods_common_id !== null){
      //   this.getSkuInfo()
      //   this.selectSku = null
      // }
    },
    //选择主推商品
    masterGods(row) {
      this.godsMasterPush.live_room_id = row.lr_id;
      this.godsMasterPush.master_push = row.master_push;
      this.godsMasterPush.shop_goods_id = row.shop_goods_id;
      masterPush(this.godsMasterPush)
        .then(response => {
          if (response.code === 200) {
            this.$notify({
              title: "成功",
              message: response.data,
              type: "success",
              duration: 1000
            });
          }
        })
        .catch(e => {
          if (e === "error") {
            this.godsMasterPush.master_push = 0;
            this.getLiveGods();
          }
        });
    },
    //获取sku
    getSkuInfo() {
      getALLGods(this.selectGods).then(response => {
        this.shopSku = response.data;
        for (let i = 0; i < this.shopSku.length; i++) {
          this.$set(this.shopSku[i], "isdisable", false);
          if (this.shopSku[i].stock === 0) {
            this.shopSku[i].isdisable = true;
          }
          let arr = [];
          let sku = "";
          for (let k in this.shopSku[i].species_value) {
            arr.push(this.shopSku[i].species_value[k]);
            sku = arr.join(",");
          }
          this.$set(this.shopSku[i], "sku", sku);
        }
        this.selectSku = null;
      });
    },
    //选择sku
    getSelectSku() {
      // console.log(this.selectSku)
    },
    //跳转分享直播间海报
    gotoPoster(row) {
      let add = JSON.parse(localStorage.getItem("lr_id"));
      if (add === null || add.length === 0) {
        localStorage.setItem("lr_id", JSON.stringify(row.lr_id));
      } else {
        localStorage.lr_id = row.lr_id;
      }
      let video = localStorage.getItem("video");
      if (video === null || video.length === 0) {
        localStorage.setItem("video", null);
      } else {
        localStorage.video = null;
      }
      let poster = localStorage.getItem("poster");
      if (video === null || video.length === 0) {
        localStorage.setItem("poster", "live");
      } else {
        localStorage.poster = "live";
      }
      this.$router.push({
        name: "poster"
      });
    },
    //获取直播列表
    getBroadcast() {
      this.listLoading = true;
      getBroadcast(this.broadCast).then(response => {
        this.broadcasts = response.data;
        console.log(this.broadcasts,33333)
        this.total = response.data.length;
        this.tableKey++;
        this.listLoading = false;
      });

    },
       // 转盘开关
    handleSwitchs(row) {
      this.inshows.live_room_id  = row.live_room.id;
      this.inshows.draw_status = row.live_room.draw_status
      updatePrizeStatus(this.inshows).then(response => {
        this.$notify({
          title: "申请成功",
          message: '申请成功',
          type: "success",
          duration: 1000
        });
      });
    },
    //直播间关联商品
    Aboutgoods(row) {
      this.dialogCoupon = true;
      this.dialogStatus = "gods";
      this.lr_id = row.live_room.id;
      this.getLiveGods();
      this.getShopGods();
    },
    //删除直播间关联商品
    deleteToLive(row) {
      if (this.listgods.length === 1) {
        this.lr_Query.page--;
      }
      this.deleteInfo.lr_id = row.lr_id;
      this.deleteInfo.shop_goods_id = row.shop_goods_id;
      deleteToLive(this.deleteInfo).then(response => {
        // console.log(response)
        if (response.code === 200) {
          this.$notify({
            title: "删除成功",
            message: "成功",
            type: "success",
            duration: 1000
          });
          this.getLiveGods();
        } else {
          this.$notify({
            title: "删除失败",
            message: "失败",
            type: "error",
            duration: 1000
          });
        }
      });
    },
    //获取直播流二维码
    getLiveCode() {
      getLiveCode({ anchor_id: this.changeBroadcastInfo.anchor_id }).then(
        response => {
          if (response.code === 200) {
            this.liveCode = response.data;
          }
        }
      );
    },
    //搜索商品
    searchGods() {
      this.listLoading = true;
      this.searchQuery.lr_id = this.lr_id;
      getShopGoodsCommonList(this.searchQuery).then(response => {
        this.shopGods = response.data.data;
        this.listLoading = false;
        // console.log(this.allgods)
      });
      // this.searchQuery.goods_name = ''
    },
    //前往弹幕列表
    gotoDanmuList() {
      let room_id = JSON.parse(localStorage.getItem("room_id"));
      if (room_id === null || room_id.length === 0) {
        localStorage.setItem("room_id", this.danmuRoomId.room_id);
      } else {
        localStorage.room_id = this.danmuRoomId.room_id;
      }
      this.$router.push({
        name: "danmuList"
      });
      this.dialogCoupon = false;
    },
    //搜索用户
    searchPeople(query) {
      this.loadingPeople = true;
      let word = query;
      if (word === null || word === undefined || word === "") {
        this.list = [];
        this.loadingPeople = false;
        return;
      }
      this.listQuery.user_nickname = query;
      getCustomerShopList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.loadingPeople = false;
      });
    },
    //获取直播间黑名单
    getLiveBlackList() {
      getLiveBlackList(this.getLiveBlack)
        .then(response => {
          if (response.code === 200) {
            this.LiveBlackList = response.data.data;
            console.log(this.LiveBlackList,555555)
            this.total3 = response.data.total;
            this.tableKey1++;
            // console.log(this.total3)
            this.listLoading = false;
          } else {
            // console.log(122223)
          }
        })
        .catch(e => {
          this.LiveBlackList = [];
        });
    },
    //直播间添加黑名单
    addBlackList() {
      pullBlackList(this.black_Query).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: "拉黑成功",
            message: response.data,
            type: "success",
            duration: 1000
          });
          this.getLiveBlackList();
          this.black_Query.customer_id = null;
          this.listQuery.user_nickname = "";
        } else {
          this.$notify({
            title: "拉黑失败",
            message: response.data,
            type: "error",
            duration: 1000
          });
        }
      });
    },
    //直播间解除黑名单
    outBlackList(row) {
      if (this.LiveBlackList.length === 1) {
        this.getLiveBlack.page--;
      }
      this.removeBlack_Query.customer_id = row.customer_id;
      this.removeBlack_Query.live_room_id = row.live_room_id;
      removeBlackList(this.removeBlack_Query).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: "移除成功",
            message: "该用户已解除黑名单",
            type: "success",
            duration: 1000
          });
          this.getLiveBlackList();
        }
      });
    },
    //直播间添加商品
    addLiveGods() {
      this.addInfo.lr_id = this.lr_id;
      this.addInfo.shop_goods_id = this.selectSku;
      if (
        this.addInfo.shop_goods_id === "" ||
        this.addInfo.shop_goods_id === "undefined" ||
        this.addInfo.shop_goods_id === null
      ) {
        this.$notify({
          title: "添加失败",
          message: "失败",
          type: "error",
          duration: 1000
        });
        return;
      }
      addToLive(this.addInfo).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: "添加成功",
            message: "成功",
            type: "success",
            duration: 1000
          });

          this.getLiveGods();
          this.searchQuery.goods_name = "";
          this.addInfo.goods_introduce = "";
          this.selectGods.shop_goods_common_id = null;
          this.shopGods = [];
          this.selectSku = null;
          this.shopSku = [];
          this.getShopGods();
        } else {
          this.$notify({
            title: "添加失败",
            message: "添加失败",
            type: "error",
            duration: 1000
          });
        }
      });
    },
    //选择直播信息
    gotoVideo(row) {
      this.dialogCoupon = true;
      this.dialogStatus = "live";
      let add = JSON.parse(localStorage.getItem("lr_id"));
      if (add === null || add.length === 0) {
        localStorage.setItem("lr_id", JSON.stringify(row.lr_id));
      } else {
        localStorage.lr_id = row.lr_id;
      }
      this.liveVideo.lr_id = localStorage.lr_id;
      getLiveVideoList(this.liveVideo)
        .then(response => {
          this.videolist = response.data.data;
          this.total2 = response.data.total;
        })
        .catch(e => {});
    },
    //添加直播视频
    addVideo() {
      this.$router.push({
        name: "videoList"
      });
      this.dialogCoupon = false;
    },
    //删除直播视频
    deleteVideo(row) {
      if (this.videolist.length === 1 && this.liveVideo.page > 1) {
        this.liveVideo.page--;
      }
      this.deleteVideoInfo.lr_id = row.lr_id;
      this.deleteVideoInfo.video_id = row.video_id;
      deleteVideoInfo(this.deleteVideoInfo).then(response => {
        // console.log(response)
        if (response.code === 200) {
          this.$notify({
            title: "删除成功",
            message: response.data,
            type: "success",
            duration: 1000
          });
          getLiveVideoList(this.liveVideo)
            .then(response => {
              console.log(this.liveVideo);
              this.videolist = response.data.data;
              this.total2 = response.data.total;
            })
            .catch(e => {});
        }
      });
    },
    //视频海报管理
    gotoVideoPoster(row) {
      let add = JSON.parse(localStorage.getItem("lr_id"));
      if (add === null || add.length === 0) {
        localStorage.setItem("lr_id", JSON.stringify(row.lr_id));

      } else {
        localStorage.lr_id = row.lr_id;
      }
      let video = localStorage.getItem("video");
      if (video === null || video.length === 0) {
        localStorage.setItem("video", JSON.stringify(row.video_id));
      } else {
        localStorage.video = row.video_id;
      }
      let poster = localStorage.getItem("poster");
      if (poster === null || poster.length === 0) {
        localStorage.setItem("poster", "video");
      } else {
        localStorage.poster = "video";
      }
      this.$router.push({
        name: "poster"
      });
      this.dialogCoupon = false;
    },
    //编辑修改
    choose(row) {
      this.dialogCoupon = true;
      this.dialogStatus = "change";
      if (
        row.customer_shop === null ||
        row.customer_shop === undefined ||
        row.customer_shop === ""
      ) {
        this.customer_phone = "暂无信息";
      } else {
        this.customer_phone = row.customer_shop.phone;
      }
      if (row.live_room.status === 1) {
        this.live_status = 1;
        getliveStream({ anchor_id: row.id }).then(response => {
          // console.log(response)
          this.broadcastStream = response.data.push_stream;
        });
      }
      this.random_yellow_car = row.live_room.random_yellow_car;
      this.getLiveBlack.live_room_id = row.id;
      this.black_Query.live_room_id = row.id;
      this.changeBroadcastInfo.live_notice = row.live_room.live_notice;
      this.next_live_time = row.live_room.next_live_time;
      this.head_img = row.head_img;
      this.img_url = row.live_room.room_img;
      this.changeBroadcastInfo.nickname = row.nickname;
      this.changeBroadcastInfo.desc = row.desc;
      this.customer_title = row.live_room.title;
      this.changeBroadcastInfo.anchor_id = row.id;
      this.follow_count = row.live_room.follow_count;
      this.look_count = row.live_room.look_count;
      this.danmuRoomId.room_id = row.lr_id;
      this.getLiveCode();
    },
    //重置
    dialogClose() {
      this.customer_phone = null;
      this.broadcastStream = {};
      this.fileList = [];
      this.customer_title = "";
      this.follow_count = null;
      this.fileImg = [];
      this.live_status = 0;
      this.temp.head_img = "";
      this.temp.img_url = "";
      this.dialogCoupon = false;
      this.head_img = "";
      this.img_url = "";
      this.changeBroadcastInfo.head_img = "";
      this.changeBroadcastInfo.room_img = "";
      (this.changeBroadcastInfo.next_live_time = ""),
        (this.selectGods.shop_goods_common_id = null);
      this.shopGods = [];
      this.selectSku = null;
      this.shopSku = [];
      this.addInfo.goods_introduce = "";
      this.lr_Query.page = 1;
      this.list = [];
      this.black_Query.customer_id = null;
      this.listQuery.user_nickname = "";
      this.LiveBlackList = [];
      this.random_yellow_car = null;
      this.liveVideo.page = 1;
      this.getLiveBlack.page = 1;
      this.next_live_time = "";
      this.danmuList = [];
      this.listQuery.page = 1;
      this.allPageCount = 2;
    },
    //搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.broadCast.page = 1;
      this.getList();
      // this.dialogStatus = 'search'
      // this.dialogCoupon = true
      this.getBroadcast();
    },
    // 状态开关
    handleSwitch(row) {
      this.inshow.anchor_id = row.id;
      this.inshow.status = row.live_room.status;
      // console.log(this.inshow)
      beginshow(this.inshow).then(response => {
        this.$notify({
          title: "申请成功",
          message: response.data,
          type: "success",
          duration: 1000
        });
      });
    },

    //图片修改
    handlePictureCardPreviews(file) {
      // console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePicture(img_url) {
      this.dialogImageUrl = img_url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.temp.img_url = "";
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    handleUp(response, file, fileList) {
      // console.log(file)
      this.temp.img_url = response.data.url;
      // this.temp.img_url = file.url
      // console.log(this.temp)
    },
    //图片修改
    handlePictureCardPreview1(file) {
      // console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePicture1(img_url) {
      this.dialogImageUrl = img_url;
      this.dialogVisible = true;
    },
    handleRemove1() {
      this.temp.head_img = "";
    },
    beforeAvatarUpload1(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    handleUp1(response, file, fileList) {
      // console.log(file)
      this.temp.head_img = response.data.url;
      // this.temp.img_url = file.url
      // console.log(this.temp)
    },
    //查看黑名单
    getBlackList() {
      this.dialogCouponIn = true;
      this.dialogStatusIn = "blacklist";
      // this.getList()
      this.list = [];
      this.searchPeople();
      this.getLiveBlackList();
    },
    changeRandom() {
      // console.log(this.random_yellow_car)
    },
    // 创建
    create() {
      this.dialogStatus = "create";
      this.dialogCoupon = true;
      // this.resetemp()
      // this.$nextTick(() => {
      //   this.$refs['dateForm'].clearValidate()
      // })
    },
    // 创建确定
    createData() {
      getCustomerShopList().then(response => {
        this.list = response.data.data;
        this.customer_state = this.list.some(item => {
          return item.phone / 1 === this.customer_phone / 1;
        });
        if (this.customer_state === true) {
          let customer = this.list.filter(item => {
            if (this.customer_phone / 1 === item.phone / 1) {
              return true;
            }
            return false;
          });
          this.customer_id = customer[0].customer_id;
          createRoom({ customer_id: this.customer_id }).then(response => {
            if (response.code === 200) {
              this.$notify({
                title: "申请成功",
                message: "成功",
                type: "success",
                duration: 1000
              });
            }
            this.dialogCoupon = false;
            this.$nextTick(() => {
              this.getBroadcast();
            });
          });
        } else {
          this.$notify({
            title: "找不到该手机号",
            message: "请重新输入",
            type: "error",
            duration: 1000
          });
          this.customer_phone = null;
        }
      });
    },
    // 编辑确定
    // updateData() {
    //   this.$refs['dateForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.shop_coupon_id = this.shop_coupon_id
    //       updateShopCoupon(tempData).then(response => {
    //         this.getList()
    //         this.dialogCoupon = false
    //         this.$notify({
    //           title: '成功',
    //           message: '更新成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    //修改信息
    changeInfo() {
      if (
        this.temp.head_img === "" ||
        this.temp.head_img === undefined ||
        this.temp.head_img === null
      ) {
        this.changeBroadcastInfo.head_img = this.head_img;
      } else {
        this.changeBroadcastInfo.head_img = this.temp.head_img;
      }
      if (
        this.temp.img_url === "" ||
        this.temp.img_url === undefined ||
        this.temp.img_url === null
      ) {
        this.changeBroadcastInfo.room_img = this.img_url;
      } else {
        this.changeBroadcastInfo.room_img = this.temp.img_url;
      }
      if (
        this.changeBroadcastInfo.live_notice === "" ||
        this.changeBroadcastInfo.live_notice === undefined ||
        this.changeBroadcastInfo.live_notice === null
      ) {
        delete this.changeBroadcastInfo.live_notice;
      }
      if (
        this.next_live_time === "" ||
        this.next_live_time === undefined ||
        this.next_live_time === null
      ) {
        delete this.changeBroadcastInfo.next_live_time;
      } else {
        this.changeBroadcastInfo.next_live_time = this.next_live_time;
      }
      if (
        this.customer_title === "" ||
        this.customer_title === undefined ||
        this.customer_title === null
      ) {
        delete this.changeBroadcastInfo.title;
      } else {
        this.changeBroadcastInfo.title = this.customer_title;
      }
      this.changeBroadcastInfo.random_yellow_car = this.random_yellow_car;
      this.changeBroadcastInfo.follow_count = this.follow_count;
      this.changeBroadcastInfo.look_count = this.look_count;
      changeInfo(this.changeBroadcastInfo)
        .then(response => {
          if (response.code === 200) {
            this.$notify({
              title: "修改成功",
              message: response.data,
              type: "success",
              duration: 2000
            });
            this.changeBroadcastInfo.live_notice = null;
            this.changeBroadcastInfo.next_live_time = "";
            this.changeBroadcastInfo.head_img = "";
            this.changeBroadcastInfo.room_img = "";
            this.temp.img_url = "";
            this.temp.head_img = "";
            this.head_img = "";
            this.img_url = "";
            this.dialogCoupon = false;
            this.getBroadcast();
          } else {
            this.$notify({
              title: "修改失败",
              message: response.data,
              type: "error",
              duration: 2000
            });
            this.changeBroadcastInfo.title = null;
            this.changeBroadcastInfo.live_notice = null;
            this.changeBroadcastInfo.next_live_time = "";
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 分页
      handleCurrentChangesls(val) {
      this.list_Query.page = val;
      this.zhongjiang(this.roos);
    },
      handleSizeChangesls(val) {
      this.list_Query.size = val;
      this.zhongjiang(this.roos);
    },
    handleSizeChange(val) {
      this.broadCast.size = val;
      this.getBroadcast();
    },
    handleCurrentChange(val) {
      this.broadCast.page = val;
      this.getBroadcast();
    },
    handleSizeChange1(val) {
      this.lr_Query.size = val;
      this.getLiveGods();
    },
    handleCurrentChange1(val) {
      this.lr_Query.page = val;
      this.getLiveGods();
    },
    handleSizeChange2(val) {
      this.listLoading = true;
      this.liveVideo.size = val;
      this.liveVideo.lr_id = localStorage.lr_id;
      getLiveVideoList(this.liveVideo).then(response => {
        this.videolist = response.data.data;
        this.listLoading = false;
      });
    },
    handleCurrentChange2(val) {
      this.listLoading = true;
      this.liveVideo.page = val;
      this.liveVideo.lr_id = localStorage.lr_id;
      getLiveVideoList(this.liveVideo).then(response => {
        this.videolist = response.data.data;
        this.listLoading = false;
      });
    },
    handleSizeChange3(val) {
      this.listLoading = true;
      this.getLiveBlack.size = val;
      this.getLiveBlackList();
    },
    handleCurrentChange3(val) {
      this.listLoading = true;
      this.getLiveBlack.page = val;
      this.getLiveBlackList();
    }
  }
};
</script>

<style scoped>
.search {
  width: 500px;
  display: flex;
  justify-content: space-between;
}
.upload{
  margin-left: 78px;
}
.getPage{
  display:flex;
  justify-content: space-around;
  align-items: center;
  height:20px;
  margin-top:5px;
}
.prevePage{
  color:cornflowerblue;
  font-size:14px;
}
.nextPage{
  color:cornflowerblue;
  font-size:14px;
}


</style>
