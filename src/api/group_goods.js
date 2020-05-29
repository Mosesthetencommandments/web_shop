import request from '@/utils/request'

// 获取商品分组列表
export function getShopGoodsGroupList(param) {
  return request({
    url: '/api/goods/getShopGoodsGroupList',
    method: 'post',
    data: param
  })
}
// 创建商品分组
export function createShopGoodsGroup(param) {
  return request({
    url: '/api/goods/createShopGoodsGroup',
    method: 'post',
    data: param
  })
}
// 更新商品分组
export function updateShopGoodsGroup(param) {
  return request({
    url: '/api/goods/updateShopGoodsGroup',
    method: 'post',
    data: param
  })
}
// 删除商品分组
export function deleteShopGoodsGroup(param) {
  return request({
    url: '/api/goods/deleteShopGoodsGroup',
    method: 'post',
    data: param
  })
}
// 获取分组商品列表
export function getGoodsGroupRelationList(param) {
  return request({
    url: '/api/goods/getGoodsGroupRelationList',
    method: 'post',
    data: param
  })
}
// 添加分组商品
export function createGroupGood(param) {
  return request({
    url: '/api/goods/createGroupGood',
    method: 'post',
    data: param
  })
}
// 更新分组商品
export function updateGroupGood(param) {
  return request({
    url: '/api/goods/updateGroupGood',
    method: 'post',
    data: param
  })
}
// 删除分组商品
export function deleteGroupGood(param) {
  return request({
    url: '/api/goods/deleteGroupGood',
    method: 'post',
    data: param
  })
}
