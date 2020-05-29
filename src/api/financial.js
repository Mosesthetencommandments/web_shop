import request from '@/utils/request'
// 查看详情
export function findShopBalanceWithdrawRecordInfo(param) {
  return request({
    url: 'api/financial/findShopBalanceWithdrawRecordInfo',
    method: 'post',
    data: param
  })
}
// 查询余额
export function getShopBalanceProfitRecordList(param) {
  return request({
    url: 'api/financial/getShopBalanceProfitRecordList',
    method: 'post',
    data: param
  })
}
// // 查询用户余额提现详情
// export function findShopBalanceWithdrawRecordInfo(param) {
//   return request({
//     url: 'api/financial/findShopBalanceWithdrawRecordInfo',
//     method: 'post',
//     data: param
//   })
// }
// 驳回用户余额提现申请
export function noPassShopBalanceWithdrawRecord(param) {
  return request({
    url: 'api/financial/noPassShopBalanceWithdrawRecord',
    method: 'post',
    data: param
  })
}
// 通过用户余额提现申请
export function passShopBalanceWithdrawRecord(param) {
  return request({
    url: 'api/financial/passShopBalanceWithdrawRecord',
    method: 'post',
    data: param
  })
}
// 获取佣金记录列表
export function getShopDistributionProfitRecordList(param) {
  return request({
    url: 'api/financial/getShopDistributionProfitRecordList',
    method: 'post',
    data: param
  })
}
//  查询拼团记录列表
export function getShopAssembleRecordList(param) {
  return request({
    url: 'api/financial/getShopAssembleRecordList',
    method: 'post',
    data: param
  })
}
// 获取金币日志记录列表
export function getShopGoldRecordList(param) {
  return request({
    url: 'api/financial/getShopGoldRecordList',
    method: 'post',
    data: param
  })
}
// 获取用户，会员，以及分销会员列表
export function getCustomerAccountList(param) {
  return request({
    url: 'api/financial/getCustomerAccountList',
    method: 'post',
    data: param
  })
}
// 获取用户余额记录列表
export function getShopBalanceRecordList(param) {
  return request({
    url: 'api/financial/getShopBalanceRecordList',
    method: 'post',
    data: param
  })
}
// 获取余额提现记录列表
export function getShopBalanceWithdrawRecordList(param) {
  return request({
    url: 'api/financial/getShopBalanceWithdrawRecordList',
    method: 'post',
    data: param
  })
}
// 佣金
// 获取佣金提现记录列表
export function getShopDistributionProfitWithdrawRecordList(param) {
  return request({
    url: 'api/financial/getShopDistributionProfitWithdrawRecordList',
    method: 'post',
    data: param
  })
}
// 通过分销商收益提现申请
export function passShopDistributionProfitWithdrawRecord(param) {
  return request({
    url: 'api/financial/passShopDistributionProfitWithdrawRecord',
    method: 'post',
    data: param
  })
}
// 驳回分销商收益提现申请
export function noPassShopDistributionProfitWithdrawRecord(param) {
  return request({
    url: 'api/financial/noPassShopDistributionProfitWithdrawRecord',
    method: 'post',
    data: param
  })
}
// 查询分销商收益提现详情
export function findShopDistributionProfitWithdrawRecordInfo(param) {
  return request({
    url: 'api/financial/findShopDistributionProfitWithdrawRecordInfo',
    method: 'post',
    data: param
  })
}
// 人工充值
// 获取人工充值记录列表
export function getShopBalanceManualRechargeRecordList(param) {
  return request({
    url: '/api/financial/getShopBalanceManualRechargeRecordList',
    method: 'post',
    data: param
  })
}
// 人工充值--审核通过
export function passShopBalanceManualRechargeRecord(param) {
  return request({
    url: '/api/financial/passShopBalanceManualRechargeRecord',
    method: 'post',
    data: param
  })
}
// 人工充值--拒绝
export function rejectShopBalanceManualRechargeRecord(param) {
  return request({
    url: '/api/financial/rejectShopBalanceManualRechargeRecord',
    method: 'post',
    data: param
  })
}
// 查询人工充值详情
export function getShopBalanceManualRechargeRecordInfo(param) {
  return request({
    url: '/api/financial/getShopBalanceManualRechargeRecordInfo',
    method: 'post',
    data: param
  })
}
