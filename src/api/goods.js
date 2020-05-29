import request from '@/utils/request'
// 免费领会员列表
export function getShopGoodsMemberInfoList(param) {
  return request({
    url: '/api/goods/getShopGoodsMemberInfoList',
    method: 'post',
    data: param
  })
}
// 免费领会员用户列表删除
export function deleteShopGoodsMemberCustomer(param) {
  return request({
    url: '/api/goods/deleteShopGoodsMemberCustomer',
    method: 'post',
    data: param
  })
}
// 免费领会员用户列表查看详情
export function findShopGoodsMemberCustomer(param) {
  return request({
    url: '/api/goods/findShopGoodsMemberCustomer',
    method: 'post',
    data: param
  })
}
// 免费领会员用户列表修改
export function updateShopGoodsMemberCustomer(param) {
  return request({
    url: '/api/goods/updateShopGoodsMemberCustomer',
    method: 'post',
    data: param
  })
}
// 免费领会员添加
export function createShopGoodsMemberInfo(param) {
  return request({
    url: '/api/goods/createShopGoodsMemberInfo',
    method: 'post',
    data: param
  })
}
// 免费领会员详情
export function findShopGoodsMemberInfo(param) {
  return request({
    url: '/api/goods/findShopGoodsMemberInfo',
    method: 'post',
    data: param
  })
}
// 免费领会员修改
export function updateShopGoodsMemberInfo(param) {
  return request({
    url: '/api/goods/updateShopGoodsMemberInfo',
    method: 'post',
    data: param
  })
}
// 会员用户列表
export function getShopGoodsMemberCustomerList(param) {
  return request({
    url: '/api/goods/getShopGoodsMemberCustomerList',
    method: 'post',
    data: param
  })
}
// 免费领会员删除
export function deleteShopGoodsMemberInfo(param) {
  return request({
    url: '/api/goods/deleteShopGoodsMemberInfo',
    method: 'post',
    data: param
  })
}
// 获取免费领会员分组的商品
export function getShopGoodsGroupList(param) {
  return request({
    url: '/api/goods/getShopGoodsGroupList',
    method: 'post',
    data: param
  })
}
// 积分商品列表
export function getShopGoodsIntegralList(param) {
  return request({
    url: '/api/goods/getShopGoodsIntegralList',
    method: 'post',
    data: param
  })
}
// 积分商品兑换
export function updateShopGoodsIntegralStatus(param) {
  return request({
    url: '/api/goods/updateShopGoodsIntegralStatus',
    method: 'post',
    data: param
  })
}
// 积分商品兑换删除
export function delIntegralShopGoodsInfo(param) {
  return request({
    url: '/api/goods/delIntegralShopGoodsInfo',
    method: 'post',
    data: param
  })
}
// 获取商品基础信息列表
export function getShopGoodsCommonList(param) {
  return request({
    url: '/api/goods/getShopGoodsCommonList',
    method: 'post',
    data: param
  })
}
// 获取公共商品详情
export function getShopGoodsCommonInfo(param) {
  return request({
    url: '/api/goods/getShopGoodsCommonInfo',
    method: 'post',
    data: param
  })
}
// 获取商品基础信息列表
export function getBrandList(param) {
  return request({
    url: '/api/goods/getBrandList',
    method: 'post',
    data: param
  })
}
export function getOrdersAreaList(param) {
  return request({
    url: '/api/goods/getOrdersAreaList',
    method: 'post',
    data: param
  })
}
// 创建商品基础信息
export function createShopGoodsCommon(param) {
  return request({
    url: '/api/goods/createShopGoodsCommon',
    method: 'post',
    data: param
  })
}
// 修改商品基础信息
export function updateShopGoodsCommon(param) {
  return request({
    url: '/api/goods/updateShopGoodsCommon',
    method: 'post',
    data: param
  })
}
// 规格设置
export function getShopGoodsList(param) {
  return request({
    url: '/api/goods/getShopGoodsList',
    method: 'post',
    data: param
  })
}
// 规格设置创建
export function createProductGoods(param) {
  return request({
    url: '/api/goods/createProductGoods',
    method: 'post',
    data: param
  })
}
// 规格设置编辑
export function updateShopGoods(param) {
  return request({
    url: '/api/goods/updateShopGoods',
    method: 'post',
    data: param
  })
}
// 所属产品
export function getProductList(param) {
  return request({
    url: '/api/goods/getProductList',
    method: 'post',
    data: param
  })
}
export function changeShopGoodsStatus(param) {
  return request({
    url: '/api/goods/changeShopGoodsStatus',
    method: 'post',
    data: param
  })
}
// 获取商品分类树
export function getShopGoodsCategoryTree(param) {
  return request({
    url: '/api/goods/getShopGoodsCategoryTree',
    method: 'post',
    data: param
  })
}
export function getProductGoodsSkuList(param) {
  return request({
    url: '/api/goods/getProductGoodsSkuList',
    method: 'post',
    data: param
  })
}

export function createShopGoodsCategory(param) {
  return request({
    url: '/api/goods/createShopGoodsCategory',
    method: 'post',
    data: param
  })
}
export function updateShopGoodsCategory(param) {
  return request({
    url: '/api/goods/updateShopGoodsCategory',
    method: 'post',
    data: param
  })
}
export function changeShopGoodsCategoryStatus(param) {
  return request({
    url: '/api/goods/changeShopGoodsCategoryStatus',
    method: 'post',
    data: param
  })
}
export function getShopGoodsDetailList(param) {
  return request({
    url: '/api/goods/getShopGoodsDetailList',
    method: 'post',
    data: param
  })
}
export function createShopGoodsDetail(param) {
  return request({
    url: '/api/goods/createShopGoodsDetail',
    method: 'post',
    data: param
  })
}
export function updateShopGoodsDetail(param) {
  return request({
    url: '/api/goods/updateShopGoodsDetail',
    method: 'post',
    data: param
  })
}
export function deleteShopGoodsDetail(param) {
  return request({
    url: '/api/goods/deleteShopGoodsDetail',
    method: 'post',
    data: param
  })
}

export function getProductGoodsList(param) {
  return request({
    url: '/api/goods/getProductGoodsList',
    method: 'post',
    data: param
  })
}
// 评价列表
// 获取商品评价列表
export function getShopGoodsCommonCommentsList(param) {
  return request({
    url: '/api/goods/getShopGoodsCommonCommentsList',
    method: 'post',
    data: param
  })
}
// 修改商品评论状态
export function changeShopGoodsCommonCommentsStatus(param) {
  return request({
    url: '/api/goods/changeShopGoodsCommonCommentsStatus',
    method: 'post',
    data: param
  })
}
// 创建商品回复
export function createShopGoodsCommonCommentsReply(param) {
  return request({
    url: '/api/goods/createShopGoodsCommonCommentsReply',
    method: 'post',
    data: param
  })
}
// 修改商品回复状态
export function changeShopGoodsCommonCommentReplysStatus(param) {
  return request({
    url: '/api/goods/changeShopGoodsCommonCommentReplysStatus',
    method: 'post',
    data: param
  })
}
// 会员价格明细
// 获取会员等级商品价格列表
export function getShopGoodsMemberPriceList(param) {
  return request({
    url: '/api/goods/getShopGoodsMemberPriceList',
    method: 'post',
    data: param
  })
}
// 创建会员等级商品价格
export function createShopGoodsMemberPrice(param) {
  return request({
    url: '/api/goods/createShopGoodsMemberPrice',
    method: 'post',
    data: param
  })
}
// 修改会员等级商品价格
export function updateShopGoodsMemberPrice(param) {
  return request({
    url: '/api/goods/updateShopGoodsMemberPrice',
    method: 'post',
    data: param
  })
}
// 分销价格明细
// 获取分销会员等级商品价格列表
export function getShopDistributionLevelPriceList(param) {
  return request({
    url: '/api/goods/getShopDistributionLevelPriceList',
    method: 'post',
    data: param
  })
}
// 创建分销等级商品价格
export function createShopGoodsDistributionPrice(param) {
  return request({
    url: '/api/goods/createShopGoodsDistributionPrice',
    method: 'post',
    data: param
  })
}
// 修改分销等级商品价格
export function updateShopGoodsDistributionPrice(param) {
  return request({
    url: '/api/goods/updateShopGoodsDistributionPrice',
    method: 'post',
    data: param
  })
}
// 获取分组列表
export function getGroupList(param) {
  return request({
    url: '/api/goods/getGroupList',
    method: 'post',
    data: param
  })
}

// 获取商品分佣明细
export function getGoodsDistributionRule(param) {
  return request({
    url: '/api/goods/getGoodsDistributionRule',
    method: 'post',
    data: param
  })
}
// 更新商品分佣明细
export function updateGoodsDistributionRule(param) {
  return request({
    url: '/api/goods/updateGoodsDistributionRule',
    method: 'post',
    data: param
  })
}
