import request from '@/utils/request'
//获取活动海报列表
export function getActivePosterList(params){
  return request({
    url:'/api/activity/getShopActivityPosterList',
    method:'post',
    data:params
  })
}

//获取活动海报详情
export function getActivePosterInfo(params){
  return request({
    url:'/api/activity/getShopActivityPosterInfo',
    method:'post',
    data:params
  })
}

//修改活动海报
export function changeActivePoster(params){
  return request({
      url:'/api/activity/updateShopActivityPoster',
      method:'post',
      data:params
  })
}