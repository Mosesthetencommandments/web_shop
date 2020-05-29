import request from '@/utils/request'
// 获取轮盘设置列表
export function getDrawPrizeList(param) {
  return request({
    url: '/api/live/getDrawPrizeList',
    method: 'post',
    data: param
  })
}
// 获取轮盘开播状态
export function updatePrizeStatus(param) {
  return request({
    url: '/api/live/updatePrizeStatus ',
    method: 'post',
    data: param
  })
}
// 获取类型
export function getPrizeList(param) {
  return request({
    url: '/api/live/getPrizeList ',
    method: 'post',
    data: param
  })
}
// // 获取轮盘开播状态
// export function findPrizeStatus(param) {
//   return request({
//     url: '/api/live/findPrizeStatus',
//     method: 'post',
//     data: param
//   })
// }
// 获取轮盘状态ID
export function findPrizeStatus(param) {
  return request({
    url: '/api/live/findPrizeStatus',
    method: 'post',
    data: param
  })
}
// 获取中奖纪录列表
export function getWinnerDrawRecordList(param) {
  return request({
    url: '/api/live/getWinnerDrawRecordList',
    method: 'post',
    data: param
  })
}
// 修改轮盘
export function updateDrawPrizeInfo(param) {
  return request({
    url: '/api/live/updateDrawPrizeInfo',
    method: 'post',
    data: param
  })
}
// 获取轮盘设置列表查看详情
export function findDrawPrizeInfo(param) {
  return request({
    url: '/api/live/findDrawPrizeInfo',
    method: 'post',
    data: param
  })
}
//创建轮盘信息
export function createDrawPrize(param) {
  return request({
    url: '/api/live/createDrawPrize',
    method: 'post',
    data: param
  })
}
//新建直播间
export function createRoom(id) {
  return request({
    url: 'api/live/register',
    method: 'post',
    data: id
  })
}
//获取直播间数据
export function getBroadcast(param) {
  return request({
    url: 'api/live/anchorList',
    method: 'get',
    data: param
  })
}
//获取直播推流数据
export function getliveStream(param) {
  return request({
    url: '/api/live/liveStream',
    method: 'post',
    data: param
  })
}

//开播关播
export function beginshow(param) {
  return request({
    url: 'api/live/beginShow',
    method: 'post',
    data: param
  })
}

//修改直播间信息
export function changeInfo(param) {
  return request({
    url: '/api/live/updateAnchorOrLiveRoomInfo',
    method: 'post',
    data: param
  })
}

//获取直播间候选商品
export function getLiveGods(param) {
  return request({
    url: '/api/live/getLiveGoodsList',
    method: 'post',
    data: param
  })
}

//获取商品列表
export function getALLGods(param) {
  return request({
    url: '/api/goods/getShopGoodsList',
    method: 'post',
    data:param
  })
}

//修改直播间主播信息
// export function changeLiveInfo(param) {
//   return request({
//     url: '/api/live/updateAnchorInfo',
//     method: 'post',
//     data:param
//   })
// }

//选择直播间主推商品
export function masterPush(param){
  return request({
    url:"/api/live/updateMasterPush",
    method:'post',
    data:param
  })
}

//修改商品推送介绍
export function changeIntroduce(param){
  return request({
    url:"/api/live/updateLiveGoods",
    method:'post',
    data:param
  })
}

//直播间添加绑定商品
export function addToLive(param) {
  return request({
    url: '/api/live/addLiveGoods',
    method: 'post',
    data:param
  })
}

//直播间删除绑定商品
export function deleteToLive(param) {
  return request({
    url: '/api/live/delLiveGoodsInfo',
    method: 'post',
    data:param
  })
}

//获取直播流二维码
export function getLiveCode(param) {
  return request({
    url: '/api/live/createLiveStreamImg',
    method: 'post',
    data:param
  })
}
//获取直播录制视频列表
export function getVideoList(param) {
  return request({
    url:"/api/vod/getVodVideoList",
    method:'post',
    data:param
  })
}
//获取直播录制视频详情
export function getVideoInfo(param) {
  return request({
    url:"/api/vod/getVodVideoInfo",
    method:'post',
    data:param
  })
}

//添加直播录制视频
export function addVideoInfo(param){
  return request({
    url:"/api/vod/addVideoRecord",
    method:'post',
    data:param
  })
}

//查看直播间下所有的视频
export function getLiveVideoList(param) {
  return request({
    url:"/api/vod/getLiveRoomInfoList",
    method:'post',
    data:param
  })
}

//删除直播间某条视频
export function deleteVideoInfo(param){
  return request({
    url:"/api/vod/delVideoVodInfo",
    method:'post',
    data:param
  })
}

//直播间海报二维码
export function ercodePosition(param){
  return request({
    url:"/api/poster/createLivePosterTemplate",
    method:'post',
    data:param
  })
}

//获取海报详情
export function getPoster(param){
  return request({
    url:"/api/poster/getLivePosterTemplateInfo",
    method:'post',
    data:param
  })
}


//直播间拉黑
export function pullBlackList(param){
  return request({
    url:"/api/blacklist/pullBlack",
    method:'post',
    data:param
  })
}

//直播间黑名单
export function getLiveBlackList(param){
  return request({
    url:"/api/blacklist/getBlacklistList",
    method:'post',
    data:param
  })
}

//直播间解除黑名单
export function removeBlackList(param){
  return request({
    url:"/api/blacklist/removeBlacklist",
    method:'post',
    data:param
  })
}

//获取直播间弹幕
export function getRoomDanmuList(param){
  return request({
    url:"/api/barrage/getBarrageList",
    method:'post',
    data:param
  })
}

//获取单个用户弹幕
export function getRoomCustomerDanmuList(param){
  return request({
    url:"/api/barrage/getCustomerBarrageList",
    method:'post',
    data:param
  })
}
