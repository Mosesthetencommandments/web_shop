import request from '@/utils/request'
// 获取所有列表
export function updateAgentGoodsExportCount(param) {
  return request({
    url: '/api/agent/updateAgentGoodsExportCount',
    method: 'post',
    data: param
  })
}
export function getAgentGoodsGradePriceInfo(param) {
  return request({
    url: '/api/agent/getAgentGoodsGradePriceInfo',
    method: 'post',
    data: param
  })
}
export function getCustomerAgentList(param) {
  return request({
    url: '/api/agent/getCustomerAgentList',
    method: 'post',
    data: param
  })
}
export function updateCustomerAgent(param) {
  return request({
    url: '/api/agent/updateCustomerAgent',
    method: 'post',
    data: param
  })
}
export function getCustomerAgentInfo(param) {
  return request({
    url: '/api/agent/getCustomerAgentInfo',
    method: 'post',
    data: param
  })
}
export function createCustomerAgent(param) {
  return request({
    url: '/api/agent/createCustomerAgent',
    method: 'post',
    data: param
  })
}
export function createAgentGoods(param) {
  return request({
    url: '/api/agent/createAgentGoods',
    method: 'post',
    data: param
  })
}
export function getAgentGoodsList(param) {
  return request({
    url: '/api/agent/getAgentGoodsList',
    method: 'post',
    data: param
  })
}
export function findAgentGoodsInfo(param) {
  return request({
    url: '/api/agent/findAgentGoodsInfo',
    method: 'post',
    data: param
  })
}
export function updateAgentGoods(param) {
  return request({
    url: '/api/agent/updateAgentGoods',
    method: 'post',
    data: param
  })
}
export function getAgentGoodsApprovalRecordList(param) {
  return request({
    url: '/api/agent/getAgentGoodsApprovalRecordList',
    method: 'post',
    data: param
  })
}
export function updateAgentGoodsAgreeApproval(param) {
  return request({
    url: '/api/agent/updateAgentGoodsAgreeApproval',
    method: 'post',
    data: param
  })
}
export function getAgentGoodsReportList(param) {
  return request({
    url: '/api/agent/getAgentGoodsReportList',
    method: 'post',
    data: param
  })
}
export function dismountAgentGoods(param) {
  return request({
    url: '/api/agent/dismountAgentGoods',
    method: 'post',
    data: param
  })
}




