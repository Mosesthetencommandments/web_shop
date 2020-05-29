import request from '@/utils/request'

// 获取拼团列表
export function getShopAssembleList(param) {
  return request({
    url: '/api/activity/getShopAssembleList',
    method: 'post',
    data: param
  })
}
// 增加拼团
export function createShopAssemble(param) {
  return request({
    url: '/api/activity/createShopAssemble',
    method: 'post',
    data: param
  })
}
// 修改拼团状态
export function changeShopAssembleStatus(param) {
  return request({
    url: '/api/activity/changeShopAssembleStatus',
    method: 'post',
    data: param
  })
}
// 获取商品拼团列表
export function getShopAssembleProductGoods(param) {
  return request({
    url: '/api/activity/getShopAssembleProductGoods',
    method: 'post',
    data: param
  })
}
// 修改拼团信息
export function updateShopAssemble(param) {
  return request({
    url: 'api/activity/updateShopAssemble',
    method: 'post',
    data: param
  })
}
// 查找拼团详细信息
export function findShopAssemble(param) {
  return request({
    url: '/api/activity/findShopAssemble',
    method: 'post',
    data: param
  })
}
