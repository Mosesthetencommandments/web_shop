import request from '@/utils/request'
// 客户管理
// 获取用户列表
export function getCustomerShopList(param) {
  return request({
    url: 'api/customer/getCustomerShopList',
    method: 'post',
    data: param
  })
}
export function createCustomerGoldRecord(param) {
  return request({
    url: 'api/customer/createCustomerGoldRecord',
    method: 'post',
    data: param
  })
}
// 获取会员升级记录列表
/*export function getShopMemberLevelRecordList(param) {
  return request({
    url: 'api/customer/getShopMemberLevelRecordList',
    method: 'post',
    data: param
  })
}*/
// 编辑客户信息
export function updateCustomerShop(param) {
  return request({
    url: 'api/customer/updateCustomerShop',
    method: 'post',
    data: param
  })
}
// 查找用户详细信息
export function findCustomerShop(param) {
  return request({
    url: 'api/customer/findCustomerShop',
    method: 'post',
    data: param
  })
}
// 修改用户状态
export function changeCustomerShopStatus(param) {
  return request({
    url: 'api/customer/changeCustomerShopStatus',
    method: 'post',
    data: param
  })
}
// 获取分销等级列表
export function getShopDistributionLevelList(param) {
  return request({
    url: 'api/setting/getShopDistributionLevelList',
    method: 'post',
    data: param
  })
}
// 人工充值
export function updateCustomerPid(param) {
  return request({
    url: 'api/customer/updateCustomerPid',
    method: 'post',
    data: param
  })
}
export function updateCustomerPidTop(param) {
  return request({
    url: 'api/customer/updateCustomerPidTop',
    method: 'post',
    data: param
  })
}
