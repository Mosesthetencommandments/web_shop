import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), meta: { hidden: true } },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: { hidden: true },
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },
  {
    path: '/select_account',
    component: _import('user/select_account'),
    name: 'selectAccount',
    meta: { hidden: true }
  }
  // {
  //   path: '*', hidden: true, component: _import('404'), name: '404',
  // }
]
export const asyncRouterMap = [
  {
    path: '/shopMall',
    component: Layout,
    name: 'shopMallset',
    redirect: 'noredirect',
    meta: { title: '商城设置', icon: 'ordersManagement'},
    children: [
      {
        path: 'WxMenu',
        name: 'WxMenu',
        component: _import('shop_config/WxMenu'),
        meta: { title: '微信菜单设置', icon: 'ordersManage'}
      },
      {
        path: 'BasicsSetUp',
        name: 'BasicsSetUp',
        component: _import('shop_config/BasicsSetUp'),
        meta: { title: '基础设置', icon: 'ordersManage'}
      },
      {
        path: 'bannerManage',
        name: 'bannerManage',
        component: _import('shop_config/bannerManage'),
        meta: { title: '轮播图管理', icon: 'ordersManage'}
      },
      {
        path: 'manage',
        name: 'manage',
        component: _import('shop_config/manage'),
        meta: { title: '分享海报设置', icon: 'ordersManage'}
      },
      {
        path: 'communityPostersls',
        name: 'communityPostersls',
        component:_import('shop_config/communityPostersls'),
        meta: {title:'海报添加',hidden:true}
      },
      {
        path: 'communityPostersl',
        name: 'communityPostersl',
        component:_import('shop_config/communityPostersl'),
        meta: {title:'海报修改',hidden:true}
      }
    ]
  },
  {
    path: '/distribution',
    component: Layout,
    name: 'distribution',
    redirect: 'noredirect',
    meta: { title: '分销管理', icon: 'ordersManagement'},
    children: [
      {
        path: 'disLevel',
        name: 'disLevel',
        component: _import('distribution/disLevel'),
        meta: { title: '分销等级', icon: 'ordersManage'}
      }, {
        path: 'posterManage',
        name: 'posterManage',
        component: _import('distribution/posterManage'),
        meta: { title: '海报素材管理', icon: 'ordersManage'}
      }

    ]
  },
  {
    path: '/orders',
    component: Layout,
    name: 'ordersManagement',
    redirect: 'noredirect',
    meta: { title: '订单管理', icon: 'ordersManagement'},
    children: [
      {
        path: 'orders',
        name: 'ordersManage',
        component: _import('orders/orders'),
        meta: { title: '订单查询', icon: 'ordersManage'}
      },
      {
        path: 'orders/:id',
        name: 'ordersDetails',
        component: _import('orders/ordersList'),
        meta: { title: '订单详情', icon: 'ordersList', hidden: true}
      }
    ]
  },
  {
    path: '/Finance',
    component: Layout,
    name: 'financeManage',
    redirect: 'noredirect',
    meta: { title: '财务管理', icon: 'ordersManagement'},
    children: [
      // {
      //   path: 'balanceManage',
      //   name: 'balanceManage',
      //   component: _import('Finance/balanceManage'),
      //   meta: { title: '余额提现管理', icon: 'ordersManage'}
      // },
      // {
      //   path: 'Commission',
      //   name: 'Commission',
      //   component: _import('Finance/Commission'),
      //   meta: { title: '佣金提现管理', icon: 'ordersManage'}
      // },
      {
        path: 'balanceDetail',
        name: 'balanceDetail',
        component: _import('Finance/balanceDetail'),
        meta: { title: '佣金明细查询', icon: 'ordersManage'}
      },
      // {
      //   path: 'commissionDetail',
      //   name: 'commissionDetail',
      //   component: _import('Finance/commissionDetail'),
      //   meta: { title: '佣金明细查询', icon: 'ordersManage'}
      // },
      {
        path: 'goldManagement',
        name: 'goldManagement',
        component: _import('Finance/goldManagement'),
        meta: { title: '贝壳明细查询', icon: 'ordersManage'}
      },
      {
        path: 'balance_cash',
        name: 'balance_cash',
        component: _import('Finance/balance_cash'),
        meta: { title: '余额查询' }
      },
      {
        path: 'balance_Details',
        name: 'balance_Details',
        component: _import('Finance/balance_Details'),
        meta: { title: '提现报表', icon: 'ordersManage' }
      }
      // {
      //   path: 'returnPayment',
      //   name: 'returnPayment',
      //   component: _import('Finance/returnPayment'),
      //   meta: { title: '退货打款管理', icon: 'ordersManage'}
      // },
      // {
      //   path: 'editPaymentStatus',
      //   name: 'editPaymentStatus',
      //   hidden: true,
      //   component: _import('Finance/editPaymentStatus'),
      //   meta: { title: '修改打款状态', icon: 'ordersManage'}
      // }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: 'customerManage',
    redirect: 'noredirect',
    meta: { title: '客户管理', icon: 'ordersManagement'},
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        component: _import('customer/customerList'),
        meta: { title: '客户列表', icon: 'ordersManage'}
      }
      /*{
        path: 'customerManage',
        name: 'customerManage',
        component: _import('customer/customerManage'),
        meta: { title: '分销客户管理', icon: 'ordersManage'}
      }*/
    ]
  },
  {
    path: '/agent',
    component: Layout,
    name: 'agent',
    redirect: 'noredirect',
    meta: { title: '代理管理', icon: 'ordersManagement'},
    children: [
      {
        path: 'agent',
        name: 'agentList',
        component: _import('agent/agentList'),
        meta: { title: '代理列表', icon: 'ordersManage'}
      },
      {
        path: 'commodity',
        name: 'commodity',
        component: _import('agent/commodity'),
        meta: { title: '代理商品', icon: 'ordersManage'}
      },
      {
        path: 'delivery',
        name: 'delivery',
        component: _import('agent/delivery'),
        meta: { title: '进货单', icon: 'ordersManage'}
      },
      {
        path: 'bill',
        name: 'bill',
        component: _import('agent/bill'),
        meta: { title: '提货单', icon: 'ordersManage'}
      },
      {
        path: 'sheet',
        name: 'sheet',
        component: _import('agent/sheet'),
        meta: { title: '云仓库存报表', icon: 'ordersManage'}
      },
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: 'GoodsManagement',
    redirect: 'noredirect',
    meta: { title: '商品管理', icon: 'purchaseSellManagement'},
    children: [
      {
        path: 'product_management',
        name: 'productManagement',
        component: _import('goods/product_management'),
        meta: { title: '商品管理', icon: 'productManagement'}
      },
      // {
      //   path: 'evalManage',
      //   name: 'evalManage',
      //   component: _import('goods/evalManage'),
      //   meta: { title: '评价管理', icon: 'inventoryStatistics'}
      // },
      {
        path: 'species',
        name: 'species',
        component: _import('goods/species'),
        meta: { title: '规格管理', icon: 'inventoryStatistics' }
      },
      {
        path: 'species_value/:species_id',
        name: 'species_value',
        hidden: true,
        component: _import('goods/species_value'),
        meta: { title: '规格明细管理', icon: 'inventoryStatistics', hidden: true }
      },
      {
        path: 'group',
        name: 'group',
        component: _import('goods/group'),
        meta: { title: '分组管理', icon: 'inventoryStatistics'}
      },
      {
        path: 'group_goods/:group_id',
        name: 'group_goods',
        component: _import('goods/group_goods'),
        meta: { title: '分组管理', icon: 'inventoryStatistics', hidden: true }
      },
      {
        path: 'freightTemplate',
        name: 'freightTemplate',
        component: _import('goods/freightTemplate'),
        meta: { title: '邮费模板', icon: 'inventoryStatistics' }
      },
      {
        path: 'speciesl',
        name: 'speciesl',
        component: _import('goods/speciesl'),
        meta: { title: '积分商品', icon: 'inventoryStatistics' }
      }
    ]
  },
  // {
  //   path: '/afterManage',
  //   component: Layout,
  //   name: 'afterManage',
  //   redirect: 'noredirect',
  //   meta: { title: '售后管理', icon: 'ordersManagement'},
  //   children: [
  //     {
  //       path: 'afterManageList',
  //       name: 'afterManageList',
  //       component: _import('afterManage/afterManageList'),
  //       meta: { title: '售后列表', icon: 'ordersManage'}
  //     },{
  //       path: 'afterDetails',
  //       name: 'afterDetails',
  //       hidden: true,
  //       component: _import('afterManage/afterDetails'),
  //       meta: { title: '售后详情', icon: 'ordersManage'}
  //     }
  //   ]
  // },
  {
    path: '/activity',
    component: Layout,
    name: 'activityManage',
    redirect: 'noredirect',
    meta: { title: '活动管理', icon: 'ordersManagement'},
    children: [
      {
        path: 'couponManage',
        name: 'couponManage',
        component: _import('activity/couponManage'),
        meta: { title: '优惠券管理', icon: 'ordersManage'}
      },
      // {
      //   path: 'groupSet',
      //   name: 'groupSet',
      //   component: _import('activity/groupSet'),
      //   meta: { title: '拼团设置', icon: 'ordersManage'}
      // }
      {
        path: 'communityManage',
        name: 'communityManage',
        component:_import('activity/communityManage'),
        meta: { title: '社群海报管理',icon: 'ordersManage'}
      },
      {
        path: 'communityPoster',
        name: 'communityPoster',
        component:_import('activity/communityPoster'),
        meta: {title:'海报修改',hidden:true}
      },
      {
        path: 'communityPosters',
        name: 'communityPosters',
        component:_import('activity/communityPosters'),
        meta: {title:'免费领会员'}
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'userManagement',
    redirect: 'noredirect',
    meta: { title: '用户管理', icon: 'MemberManagement' },
    children: [
      {
        path: 'user_group',
        name: 'userGroupManagement',
        component: _import('user/user_group'),
        meta: { title: '小组管理', icon: 'userGroupManagement' }
      },
      {
        path: 'user',
        name: 'userManage',
        component: _import('user/user'),
        meta: { title: '用户管理', icon: 'MemberManagement' }
      },
      {
        path: 'role',
        name: 'rolesManagement',
        component: _import('user/user_role'),
        meta: { title: '权限管理', icon: 'rolesManagement' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'systemManagement',
    redirect: 'noredirect',
    meta: { title: '系统管理', icon: 'systemManagement' },
    children: [
      {
        path: '/system/setting',
        name: 'systemSetting',
        redirect: 'noredirect',
        component: _import('system/setting/index'),
        meta: { title: '系统设置', icon: 'systemSetting' },
        children: [
          {
            path: 'deliver_address_setting',
            name: 'deliverAddressSetting',
            component: _import('system/setting/deliver_address_setting'),
            meta: { title: '发货仓库设置' }
          },
          {
            path: 'deliver_address_extre',
            name: 'deliverAddressExtre',
            component: _import('system/setting/deliver_address_extre'),
            meta: { title: '发货额外信息' }
          },
          {
            path: 'authMenu_setting',
            name: 'AuthMenuSetting',
            component: _import('system/setting/authMenu_setting'),
            meta: { title: '菜单设置' }
          },
          {
            path: 'auth_setting',
            name: 'AuthSetting',
            component: _import('system/setting/auth_setting'),
            meta: { title: '权限设置' }
          },
          {
            path: 'port_setting',
            name: 'PortSetting',
            component: _import('system/setting/port_setting'),
            meta: { title: 'API设置' }
          }
        ]
      },
      {
        path: 'system/product_goods_management',
        name: 'productGoodsManagement',
        component: _import('system/product/product_goods_management'),
        meta: { title: '产品管理', icon: 'productGoodsManagement' }
      },
      {
        path: 'system/goods_class',
        name: 'productGoodsClass',
        component: _import('system/product/goods_class'),
        meta: { title: '商品分类', icon: 'productGoodsManagement' }
      },
      {
        path: 'system/address_management',
        name: 'addressManagement',
        component: _import('system/address/address_management'),
        meta: { title: '敏感地址管理', icon: 'addressManagement' }
      }
    ]
  },
  {
    path: '/user_center',
    component: Layout,
    name: 'userCenter',
    redirect: 'noredirect',
    meta: { title: '用户中心', icon: 'userCenter' },
    children: [
      {
        path: 'user_center/user_info',
        name: 'infoSetting',
        component: _import('user_center/user_info/user_info'),
        meta: { title: '个人信息设置', icon: 'infoSetting' }
      },
      {
        path: 'user_center/action_history',
        name: 'actionHistory',
        component: _import('user_center/action_history/action_history'),
        meta: { title: '操作记录', icon: 'form' }
      },
      {
        path: 'user_center/message_notification',
        name: 'messageNotification',
        component: _import('user_center/message_notification/message_notification'),
        meta: { title: '消息通知', icon: 'form' }
      },
      {
        path: 'user_center/integral_query',
        name: 'integralQuery',
        component: _import('user_center/integral_query/integral_query'),
        meta: { title: '积分查询', icon: 'integralQuery' }
      }
    ]
  },
  {
    path: '/living_room',
    component: Layout,
    name: 'livingbroadcast',
    redirect: 'noredirect',
    meta:{title:'直播间管理',icon:'systemManagement'},
    children:[
      {
        path:'living_room/setRoom',
        name:'setRoom',
        component:_import('livingbroadcast/setRoom'),
        meta:{title:'主播管理',icon:'from'}
      },
      {
        path:"living_room/getLiveList",
        name:'videoList',
        component:_import('livingbroadcast/videoList'),
        meta:{title:'视频列表',icon:'from', hidden: true}
      },
      {
        path:'living_room/poster',
        name:'poster',
        component:_import('livingbroadcast/poster'),
        meta:{title:'海报设置',icon:'from',hidden:true}
      },
      {
        path:'living_room/danmuList',
        name:'danmuList',
        component:_import('livingbroadcast/danmuList'),
        meta:{title:"黑名单",icon:'form',hidden:true}
      },
    ]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

