import request from '@/utils/request'
// 获取所有列表
export function getAfterSaleList(param) {
  return request({
    url: '/api/aftersale/getAfterSaleList',
    method: 'post',
    data: param
  })
}
// 获取详细信息
export function getAfterSaleInfo(param) {
  return request({
    url: '/api/aftersale/getAfterSaleInfo',
    method: 'post',
    data: param
  })
}
// 编辑返款账号信息
export function updateAfterSaleRefund(param) {
  return request({
    url: '/api/aftersale/updateAfterSaleRefund',
    method: 'post',
    data: param
  })
}
// 售后人员操作
export function updateAfterSaleOperation(param) {
  return request({
    url: '/api/aftersale/updateAfterSaleOperation',
    method: 'post',
    data: param
  })
}
// 售后单操作退款
export function updateAfterSaleFinance(param) {
  return request({
    url: '/api/aftersale/updateAfterSaleFinance',
    method: 'post',
    data: param
  })
}
// 获取退款账户类型
export function getAfterSaleReceiveTypeList(param) {
  return request({
    url: '/api/aftersale/getAfterSaleReceiveTypeList',
    method: 'post',
    data: param
  })
}
