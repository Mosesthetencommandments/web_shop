<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select
        class="filter-item"
        style="width: 200px"
        @change="handleFilter"
        v-model="listQuery.brand_id"
        filterable
        clearable
        remote
        placeholder="选择品牌"
        :remote-method="getBrandList"
        :loading="brandLoading"
      >
        <el-option
          v-for="item in brandOptions"
          :key="item.id"
          :label="item.brand_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        class="filter-item"
        style="width: 200px"
        @change="handleFilter"
        v-model="listQuery.group_id"
        filterable
        clearable
        remote
        placeholder="选择分组"
        :remote-method="getShopGoodsGroupList"
        :loading="groupLoading"
      >
        <el-option
          v-for="item in groupOptions"
          :key="item.id"
          :label="item.group_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        class="filter-item"
        placeholder="商品名称"
        v-model="listQuery.goods_name"
      ></el-input>
      <el-select
        @change="handleFilter"
        style="width: 120px"
        class="filter-item"
        v-model="listQuery.sort"
        placeholder="排序"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select
        @change="handleFilter"
        style="width: 120px"
        class="filter-item"
        v-model="listQuery.is_sale"
        clearable
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="el-icon-edit"
      >添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
      stripe
    >
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="商品主图">
        <template slot-scope="scope">
          <img
            v-if="scope.row.main_images_default !== null "
            @click="handlePictureCardPreview1(scope.row)"
            style="width: 100px;height: 100px;"
            :src="scope.row.main_images_default"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="商品名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="75" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.is_sale | TypeStatusFilter"
          >{{scope.row.is_sale | TypeStatusTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="400" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <!--<el-button type="danger" size="mini">删除</el-button>-->
          <el-button type="success" 　size="mini" @click="handleSet(scope.row)">规格设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--规格设置弹出-->
    <el-dialog title="规格设置" :visible.sync="dialogSet" width="80%">
      <template>
        <el-table
          :key="tableKey1"
          :data="list1"
          v-loading="listLoading1"
          :row-class-name="tableRowClassName"
          element-loading-text="给我一点时间"
          border
        >
          <el-table-column prop="specDetails" label="规格明细" width="160" align="center">
            <template slot-scope="scope">
              <span
                v-for="(item, i) in scope.row.species_value"
                :key="i"
                class="link-type"
              >{{ item + ', ' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="specPic" label="规格缩略图主图" min-width="120" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.image_thumb !== null "
                @click="handlePictureCardPreview2(scope.row)"
                style="width: 100px;height: 100px;"
                :src="scope.row.image_thumb"
                alt
              />
              <!--<img :src="scope.row.image_thumb" alt="" style="width: 100px;height: 100px;">-->
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="原价" align="center" min-width="80">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.origin_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="actual_price" label="实际售价" align="center" min-width="80">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.actual_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="assemble_price" label="拼团售价" align="center" min-width="80">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.assemble_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="分销售价" align="center" min-width="80">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.distribution_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" align="center" min-width="500">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                :active-value="1"
                @change="handleSwitch(scope.row)"
                :inactive-value="0"
                inactive-color="#ff4949"
              ></el-switch>
              <el-button
                type="primary"
                　size="mini"
                :visible.sync="dialogSetEdit"
                @click="handleEditSet(scope.row)"
              >编辑</el-button>
              <el-button
                type="warning"
                　size="mini"
                style="margin-top: 10px;"
                @click="handleUpdateShopGoodsDetail(scope.row)"
              >仓库商品明细</el-button>
              <el-button
                type="success"
                　size="mini"
                style="margin-top: 10px;"
                @click="handleUpdateDistributionRule(scope.row)"
              >分佣规则明细</el-button>
              <el-button
                type="success"
                　size="mini"
                style="margin-top: 10px;"
                @click="handleUpdateDistriduihuan(scope.row)"
              >积分商品兑换</el-button>
              <!-- <el-button type="success"　size="mini" style="margin-top: 10px;" @click="handleUpdatePriceDetails(scope.row)">会员价格明细</el-button> -->
              <!-- <el-button type="info"　size="mini" style="margin-top: 10px;" @click="handleUpdateDistributionPriceDetails(scope.row)">分销价格明细</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!--操作会员价格明细弹出-->
    <el-dialog :visible.sync="dialogPriceDetails">
      <template>
        <el-table
          :key="tableKeyPrice"
          :data="priceDetailsList"
          v-loading="PriceLoading"
          element-loading-text="给我一点时间"
          border
        >
          <el-table-column label="会员等级" min-width="200px;" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.member_level_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center" min-width="400px">
            <template slot-scope="scope">
              <template v-if="scope.row.edit_add">
                <el-input-number v-model="scope.row.price" controls-position="right" :min="0"></el-input-number>
                <el-button
                  class="inline-btn"
                  v-if="scope.row.edit_add"
                  type="success"
                  @click="confirmEditAdd(scope.row)"
                  size="small"
                  icon="el-icon-circle-check-outline"
                >完成</el-button>
                <el-button
                  class="inline-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEditAdd(scope.row)"
                >取消</el-button>
              </template>
              <template v-else>
                <span
                  v-if="scope.row.price"
                  class="link-type"
                  style="padding:2px 70px;"
                  @click="openEdit(scope.row, "edit_add")"
                >{{ scope.row.price }}</span>
                <span
                  v-else
                  class="link-type"
                  style="padding:2px 70px;"
                  @click="openEdit(scope.row, "edit_add")"
                >添加</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!--操作分销价格明细-->
    <el-dialog :visible.sync="dialogDistributionPriceDetails">
      <template>
        <el-table
          :key="tableKeyDistribution"
          :data="distributionpriceDetailsList"
          v-loading="distributionPriceLoading"
          element-loading-text="给我一点时间"
          border
        >
          <el-table-column label="分销等级" min-width="200px;" align="center">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.distribution_level_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center" min-width="400px">
            <template slot-scope="scope">
              <template v-if="scope.row.edit_add">
                <el-input-number v-model="scope.row.price" controls-position="right" :min="0"></el-input-number>
                <el-button
                  class="inline-btn"
                  v-if="scope.row.edit_add"
                  type="success"
                  @click="confirmEditAdd1(scope.row)"
                  size="small"
                  icon="el-icon-circle-check-outline"
                >完成</el-button>
                <el-button
                  class="inline-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEditAdd1(scope.row)"
                >取消</el-button>
              </template>
              <template v-else>
                <span
                  v-if="scope.row.price"
                  class="link-type"
                  style="padding:2px 70px;"
                  @click="openEdit1(scope.row, "edit_add")"
                >{{ scope.row.price }}</span>
                <span
                  v-else
                  class="link-type"
                  style="padding:2px 70px;"
                  @click="openEdit1(scope.row, "edit_add")"
                >添加</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!--规格设置编辑下弹出-->
    <el-dialog :visible.sync="dialogSetEdit" :title="textMap1[dialogStatus1]">
      <el-form
        :rules="rules"
        ref="dataPrice"
        :model="price1"
        label-position="left"
        label-width="80px"
        style="width: 90%; margin-left:5%;"
      >
        <el-form-item label="规格主图">
          <el-upload
            :action="baseUrl"
            list-type="picture-card"
            :file-list="fileList3"
            :on-success="handlePictureSuccess"
            :on-remove="handleRemove3"
            :on-exceed="handleExceed1"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            name="image"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="原价" prop="origin_price">
          <el-input v-model="price1.origin_price" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="实际售价" prop="actual_price">
          <el-input v-model="price1.actual_price" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="拼团售价" prop="assemble_price">
          <el-input v-model="price1.assemble_price" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="分销售价" prop="distribution_price">
          <el-input v-model="price1.distribution_price" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="price1.stock" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="price1.weight" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="返金贝" prop="gold_shell">
          <el-input v-model="price1.gold_shell" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="返银贝" prop="silver_shell">
          <el-input v-model="price1.silver_shell" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="dialogSetEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateData1">确 定</el-button>
      </div>
    </el-dialog>
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
    <!--图片上传-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!--积分商品兑换-->
    <el-dialog :visible.sync="dialogSetEdits" title="积分商品兑换" @close="handelroos">
      <el-form
        ref="dataPrice"
        :model="pricels"
        label-position="left"
        label-width="80px"
        style="width: 90%; margin-left:5%;"
      >
        <el-form-item label="折扣价">
          <el-input v-model="pricels.integral_discount_price" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="actual_price">
          <el-input v-model="pricels.integral_price" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="dialogSetEdits = false">取 消</el-button>
        <el-button type="primary" @click="updateDatals">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible" width="50%" v-if="dialogFormVisible" >
      <el-tabs v-model="activeName" @tab-click="handleTabclick">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            :rules="rules"
            ref="dataForm1"
            :model="temp1"
            label-position="left"
            label-width="15%"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input placeholder="请输入商品名称" v-model="temp1.goods_name" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="所属品牌" prop="brand_id">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="temp1.brand_id"
                filterable
                clearable
                remote
                placeholder="选择品牌"
                :remote-method="getBrandList1"
                :loading="brandLoading"
              >
                <el-option
                  v-for="item in brandOptions1"
                  :key="item.id"
                  :label="item.brand_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运费模板" prop="freight_id">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="temp1.freight_id"
                filterable
                clearable
                remote
                placeholder="选择运费模板"
                :loading="freightTemplateLoading"
              >
                <el-option
                  v-for="item in freightTemplateOptions"
                  :key="item.id"
                  :label="item.template_name + '-' + item.remark"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="商品地址">
          <el-cascader
            size="large"
            :options="regionData"
            v-model="temp1.province"
            @change="handleRegionChange"
            :props="propsl"
            style="width:52%;">
          </el-cascader>
            </el-form-item>-->
            <el-form-item label="展示标题" prop="goods_title">
              <el-input placeholder="请输入展示标题" v-model="temp1.goods_title" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" class="filter-item">
              <el-cascader
                :options="classOptions"
                style="width: 100%"
                v-model="temp1.product_goods_category_id"
                :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="会员ID">
              <el-select v-model="temp1.member_id" style="width:300px" placeholder="请选择">
                <el-option
                  v-for="item in dataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原价" prop="origin_price">
              <el-input placeholder="请输入原价" v-model="temp1.origin_price" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="现价" prop="price">
              <el-input placeholder="请输入现价" v-model="temp1.price" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="团购价格" prop="assemble_price">
              <el-input placeholder="请输入团购价格" v-model="temp1.assemble_price" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="分销价格" prop="distribution_price">
              <el-input
                placeholder="请输入分销价格"
                v-model="temp1.distribution_price"
                style="width: 300px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="temp1.is_sale" size="small">
                <el-radio-button label="0">非在售</el-radio-button>
                <el-radio-button label="1">在售</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可用金贝购买">
              <el-radio-group v-model="temp1.if_gold_suitable" size="small">
                <el-radio-button :label="0">否</el-radio-button>
                <el-radio-button :label="1">是</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否为赠品">
              <el-radio-group v-model="temp1.is_gift" size="small">
                <el-radio-button :label="0">否</el-radio-button>
                <el-radio-button :label="1">是</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否推荐商品">
              <el-radio-group v-model="temp1.is_recommend" size="small">
                <el-radio-button :label="0">否</el-radio-button>
                <el-radio-button :label="1">是</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="可售后天数" label-width="15%" prop="after_sale_days">
              <el-input-number type="text" v-model="temp1.after_sale_days" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="已售件数" label-width="15%" prop="sold_count">
              <el-input-number type="text" v-model="temp1.sold_count" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="最高返佣" label-width="15%" prop="sold_count">
              <el-input-number type="text" v-model="temp1.max_rebate" :min="0"></el-input-number>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData('1')">确 定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="dialogStatus =='create'" label="图片信息" name="second">
          <el-form
            :rules="rules"
            ref="dataForm2"
            :model="temp2"
            label-position="left"
            label-width="15%"
          >
            <el-form-item label="商品主图">
              <el-upload
                :action="baseUrl"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove1"
                :file-list="fileList1"
                :on-exceed="handleExceed1"
                :before-upload="beforeAvatarUpload"
                :limit="1"
                name="image"
                :on-success="handleUp1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <span>只能上传jpg/png文件,图片大小不能超过2M</span>
            </el-form-item>




            <el-form-item label="商品轮播图">
              <el-upload
                :action="baseUrl"
                :file-list="fileList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-progress="handleOnProgress"
                :on-change='handerOnChange'
                :before-upload="beforeAvatarUpload"
                name="image"
                multiple
                :limit="20"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <span>只能上传jpg/png文件,图片大小不能超过2M</span>
              <template>
                <div
                  style="margin-top: 10px;"
                  v-for="(item, index) in fileList"
                  :key="index"
                >
                  <i class="el-icon-rank iconStyle"></i>
                  <div class="picName">{{item.name}}</div>
                </div>
              </template>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData('2')">确 定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="dialogStatus =='create'" label="商品详情" name="third">
          <el-form
            :rules="rules"
            ref="dataForm3"
            :model="temp3"
            label-position="left"
            label-width="15%"
            style="width: 100%;"
          >

            <el-form-item label="商品详情">
              <el-upload
                :action="baseUrl"
                name="image"
                :file-list="goodsCommonDetailList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleGoodsCommonDetailRemove"
                :before-upload="beforeAvatarUpload"
                :on-progress="handleGoodsCommonDetailProgress"
                :limit="20"
                multiple
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <span>只能上传jpg/png文件,图片大小不能超过2M(一次只能上传一张)</span>
              <template>
                <div
                  style="margin-top: 10px;"
                  v-for="(item, index) in goodsCommonDetailList"
                  :key="index"
                >
                  <i class="el-icon-rank iconStyle"></i>
                  <div class="picName">{{item.name}}</div>
                </div>
              </template>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData('3')">确 定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="dialogStatus =='create'" label="商品属性" name="four">
          <el-form
            :rules="rules"
            ref="dataForm4"
            :model="temp4"
            label-position="left"
            label-width="15%"
            style="width: 100%;"
          >
            <el-form-item label="属性设置">
              <template v-for="(item, index) in temp4.goods_attribute">
                <div style="margin-bottom:10px;">
                  <el-input v-model="item.label" style="width: 30%;"></el-input>
                  <el-input v-model="item.value" style="width: 50%;"></el-input>
                  <el-button type="danger" @click="handleDel2(index)">删除</el-button>
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addAttribute">添加属性</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData('4')">确 定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="dialogStatus =='create'" label="规格设置" name="five">
          <el-form
            :rules="rules"
            ref="dataForm5"
            :model="temp5"
            label-position="left"
            label-width="15%"
            style="width: 100%;"
          >
            <el-form-item label="规格设置">
              <div
                style="margin-top: 10px;"
                v-for="(items, index) in temp5.species_list"
                :key="index"
                v-dragging="{ item: items, list: temp5.species_list, group:'species_list', comb: 'isComb'}"
              >
                <i class="el-icon-rank iconStyle"></i>
                <el-select
                  v-model="items.id"
                  @change="(val) => handleChangeSpeciesName(val, index)"
                  filterable
                  remote
                  :remote-method="getShopSpeciesList"
                  :loading="shopSpeciesNameLoading"
                  placeholder="请选择规格名称"
                >
                  <el-option
                    v-for="names in updateSpeciesNamesOptions"
                    :key="names.id"
                    :label="names.species_name + '-' + names.species_remark"
                    :value="names.id"
                  ></el-option>
                </el-select>
                <el-button type="success" @click="handleDetails(index)">
                  <i class="el-icon-plus"></i>
                </el-button>
                <el-button type="danger" @click="handleDel1(index)">
                  <i class="el-icon-delete"></i>
                </el-button>
                <div
                  style="margin-top: 10px;"
                  v-for="(item, i) in items.value"
                  v-dragging="{item: item, list: items.value, group: 'species_value' + items.id, comb: 'isComb'}"
                  :key="i"
                >
                  <svg-icon icon-class="bianqian" style="font-size: 22px;"></svg-icon>
                  <el-select
                    v-model="item.id"
                    filterable
                    remote
                    :remote-method="(val) => getShopSpeciesValueList(val,items.id)"
                    :loading="shopSpeciesValueLoading"
                    placeholder="请选择规格值"
                  >
                    <el-option
                      v-for="names in updateSpeciesValuesOptions"
                      :key="names.id"
                      :label="names.species_value  "
                      :value="names.id"
                    ></el-option>
                  </el-select>
                  <el-button type="danger" @click="handleDel(index, i)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </div>
              </div>
              <!--<div style="margin-top: 10px;" v-for="(item, index) in temp5.species_names"  v-dragging="{ item: item, list: temp5.species_values, group:'species_values', comb: 'isComb'}" :key="index">-->
              <!--<el-input v-model="index" style="width:60%;"></el-input>-->
              <!--<el-button type="success" @click="handleDetails(index)">-->
              <!--<i class="el-icon-plus"></i>-->
              <!--</el-button>-->
              <!--<el-button type="danger" @click="handleDel1(index)">-->
              <!--<i class="el-icon-delete"></i>-->
              <!--</el-button>-->

              <!--&lt;!&ndash;<el-button v-if="item.attr_status == 0" type="warning" @click="handleBack1(index)">恢复规格明细</el-button>&ndash;&gt;-->
              <!--<div style="margin-top: 10px;" v-for="(item1,index1) in item.attr_val" v-dragging="{item: item1, list: item.attr_val, group:`${item.attr}`, comb: 'isComb'}" :key='`${item.attr}${index1}`'>-->
              <!--<svg-icon icon-class="bianqian" style="font-size: 22px;"></svg-icon>-->
              <!--<el-input v-model="item1.name" style="width: 290px;"></el-input>-->
              <!--<el-button v-if="item.attr_val.length > 1" type="danger" @click="handleDel(index,index1)">-->
              <!--<i class="el-icon-delete"></i>-->
              <!--</el-button>-->
              <!--&lt;!&ndash;<el-button v-if="item1.status == 0 || item.attr_status == 0" type="warning" @click="handleBack(index,index1)">恢复规格明细</el-button>&ndash;&gt;-->
              <!--</div>-->
              <!--</div >-->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAttr">添加规格分类</el-button>
              <span>(可以进行拖拽排序)</span>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData('5')">确 定</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogShopGoodsTable">
      <div class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;float:right;"
          @click="handleCreateShopGoodsDetail"
          type="primary"
          icon="el-icon-edit"
        >添加</el-button>
      </div>
      <el-table
        :stripe="true"
        :key="tableKey"
        :data="shopGoodsDetailList"
        v-loading="shopGoodsDetailListLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" label="仓库">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.warehouse.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" label="仓对商品">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.product_goods.goods_name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="数量">
          <template slot-scope="scope">
            <span>{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" class-name="small-padding">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDeleteShopGoodsDetail(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!shopGoodsDetailListLoading" class="pagination-container">
        <el-pagination
          background
          @size-change="handleShopDetailSizeChange"
          @current-change="handleShopDetailCurrentChange"
          :current-page.sync="shopGoodsDetailListQuery.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="shopGoodsDetailListQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="shopGoodsDetailTotal"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogShopGoodsEdit" title="添加">
      <el-form
        ref="tempShopGoodsDetail"
        :model="tempShopGoodsDetail"
        label-position="left"
        label-width="80px"
        style="width: 90%; margin-left:5%;"
      >
        <el-form-item label="仓库商品" prop="actual_price">
          <multiselect
            v-model="tempShopGoodsDetail.goods_storage"
            :options="productGoodsOptions"
            @search-change="getProductGoodsList"
            placeholder="搜索仓库商品"
            selectLabel="选择"
            deselectLabel="删除"
            track-by="id"
            :internalSearch="false"
            label="id"
          >
            <template slot="singleLabel" slot-scope="props">
              <span
                class="option__desc"
                v-if="props.option.product_goods && props.option.warehouse"
              >
                <span class="option__title">{{ props.option.product_goods.goods_name}}</span>
                <span
                  style="color: #666;background-color: #dbdbdb;padding: 2px 8px;border-radius:5px;"
                >{{ props.option.warehouse.name }}</span>
              </span>
            </template>
            <template slot="option" slot-scope="props">
              <span
                class="option__desc"
                v-if="props.option.product_goods && props.option.warehouse"
              >
                <span class="option__title">{{ props.option.product_goods.goods_name}}</span>
                <span
                  style="color: #666;background-color: #dbdbdb;padding: 1px 8px;border-radius:5px;"
                >{{ props.option.warehouse.name }}</span>
              </span>
            </template>
            <span slot="noResult">无结果</span>
          </multiselect>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="tempShopGoodsDetail.number" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="dialogShopGoodsEdit = false">取 消</el-button>
        <el-button type="primary" @click="createShopGoodsDetail">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogDistributionRuleTitle"
      :visible.sync="dialogDistributionRuleVisiable"
      width="80%"
    >
      <el-form
        :rules="innerRules4"
        ref="innerDataForm4"
        :model="distributionRuleList"
        label-position="left"
        label-width="15%"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="商品-分佣">
          <el-row :gutter="20" style="margin-bottom: 5px;clear: both;">
            <el-col :span="4">等级</el-col>
            <el-col :span="4">首购返佣(%)</el-col>
            <el-col :span="4">复购返佣(%)</el-col>
            <el-col :span="4">自购返佣(%)</el-col>
            <el-col :span="4">平级返佣(%)</el-col>
            <el-col :span="4">级差返佣(%)</el-col>
          </el-row>
          <el-row
            :gutter="20"
            v-for="item in distributionRuleList"
            :key="item.id"
            style="margin-bottom: 5px;clear: both;"
          >
            <el-col :span="4">
              <el-input v-model="item.distribution_level_name" disabled="disabled"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.first_purchase"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.repeat_purchase"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.self_purchase"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.equal_level"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.unequal_level"></el-input>
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
  getShopGoodsDetailList,
  createShopGoodsDetail,
  deleteShopGoodsDetail,
  getOrdersAreaList,
  getProductGoodsList,
  getShopGoodsMemberPriceList,
  createShopGoodsMemberPrice,
  updateShopGoodsMemberPrice,
  getShopDistributionLevelPriceList,
  createShopGoodsDistributionPrice,
  updateShopGoodsDistributionPrice,
  updateShopGoodsIntegralStatus,
  getShopGoodsMemberInfoList
} from "@/api/goods";
import * as imageConversion from 'image-conversion';

import { getShopSpeciesList, getShopSpeciesValueList } from "@/api/species";
import { getFreightTemplateList } from "@/api/freight";
import { uploadImage } from "@/api/document";

import {
  getShopGoodsCommonList,
  changeShopGoodsStatus,
  getBrandList,
  createShopGoodsCommon,
  updateShopGoodsCommon,
  getShopGoodsCommonInfo,
  getShopGoodsList,
  createProductGoods,
  updateShopGoods,
  getShopGoodsCategoryTree,
  getShopGoodsGroupList,
  getGoodsDistributionRule,
  updateGoodsDistributionRule
} from "@/api/goods";
import waves from "@/directive/waves"; // 水波纹指令
import Multiselect from "vue-multiselect"; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
// import {regionData} from 'element-china-area-data'
import { getShopBalanceProfitRecordList } from '@/api/financial';
// 富文本编辑器
export default {
  name: "productManagement",
  components: {
    Multiselect,
  },
  directives: {
    waves
  },
  data() {
    return {
      dataList: [],
      propsl: {
        value: "area_number",
        label: "area_name",
        children: "children"
      },
      fileListLB:[],
      // 会员价格明细
      dialogSetEdits: false,
      tableKeyPrice: 0,
      PriceLoading: false,
      dialogPriceDetails: false,
      priceDetailsList: [],
      priceDetailsListQuery: {
        sort: "+member_level_id",
        page_size: null,
        shop_goods_common_id: undefined,
        shop_goods_id: undefined
      },
      // 分销价格明细
      tableKeyDistribution: 0,
      dialogDistributionPriceDetails: false,
      distributionPriceLoading: false,
      distributionpriceDetailsList: [],
      distributionDetailsListQuery: {
        page_size: null,
        shop_goods_common_id: undefined,
        shop_goods_id: undefined,
        sort: "+distribution_level_id"
      },
      fileListl:[],
      file:'',
      success: true,
      danger: false,
      checked: false,
      dialogSet: false,
      listLoading1: true,
      dialogSetEdit: false,
      dialogBelong: false,

      baseUrl: process.env.BASE_API + "/api/document/uploadImage",
      activeName: "first",
      dialogImageUrl: "",
      tableKey1: undefined,
      dialogVisible: false,
      scrollTop: 0,
      tableKey: 0,
      list: null,
      total: null,
      list1: null,
      total1: null,
      listLoading: true,
      classOptions: [],
      classOptions1: [],
      classOptions2: [],
      temp1: {
        goods_name: undefined,
        goods_title: undefined,
        brand_id: undefined,
        freight_id: undefined,
        price: undefined,
        origin_price: undefined,
        is_sale: 0,
        is_gift: 1,
        if_gold_suitable: 1,
        is_recommend: 0,
        sold_count: undefined,
        product_goods_category_id: [],
        assemble_price: undefined,
        after_sale_days: undefined,
        distribution_price: undefined,
        max_rebate: 0,
        province: [],
        member_id: undefined
      },
      brandOptions1: [],
      temp2: {
        main_images: [],
        main_images_default: undefined
      },
      goodsCommonDetailList: [],
      fileList: [],
      fileList1: [],
      fileList3: [],
      temp3: {
        radio1: 1
      },
      temp4: {
        goods_attribute: [
          {
            value: undefined,
            label: undefined
          }
        ]
      },
      props: {
        value: "id",
        children: "son",
        label: "category_name"
      },
      temp5: {
        species_values: [],
        species_names: [],
        species_list: []
      },
      listQuery: {
        page: 1,
        page_size: 20,
        goods_name: undefined,
        sort: "-id",
        is_sale: undefined,
        // brand: undefined,
        brand_id: undefined,
        group_id: undefined
      },
      listQuery1: {
        page: 1,
        page_size: 20,
        sort: "-id",
        status: undefined,
        shop_goods_common_id: undefined
      },
      shop_goods_common_id: undefined,
      listQuery3: {
        product_ids: [],
        shop_goods_common_id: undefined
      },
      importanceOptions: [1, 2, 3],
      unitOptions: [
        {
          label: "件",
          id: 0
        },
        {
          label: "斤",
          id: 1
        },
        {
          label: "g",
          id: 2
        }
      ],
      sortOptions: [
        { label: "按ID升序列", key: "+id" },
        { label: "按ID降序", key: "-id" }
      ],
      statusOptions: [
        { label: "非在售", key: 0 },
        { label: "在售", key: 1 }
      ],
      brandLoading: false,
      brandOptions: [],
      freightTemplateLoading: false,
      freightTemplateOptions: [],
      groupLoading: false,
      groupOptions: [],
      regionData: [],
      // typeOptions: [{ label: '非在售', key: 0 }, { label: '在售', key: 1 }],
      showAuditor: false,
      temp_product_ids: [],
      temp: {
        id: undefined,
        goods_name: "",
        unit: undefined,
        price: undefined,
        stock: undefined,
        production_cycle: undefined,
        product: [],
        product_ids: [],
        status: 1,
        sold_count: undefined
      },
      pricels: {
        integral_discount_price: undefined,
        integral_price: undefined,
        id: "",
        stock: undefined,
        shop_store_id: undefined
      },

      price1: {
        shop_goods_id: undefined,
        shop_store_id: undefined,
        goods_common_id: undefined,
        image_thumb: undefined,
        origin_price: undefined,
        actual_price: undefined,
        assemble_price: undefined,
        status: undefined,
        distribution_price: undefined,
        stock: undefined,
        weight: 0,
        gold_shell: 0,
        silver_shell: 0,
        integral_price: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogStatus1: "",
      textMap1: {
        update: "编辑",
        create: "创建"
      },
      createName: false,
      rules: {
        goods_name: [
          { required: true, message: "请正确填写商品名称", trigger: "change" }
        ],
        goods_title: [
          {
            required: true,
            message: "请正确填写商品展示标题",
            trigger: "change"
          }
        ],
        brand_id: [
          { required: true, message: "请正确选择品牌ID", trigger: "change" }
        ],
        origin_price: [
          { required: true, message: "请正确填写原价", trigger: "change" }
        ],
        price: [
          { required: true, message: "请正确填写实际售价", trigger: "change" }
        ],
        assemble_price: [
          { required: true, message: "请正确填写团购价格", trigger: "change" }
        ],
        label: [{ required: true, message: "请填写属性", trigger: "change" }],
        sold_count: [
          { required: true, message: "请填写已售件数", trigger: "change" }
        ],
        value: [{ required: true, message: "请填写属性", trigger: "change" }],
        after_sale_days: [
          { required: true, message: "请填写售后天数", trigger: "change" }
        ],
        distribution_price: [
          { required: true, message: "请填写分销价格", trigger: "change" }
        ]
      },
      productType: {
        1: "推广",
        2: "附属产品",
        3: "赠品"
      },
      productTypeOptions: [
        { key: 1, display_name: "推广" },
        { key: 2, display_name: "附属产品" },
        { key: 3, display_name: "赠品" }
      ],
      tempData: {
        goods_common_id: undefined,
        product_goods_id: undefined,
        species_value: undefined,
        image_thumb: undefined,
        origin_price: undefined,
        actual_price: undefined,
        status: undefined
      },
      status: 1,
      updateSpeciesNamesOptions: [],
      updateSpeciesValuesOptions: [],
      shopSpeciesNameLoading: false,
      shopSpeciesValueLoading: false,
      tempShopGoodsDetail: {
        id: undefined,
        shop_goods_id: undefined,
        product_goods_id: undefined,
        number: 1,
        goods_storage: {}
      },
      shopGoodsDetailListQuery: {
        page: 1,
        page_size: 20,
        shop_goods_id: undefined
      },
      dialogShopGoodsTable: false,
      shopGoodsDetailList: [],
      shopGoodsDetailListLoading: false,
      dialogShopGoodsEdit: false,
      shopGoodsDetailTotal: 0,
      productGoodsLoading: false,
      productGoodsOptions: [],
      dialogDistributionRuleTitle: "返佣设置",
      dialogDistributionRuleVisiable: false,
      distributionRuleList: [],
      tempShopGoodsId: undefined,
      innerRules4: {},
      integral_status: 1,
      species_remarks:{}

    };

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        2: "",
        3: "danger"
      };
      return statusMap[status];
    },
    statusUnit(status) {
      const statusTransMap = {
        0: "件",
        1: "斤",
        2: "g"
      };
      return statusTransMap[status];
    },
    statusTranslator(status) {
      const statusMap = {
        1: "推广",
        2: "附属产品",
        3: "赠品"
      };
      return statusMap[status];
    },
    TypeStatusFilter(status) {
      const statusMap = {
        1: "success",
        0: "danger"
      };
      return statusMap[status];
    },
    TypeStatusTranslator(status) {
      const statusMap = {
        1: "在售",
        0: "非在售"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.handleChange();
    this.getFreightTemplateList();
  },
  mounted() {},
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
   handleGoodsCommonDetailProgress(event, file, fileList) {
     setTimeout(() => {
        if (file.name !== undefined) {
          this.goodsCommonDetailList.push({
            name: file.name,
            url: file.response.data.url
          });
          console.log(this.goodsCommonDetailList,'商品详情数据')
        }
      }, 100);
    },
    handleOnProgress(event, file, fileList) {
      setTimeout(() => {
        if (file.name !== undefined) {
            this.fileList.push({
            name: file.name,
            url: file.response.data.url
          });
        }
      }, 100);
    },
    // 会员信息列表
    getdatalist() {
      getShopGoodsMemberInfoList({ status: 1 }).then(res => {
        this.dataList = res.data.data;
      });
    },
    handelroos() {
      this.pricels = {
        integral_discount_price: undefined,
        integral_price: undefined
      };
    },
    // 积分商品兑换
    handleUpdateDistriduihuan(row) {
      this.dialogSetEdits = true;
      this.pricels.id = row.id;
      this.pricels.stock = row.stock;
      this.pricels.shop_store_id = row.shop_store_id;
    },
    updateDatals() {
      this.pricels.integral_status = this.integral_status;
      // id:row.id,stock:row.stock,shop_store_id:row.shop_store_id,integral_discount_price:row.integral_discount_price,integral_price:row.integral_price
      updateShopGoodsIntegralStatus(this.pricels).then(res => {
        this.$notify({
          title: "成功",
          message: "注册成功",
          type: "success",
          duration: 2000
        });
      });
      this.dialogSetEdits = false;
    },

    handleRegionChange(value) {
      console.log(value, 111111);
    },
    // 操作会员价格明细
    handleUpdatePriceDetails(row) {
      this.dialogPriceDetails = true;
      this.PriceLoading = true;
      this.priceDetailsListQuery.shop_goods_id = row.id;
      console.log(this.priceDetailsListQuery.shop_goods_id);
      this.getShopGoodsMemberPriceList();
    },
    getShopGoodsMemberPriceList() {
      getShopGoodsMemberPriceList(this.priceDetailsListQuery).then(response => {
        this.priceDetailsList = response.data.map(item => {
          item.edit_add = false;
          if (!item.price) {
            item.price = 0;
          }
          item.oldPrice = item.price;
          return item;
        });
        console.log(this.priceDetailsList);
        this.PriceLoading = false;
      });
    },
    // 显示隐藏
    openEdit(row, key) {
      this.priceDetailsList.forEach(item => {
        item.edit_add = 0;
        item.price = item.oldPrice;
      });
      row[key] = 1;
    },
    // 完成
    confirmEditAdd(row) {
      console.log(row);
      if (row.id) {
        const tempData = {
          shop_goods_member_price_id: row.id,
          price: row.price
        };
        updateShopGoodsMemberPrice(tempData).then(response => {
          this.getShopGoodsMemberPriceList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
        createShopGoodsMemberPrice(row).then(response => {
          this.getShopGoodsMemberPriceList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      }
    },
    // 取消
    cancelEditAdd(row) {
      row.price = row.oldPrice;
      row.edit_add = false;
      this.$message({
        message: "已取消修改",
        type: "warning"
      });
    },
    // 操作分销价格明细
    handleUpdateDistributionPriceDetails(row) {
      this.dialogDistributionPriceDetails = true;
      this.distributionPriceLoading = true;
      this.distributionDetailsListQuery.shop_goods_id = row.id;
      this.getShopDistributionLevelPriceList();
    },
    getShopDistributionLevelPriceList() {
      getShopDistributionLevelPriceList(this.distributionDetailsListQuery).then(
        response => {
          this.distributionpriceDetailsList = response.data.map(item => {
            item.edit_add = false;
            if (!item.price) {
              item.price = 0;
            }
            item.oldPrice = item.price;
            return item;
          });
          console.log(this.distributionpriceDetailsList);
          this.distributionPriceLoading = false;
        }
      );
    },
    // 显示隐藏
    openEdit1(row, key) {
      this.distributionpriceDetailsList.forEach(item => {
        item.edit_add = 0;
        item.price = item.oldPrice;
      });
      row[key] = 1;
    },
    // 完成
    confirmEditAdd1(row) {
      console.log(row);
      if (row.id) {
        const tempData = {
          shop_goods_distribution_price_id: row.id,
          price: row.price
        };
        updateShopGoodsDistributionPrice(tempData).then(response => {
          this.getShopDistributionLevelPriceList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
        createShopGoodsDistributionPrice(row).then(response => {
          this.getShopDistributionLevelPriceList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      }
    },
    // 取消
    cancelEditAdd1(row) {
      row.price = row.oldPrice;
      row.edit_add = false;
      this.$message({
        message: "已取消修改",
        type: "warning"
      });
    },
    getProductGoodsList(query) {
      this.productGoodsLoading = true;
      const tempData = {};
      tempData.goods_name = query;
      getProductGoodsList(tempData).then(response => {
        this.productGoodsOptions = response.data.data;
        this.productGoodsLoading = false;
      });
    },
    getShopSpeciesList(query) {
      this.shopSpeciesNameLoading = true;
      const tempData = {};
      tempData.species_name = query;
      tempData.category_ids = this.temp1.product_goods_category_id;
      getShopSpeciesList(tempData).then(response => {
        this.updateSpeciesNamesOptions = response.data.data;
        console.log(this.updateSpeciesNamesOptions,22222)
        this.shopSpeciesNameLoading = false;
      });
    },
    getShopSpeciesValueList(query, index) {
      this.shopSpeciesValueLoading = true;
      getShopSpeciesValueList({
        shop_species_id: index,
        species_value: query
      }).then(response => {
        this.updateSpeciesValuesOptions = response.data.data;
        console.log(this.updateSpeciesValuesOptions,111111111)
        this.shopSpeciesValueLoading = false;
      });
    },
    // 拖拽
    dragend() {
      // this.$dragging.$on('dragged', (value) => {
      // })
      // this.$dragging.$once('dragend', (value) => {
      // })
    },
    getList() {
      this.listLoading = true;
      getShopGoodsCommonList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;

      });
    },
    // 商品属性下所有分类
    handleChange() {
      getShopGoodsCategoryTree().then(res => {
        this.classOptions = res.data;
      });
    },
    // 规格设置列表开关状态
    handleSwitch(row) {
      changeShopGoodsStatus({ shop_goods_id: row.id, status: row.status }).then(
        res => {
          this.getSettingList();
          this.$message.success("修改成功");
        }
      );
    },
    tableRowClassName({ row }) {
      if (row.status === 1) {
        return "";
      } else {
        return "warning-row";
      }
    },
    // 规格明细列表
    getSettingList(row) {
      this.listLoading1 = true;
      getShopGoodsList(this.listQuery1).then(response => {
        this.list1 = response.data;
        // this.total1 = response.data.total
        this.listLoading1 = false;
      });
    },
    // 规格设置下编辑
    handleEditSet(row) {
      this.price1 = row;

      console.log(row, 3333333);
      this.fileList3 = [];
      if (row.image_thumb !== "") {
        this.fileList3 = [
          {
            name: 0,
            url: row.image_thumb
          }
        ];
      }
      this.dialogSetEdit = true;
      this.dialogStatus1 = "update";
      // this.goods_common_id = row.goods_common_id
      // this.product_goods_id = row.id
    },
    // 规格设置下创建
    handleCreateSet(row) {
      this.dialogSetEdit = true;
      this.price1 = Object.assign({}, row);
      this.dialogStatus1 = "create";
      this.dataPrice = {
        image_thumb: undefined,
        origin_price: undefined,
        actual_price: undefined
      };
    },
    // 规格设置操作按钮
    handleSet(row) {
      this.dialogSet = true;
      this.listQuery1.shop_goods_common_id = row.id;
      this.priceDetailsListQuery.shop_goods_common_id = row.id;
      this.distributionDetailsListQuery.shop_goods_common_id = row.id;
      this.getSettingList();
    },
    // 分组
    getShopGoodsGroupList(query) {
      if (query !== "") {
        this.groupLoading = true;
        getShopGoodsGroupList({ group_name: query, page_size: 0 }).then(
          response => {
            this.groupOptions = response.data;
            this.groupLoading = false;
          }
        );
      }
    },
    // 品牌
    getBrandList(query) {
      if (query !== "") {
        this.brandLoading = true;
        getBrandList({ brand_name: query, page_size: 0 }).then(response => {
          this.brandOptions = response.data;
          this.brandLoading = false;
        });
      }
    },
    getFreightTemplateList() {
      this.freightTemplateLoading = true;
      getFreightTemplateList({ page_size: 0 }).then(response => {
        this.freightTemplateOptions = response.data;
        this.freightTemplateLoading = false;
      });
    },
    // 基本信息所属品牌
    getBrandList1(query) {
      if (query !== "") {
        this.brandLoading = true;
        getBrandList({ brand_name: query, page_size: 0 }).then(response => {
          this.brandOptions1 = response.data;
          this.brandLoading = false;
        });
      }
    },
    // 创建基本信息
    createData() {
      this.$refs["dataForm1"].validate(valid => {
        if (valid) {
          const parmars = JSON.parse(JSON.stringify(this.temp1));
          console.log(parmars);
          parmars.product_goods_category_id = parmars.product_goods_category_id.join();
          console.log(parmars);
          createShopGoodsCommon(parmars).then(response => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 创建规格设置
    createData1() {
      this.$refs["dataPrice"].validate(valid => {
        if (valid) {
          const tempData = Object.assign(
            {
              goods_common_id: this.listQuery1.shop_goods_common_id
            },
            this.price1
          );
          tempData.species_value = [
            tempData.species_value.attr,
            tempData.species_value.attr_val
          ];
          tempData.status = 1;
          if (this.price1.image_thumb === "") {
            this.$message.error("请上传规格主图");
            return false;
          }
          createProductGoods(tempData).then(() => {
            this.getSettingList();
            this.dialogSetEdit = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 编辑规格设置
    updateData1() {
      this.$refs["dataPrice"].validate(valid => {
        if (valid) {
          const tempData = Object.assign(
            {
              shop_goods_id: this.price1.id
            },
            this.price1
          );
          // if (this.price1.image_thumb === '') {
          //   this.$message.error('请上传主图')
          //   return false
          // }
          updateShopGoods(tempData).then(() => {
            this.dialogSetEdit = false;
            this.getSettingList();
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
    // 点击确定编辑
    updateData(temp) {
      this.$refs[`dataForm${temp}`].validate(valid => {
        if (valid) {
          const str = this.temp1.product_goods_category_id.join();
          if (temp === "2") {
            this.temp2.main_images = this.fileList;
            // if (this.fileList1.length === 0) {
            //   this.temp2.main_images_default = undefined
            //   this.$message.error('请上传主图')
            //   return false
            // } else {
            //   this.temp2.main_images_default = this.fileList1[0].url
            // }
            if (this.temp2.main_images === []) {
              this.$message.error("请上传轮播图");
              return false;
            }
            if (this.temp2.main_images_default === "") {
              this.$message.error("请上传主图");
              return false;
            }
          }

          if (temp === "3") {
            this.temp3.goods_description = this.goodsCommonDetailList;
          }
          if (temp === "4") {
            let rules = false;
            console.log(this.temp4.goods_attribute);
            rules = this.temp4.goods_attribute.every(item => {
              return (
                item.label !== undefined &&
                item.label !== "" &&
                item.label !== " " &&
                item.value !== undefined &&
                item.value !== "" &&
                item.value !== " "
              );
            });
            if (!rules) {
              this.$message.error("属性设置不能为空");
              return false;
            }
          }
          if (temp === "5") {
            this.temp5.species_names = this.temp5.species_values.map(item => {
              return {
                attr: item.attr,
                attr_status: item.attr_status
              };
            });
          }
          const tempData = Object.assign(
            {shop_goods_common_id: this.shop_goods_common_id},this[`temp${temp}`],{ product_goods_category_id: str });
          if (temp === "5") {
            this.$confirm(
              "此操作将生成新的商品规格明细, 自动下架该商品, 永久删除之前的商品规格明细",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                updateShopGoodsCommon(tempData).then(response => {
                  this.getList();
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: "成功",
                    message: "更新成功",
                    type: "success",
                    duration: 2000
                  });
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          } else {
            updateShopGoodsCommon(tempData).then(response => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            });
          }
        }
      });
    },
    // 编辑基本信息
    handleUpdate(row) {
      this.shop_goods_common_id = row.id;
      this.updateSpeciesNamesOptions = [];
      this.updateSpeciesValuesOptions = [];
      getShopGoodsCommonInfo({ shop_goods_common_id: row.id }).then(
        response => {
        for (const v of response.data.species_list) {
            const temp_species_name_item = [];
            temp_species_name_item.id = v.id;
            temp_species_name_item.species_name = response.data.species_names[v.id];
            temp_species_name_item.species_remark = response.data.species_remark[v.id];
            this.updateSpeciesNamesOptions.push(temp_species_name_item);
            console.log(this.updateSpeciesNamesOptions,999999)
            for (const value of v.value) {
              const temp_species_value_item = {};
              temp_species_value_item.id = value.id;
              temp_species_value_item.species_value = value.value;
              this.updateSpeciesValuesOptions.push(temp_species_value_item);
            }
          }
          this.temp1.goods_name = response.data.goods_name;
          this.temp1.goods_title = response.data.goods_title;
          this.getBrandList1();
          this.getdatalist()
          this.temp1.origin_price = response.data.origin_price;
          this.temp1.after_sale_days = response.data.after_sale_days;
          this.temp1.distribution_price = response.data.distribution_price;
          this.temp1.price = response.data.price;
          this.temp1.brand_id = response.data.brand_id;
          this.temp1.freight_id = response.data.freight_id;
          this.temp1.is_sale = response.data.is_sale;
          this.temp1.is_gift = response.data.is_gift;
          this.temp1.assemble_price = response.data.assemble_price;
          this.temp1.is_recommend = response.data.is_recommend;
          this.temp1.if_gold_suitable = response.data.if_gold_suitable;
          this.temp1.max_rebate = response.data.max_rebate;
          this.temp1.sold_count = response.data.sold_count;
          this.temp1.member_id = response.data.member_id

          this.fileList =
            response.data.main_images !== null ? response.data.main_images : [];
          this.fileList1 =
            response.data.main_images_default !== null
              ? [
                  {
                    name: 0,
                    url: response.data.main_images_default
                  }
                ]
              : [];
          this.temp2.main_images_default = response.data.main_images_default;
          this.temp3.goods_description = response.data.goods_description;
          this.goodsCommonDetailList = response.data.goods_description
            ? response.data.goods_description
            : [];
          this.temp4.goods_attribute =
            response.data.goods_attribute !== null
              ? response.data.goods_attribute
              : [
                  {
                    label: undefined,
                    value: undefined
                  }
                ];
          this.temp1.product_goods_category_id =
            response.data.product_goods_category_id !== null
              ? response.data.product_goods_category_id
                  .split(",")
                  .map(item => parseInt(item))
              : [];
          // this.temp5.species_names = response.data.species_names !== null ? response.data.species_names : []
          // this.temp5.species_values = response.data.species_values !== null ? response.data.species_values : []
          this.temp5.species_list =
            response.data.species_list !== null &&
            response.data.species_list !== []
              ? response.data.species_list
              : [];
          // this.$set(this.temp5,'species_list', [])
          this.dialogStatus = "update";
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            // this.$refs['dataPrice'].clearValidate()
            this.$refs["dataForm1"].clearValidate();
            this.$refs["dataForm2"].clearValidate();
            this.$refs["dataForm3"].clearValidate();
            this.$refs["dataForm4"].clearValidate();
            this.$refs["dataForm5"].clearValidate();
          });
        }
      );
    },
    // 添加规格分类
    handleAttr() {
      this.temp5.species_list.push({ id: undefined, value: [] });
      this.updateSpeciesNamesOptions = [];
    },
    // 添加规格明细
    handleDetails(index) {
      this.temp5.species_list[index].value.push({});
      this.updateSpeciesValuesOptions = [];
    },
    handleChangeSpeciesName(val, index) {
      this.temp5.species_list[index].value = [];
    },
    // 商品轮播图上传
    handleUp(response, file, fileList) {
      // console.log(22222222222)
      // this.fileList = fileList.map(item => {
      //   const tempItem = {
      //     name: item.name,
      //     url: item.response ? item.response.data.url : item.url
      //   }
      //   return tempItem
      // })
    },
    // handleGoodsCommonDetailUp(response, file, fileList) {
    //   console.log(response)
    //   this.goodsCommonDetailList = fileList.map(item => {
    //     return {
    //       name: item.name,
    //       url: item.response ? item.response.data.url : item.url
    //     }
    //   })
    // },
    handleUp1(response, file, fileList) {
      this.temp2.main_images_default = response.data.url;

      this.$nextTick(() => {
        this.dragend();
      });
    },
    // 规格设置上传主图
    handlePictureSuccess(response, file, fileList) {
      this.price1.image_thumb = response.data.url;
    },
    // 商品属性添加属性事件
    addAttribute() {
      this.temp4.goods_attribute.push({
        label: undefined,
        value: undefined
      });
    },
    // 商品属性删除
    handleDel2(index) {
      this.temp4.goods_attribute.splice(index, 1);
    },
    // 规格设置删除规格明细
    handleDel(index, species_name_id, i) {
      this.temp5.species_list[index]["value"].splice(i, 1);
    },
    // 规格设置恢复明细
    handleBack(index, index1) {
      // this.temp5.species_values[index].attr_val[index1].splice(0, -1)
    },
    // 删除所有规格明细
    handleDel1(index) {
      this.temp5.species_list.splice(index, 1);
    },
    // 恢复父级规格明细
    // handleBack1(index) {
    //   this.temp5.species_values[index].attr_status = 1
    //   this.temp5.species_values[index].attr_val.map(item => {
    //     item.status = 1
    //   })
    // },
    handleTabclick(tab, event) {
      console.log(tab, event);
    },
    handleExceed1() {
      this.$message.error("主图限制上传一张");
    },
    handleRemove1(file, fileList) {
      this.temp2.main_images_default = "";
    },
    handleRemove3(file, fileList) {
      this.price1.image_thumb = "";
    },
    handleRemove(file, fileList) {
      this.fileList = fileList.map(item => {
        return {
          name: item.name,
          url: item.response ? item.response.data.url : item.url
        };
      });
    },
    handleGoodsCommonDetailRemove(file, fileList) {
      this.goodsCommonDetailList = fileList.map(item => {
        return {
          name: item.name,
          url: item.response ? item.response.data.url : item.url
        };

      });

    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.main_images_default;
      this.dialogVisible = true;
    },
    handlePictureCardPreview2(file) {
      this.dialogImageUrl = file.image_thumb;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
      // return new Promise((resolve, reject) => {
      //   let _URL = window.URL || window.webkitURL
      //   // let isLt2M = file.size / 1024 / 1024 > 4 // 判定图片大小是否小于4MB
      //   // 这里需要计算出图片的长宽
      //   let img = new Image()
      //   img.onload = function () {
      //     file.width = img.width // 获取到width放在了file属性上
      //     file.height = img.height // 获取到height放在了file属性上
      //     console.log(11, file)
      //       imageConversion.compressAccurately(file, {
      //         size: 300,
      //         height:500,
      //         quality:0.9
      //       }).then(res => {
      //         console.log(33, res)
      //         resolve(res)
      //       })
      //   }
      //   // 需要把图片赋值
      //   img.src = _URL.createObjectURL(file)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
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
      this.getList();
    },
    handleCurrentChange1(val) {
      this.listQuery1.page = val;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    resetTemp() {
      this.temp1 = {
        goods_name: undefined,
        goods_title: undefined,
        brand_id: undefined,
        price: undefined,
        origin_price: undefined,
        is_sale: 0,
        is_gift: 1,
        if_gold_suitable: 1,
        is_recommend: 0,
        after_sale_days: undefined,
        max_rebate: 0
      };
      this.temp5 = {
        species_values: [],
        species_names: [],
        species_list: []
      };
      this.temp1.product_goods_category_id = [];
    },
    handleCreate() {
      this.activeName = "first";
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm1"].clearValidate();
        if (this.createName === false) {
          // this.editor.create()
          this.createName = true;
          // var $text1 = $('#text1')
          // editor.customConfig.onchange = function (html) {
          //   // 监控变化，同步更新到 textarea
          //   $text1.val(html)
          // }
          // $text1.val(editor.txt.html())
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ttempData = {
            product_goods_id: row.id
          };
          deleteProductGoods(ttempData).then(response => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.total--;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleUpdateShopGoodsDetail(row) {
      this.price1 = Object.assign({}, row);
      this.dialogShopGoodsTable = true;
      this.shopGoodsDetailListLoading = true;
      this.shopGoodsDetailListQuery.shop_goods_id = this.price1.id;
      getShopGoodsDetailList(this.shopGoodsDetailListQuery).then(response => {
        this.shopGoodsDetailList = response.data.data;
        this.shopGoodsDetailTotal = response.data.total;
        this.shopGoodsDetailListLoading = false;
      });
    },
    handleShopDetailCurrentChange() {
      this.handleUpdateShopGoodsDetail(this.price1);
    },
    handleShopDetailSizeChange() {
      this.handleUpdateShopGoodsDetail(this.price1);
    },
    handleCreateShopGoodsDetail() {
      this.tempShopGoodsDetail = {
        id: undefined,
        shop_goods_id: undefined,
        product_goods_id: undefined,
        number: 1
      };
      this.tempShopGoodsDetail.shop_goods_id = this.price1.id;
      this.dialogShopGoodsEdit = true;
    },
    createShopGoodsDetail() {
      this.tempShopGoodsDetail.warehouse_id = this.tempShopGoodsDetail.goods_storage.warehouse.id;
      this.tempShopGoodsDetail.product_goods_id = this.tempShopGoodsDetail.goods_storage.product_goods.id;
      createShopGoodsDetail(this.tempShopGoodsDetail).then(response => {
        this.handleUpdateShopGoodsDetail(this.price1);
        this.dialogShopGoodsEdit = false;
        this.total++;
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleDeleteShopGoodsDetail(row) {
      this.$confirm("此操作将永久删除该仓库商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ttempData = {
            shop_goods_detail_id: row.id
          };
          deleteShopGoodsDetail(ttempData).then(response => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.handleUpdateShopGoodsDetail(this.price1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleUpdateDistributionRule(row) {
      const tempQuery = {};
      tempQuery.shop_goods_id = row.id;
      this.distributionRuleList = [];
      this.tempShopGoodsId = row.id;
      this.dialogDistributionRuleVisiable = true;
      getGoodsDistributionRule(tempQuery).then(response => {
        this.distributionRuleList = response.data;
        console.log(this.distributionRuleList,11111)
      });
    },
    updateDistributionRule() {
      this.dialogDistributionRuleVisiable = false;
      updateGoodsDistributionRule({
        shop_goods_id: this.tempShopGoodsId,
        rules: this.distributionRuleList
      }).then(response => {
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000
        });
      });
    }
  },
  deactivated() {
    this.scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
  },
  activated() {
    window.scrollTo(0, this.scrollTop);
  }
};
</script>
<style scoped>
.el-table >>> .warning-row {
  background: #f5f5f5 !important;
}
.el-table .success-row {
  background: #fff;
}
.el-table >>> thead {
  font-size: 13px;
}
.el-tag {
  padding: 0 4px;
  font-size: 14px;
  line-height: 26px;
  height: 26px;
}
.iconStyle {
  font-weight: bold;
  font-size: 20px;
  color: #000;
  vertical-align: top;
  margin-top: 12px;
}
.picName {
  border: 1px solid rgb(139, 195, 74);
  width: 74%;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin-left: 10px;
  text-align: center;
  color: #000;
  border-radius: 3px;
  margin-bottom: 10px;
}
.addAttr {
  position: absolute;
  top: 0;
  left: 45%;
}
  .uploader-example {
    width: 500px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
