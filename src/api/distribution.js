import request from '@/utils/request'

// 分销客户管理
// 查询用户余额提现详情
export function getCustomerAccountList(param) {
  return request({
    url: 'api/distribution/getCustomerAccountList',
    method: 'post',
    data: param
  })
}
// 获取分销佣金明细列表
export function getShopDistributionProfitRecordList(param) {
  return request({
    url: 'api/distribution/getShopDistributionProfitRecordList',
    method: 'post',
    data: param
  })
}
// 获取分销会员升级记录列表
export function getShopDistributionLevelRecordList(param) {
  return request({
    url: 'api/distribution/getShopDistributionLevelRecordList',
    method: 'post',
    data: param
  })
}
// 获取分销团队成员列表
export function getShopDistributionCustomerList(param) {
  return request({
    url: 'api/distribution/getShopDistributionCustomerList',
    method: 'post',
    data: param
  })
}
// 获取分销团订单列表
export function getShopDistributionOrderList(param) {
  return request({
    url: 'api/distribution/getShopDistributionOrderList',
    method: 'post',
    data: param
  })
}
// 获取分销商海报列表
export function getdDistributionPosterList(param) {
  return request({
    url: 'api/distribution/getdDistributionPosterList',
    method: 'post',
    data: param
  })
}
// 查询分销商海报详情
export function getDistributionPosterInfo(param) {
  return request({
    url: 'api/distribution/getDistributionPosterInfo',
    method: 'post',
    data: param
  })
}
// 创建分销商海报
export function createDistributionPoster(param) {
  return request({
    url: 'api/distribution/createDistributionPoster',
    method: 'post',
    data: param
  })
}
// 修改分销商海报
export function updateDistributionPoster(param) {
  return request({
    url: 'api/distribution/updateDistributionPoster',
    method: 'post',
    data: param
  })
}
// 删除分销商海报
export function deleteDistributionPoster(param) {
  return request({
    url: 'api/distribution/deleteDistributionPoster',
    method: 'post',
    data: param
  })
}
