import request from '@/utils/request'
// 获取拼团列表
export function uploadImage(param) {
  return request({
    url: '/api/document/uploadImage',
    method: 'post',
    data: param
  })
}
