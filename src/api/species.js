import request from '@/utils/request'

export function getShopSpeciesList(param) {
  return request({
    url: '/api/goods/getShopSpeciesList',
    method: 'post',
    data: param
  })
}

export function createShopSpecies(param) {
  return request({
    url: '/api/goods/createShopSpecies',
    method: 'post',
    data: param
  })
}

export function updateShopSpecies(param) {
  return request({
    url: '/api/goods/updateShopSpecies',
    method: 'post',
    data: param
  })
}

export function deleteShopSpecies(param) {
  return request({
    url: '/api/goods/deleteShopSpecies',
    method: 'post',
    data: param
  })
}

export function createShopSpeciesValue(param) {
  return request({
    url: '/api/goods/createShopSpeciesValue',
    method: 'post',
    data: param
  })
}

export function updateShopSpeciesValue(param) {
  return request({
    url: '/api/goods/updateShopSpeciesValue',
    method: 'post',
    data: param
  })
}

export function getShopSpeciesValueList(param) {
  return request({
    url: '/api/goods/getShopSpeciesValueList',
    method: 'post',
    data: param
  })
}

export function deleteShopSpeciesValue(param) {
  return request({
    url: '/api/goods/deleteShopSpeciesValue',
    method: 'post',
    data: param
  })
}
