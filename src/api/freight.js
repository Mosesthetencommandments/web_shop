import request from '@/utils/request'

// 获取邮费模板列表
export function getFreightTemplateList(param) {
  return request({
    url: '/api/goods/getFreightTemplateList',
    method: 'post',
    data: param
  })
}
// 获取邮费模板信息
export function getFreightTemplateInfo(param) {
  return request({
    url: '/api/goods/getFreightTemplateInfo',
    method: 'post',
    data: param
  })
}
// 修改邮费模板信息
export function updateFreightTemplate(param) {
  return request({
    url: '/api/goods/updateFreightTemplate',
    method: 'post',
    data: param
  })
}
// 创建邮费模板信息
export function createFreightTemplate(param) {
  return request({
    url: '/api/goods/createFreightTemplate',
    method: 'post',
    data: param
  })
}
// 移除邮费模板信息
export function deleteFreightTemplate(param) {
  return request({
    url: '/api/goods/deleteFreightTemplate',
    method: 'post',
    data: param
  })
}
