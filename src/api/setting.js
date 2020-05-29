import request from '@/utils/request'
// 商城基础设置
// 获取商城详细信息
export function getShopSystemConfigList(param) {
  return request({
    url: 'api/setting/getShopSystemConfigList',
    method: 'post',
    data: param
  })
}
// 获取海报列表
export function getShopPosterTemplateList(param) {
  return request({
    url: 'api/setting/getShopPosterTemplateList',
    method: 'post',
    data: param
  })
}
// 海报修改状态
export function updateShopPosterTempStatus(param) {
  return request({
    url: 'api/setting/updateShopPosterTempStatus',
    method: 'post',
    data: param
  })
}
// 获取海报列表删除
export function deleteShopPosterTemplate(param) {
  return request({
    url: 'api/setting/deleteShopPosterTemplate',
    method: 'post',
    data: param
  })
}
// 海报
export function createShopPosterTemplate(param) {
  return request({
    url: 'api/setting/createShopPosterTemplate',
    method: 'post',
    data: param
  })
}
// 海报获取详情
export function getShopPosterTemplateInfo(param) {
  return request({
    url: 'api/setting/getShopPosterTemplateInfo',
    method: 'post',
    data: param
  })
}
// 海报修改
export function updateShopPosterTemplate(param) {
  return request({
    url: 'api/setting/updateShopPosterTemplate',
    method: 'post',
    data: param
  })
}
// 修改商城配置项
export function updateShopSystemConfig(param) {
  return request({
    url: 'api/setting/updateShopSystemConfig',
    method: 'post',
    data: param
  })
}
// 获取会员等级列表
export function getShopMemberlevelList(param) {
  return request({
    url: 'api/setting/getShopMemberlevelList',
    method: 'post',
    data: param
  })
}
// 增加会员等级
export function createShopMemberlevel(param) {
  return request({
    url: 'api/setting/createShopMemberlevel',
    method: 'post',
    data: param
  })
}
// 修改会员等级信息
export function updateShopMemberlevel(param) {
  return request({
    url: 'api/setting/updateShopMemberlevel',
    method: 'post',
    data: param
  })
}
// 修改会员等级状态
export function changeShopMemberlevelStatus(param) {
  return request({
    url: 'api/setting/changeShopMemberlevelStatus',
    method: 'post',
    data: param
  })
}
// 查询会员等级详情
export function findShopMemberLevel(param) {
  return request({
    url: 'api/setting/findShopMemberLevel',
    method: 'post',
    data: param
  })
}
// ----------优惠券----------
// 发放优惠券
export function createShopCustomerCoupon(param) {
  return request({
    url: 'api/setting/createShopCustomerCoupon',
    method: 'post',
    data: param
  })
}
// 获取优惠券列表
export function getShopCouponList(param) {
  return request({
    url: 'api/setting/getShopCouponList',
    method: 'post',
    data: param
  })
}
// 添加优惠券
export function createShopCoupon(param) {
  return request({
    url: 'api/setting/createShopCoupon',
    method: 'post',
    data: param
  })
}
// 修改优惠券库存
export function updateShopCouponNumber(param) {
  return request({
    url: 'api/setting/updateShopCouponNumber',
    method: 'post',
    data: param
  })
}
// 修改优惠券
export function updateShopCoupon(param) {
  return request({
    url: 'api/setting/updateShopCoupon',
    method: 'post',
    data: param
  })
}
// 修改优惠券状态
export function changeShopCouponStatus(param) {
  return request({
    url: 'api/setting/changeShopCouponStatus',
    method: 'post',
    data: param
  })
}
// 获取优惠券详细信息接口
export function findShopCoupon(param) {
  return request({
    url: 'api/setting/findShopCoupon',
    method: 'post',
    data: param
  })
}
// 获取优惠券类型列表
export function getShopCouponTypeList(param) {
  return request({
    url: 'api/setting/getShopCouponTypeList',
    method: 'post',
    data: param
  })
}
// 获取优惠券类型详细信息
export function findShopCouponType(param) {
  return request({
    url: 'api/setting/findShopCouponType',
    method: 'post',
    data: param
  })
}
// 分销
// 获取分销等级列表
export function getShopDistributionLevelList(param) {
  return request({
    url: 'api/setting/getShopDistributionLevelList',
    method: 'post',
    data: param
  })
}
// 创建分销等级
export function createShopDistributionLevel(param) {
  return request({
    url: 'api/setting/createShopDistributionLevel',
    method: 'post',
    data: param
  })
}
// 修改分销等级信息
export function updateShopDistributionLevel(param) {
  return request({
    url: 'api/setting/updateShopDistributionLevel',
    method: 'post',
    data: param
  })
}
// 删除分销等级信息
export function deleteShopDistributionLevel(param) {
  return request({
    url: 'api/setting/deleteShopDistributionLevel',
    method: 'post',
    data: param
  })
}
// 修改分销等级状态
export function changeShopDistributionLevelStatus(param) {
  return request({
    url: 'api/setting/changeShopDistributionLevelStatus',
    method: 'post',
    data: param
  })
}
// 获取分销等级详细信息
export function findShopDistributionLevel(param) {
  return request({
    url: 'api/setting/findShopDistributionLevel',
    method: 'post',
    data: param
  })
}
// 分销会员直升
// 获取分销会员直升列表
export function getShopDistributionLevelUpruleGoodsList(param) {
  return request({
    url: 'api/setting/getShopDistributionLevelUpruleGoodsList',
    method: 'post',
    data: param
  })
}
// 创建分销会员直升商品
export function createShopDistributionLevelUpruleGoods(param) {
  return request({
    url: 'api/setting/createShopDistributionLevelUpruleGoods',
    method: 'post',
    data: param
  })
}
// 修改分销会员直升商品
export function deleteShopDistributionLevelUpruleGoods(param) {
  return request({
    url: 'api/setting/deleteShopDistributionLevelUpruleGoods',
    method: 'post',
    data: param
  })
}
// 轮播图
// 获取商城bunner列表
export function getShopBannerList(param) {
  return request({
    url: '/api/setting/getShopBannerList',
    method: 'post',
    data: param
  })
}
// 查询商城店铺轮播图详情
export function getShopBannerInfo(param) {
  return request({
    url: '/api/setting/getShopBannerInfo',
    method: 'post',
    data: param
  })
}
//  创建商城店铺轮播图
export function createShopBanner(param) {
  return request({
    url: '/api/setting/createShopBanner',
    method: 'post',
    data: param
  })
}
// 修改商城店铺轮播图
export function updateShopBanner(param) {
  return request({
    url: '/api/setting/updateShopBanner',
    method: 'post',
    data: param
  })
}
// 删除商城店铺轮播图
export function deleteShopBanner(param) {
  return request({
    url: '/api/setting/deleteShopBanner',
    method: 'post',
    data: param
  })
}
// 获取仓库列表
export function getWarehouseList(param) {
  return request({
    url: '/api/setting/getWarehouseList',
    method: 'post',
    data: param
  })
}
// 获取微信菜单列表
export function getShopWxMenuList(param) {
  return request({
    url: '/api/setting/getShopWxMenuList',
    method: 'post',
    data: param
  })
}
// 创建微信菜单列表
export function createShopWxMenu(param) {
  return request({
    url: '/api/setting/createShopWxMenu',
    method: 'post',
    data: param
  })
}
// 获取微信菜单信息
export function findShopWxMenu(param) {
  return request({
    url: '/api/setting/findShopWxMenu',
    method: 'post',
    data: param
  })
}
// 修改微信菜单信息
export function updateShopWxMenu(param) {
  return request({
    url: '/api/setting/updateShopWxMenu',
    method: 'post',
    data: param
  })
}
// 删除微信菜单信息
export function deleteShopWxMenu(param) {
  return request({
    url: '/api/setting/deleteShopWxMenu',
    method: 'post',
    data: param
  })
}
// 发布微信菜单信息
export function postShopWxMenu(param) {
  return request({
    url: '/api/setting/postShopWxMenu',
    method: 'post',
    data: param
  })
}
