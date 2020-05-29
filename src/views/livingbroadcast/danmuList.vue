<template>
  <div class="blackList">
    <transition name="el-zoom-in-top">
      <div class="filter-container transition-box" >
        <div class="filter-item">
          <div class="filter-label">直播房间号 </div>
          <el-input
            style="width: 180px;" size="small"
            v-model="roomInfo.live_room_id"
            :disabled="true"
          >
          </el-input>
        </div>
<!--        -->
        <div class="filter-item">
          <div class="filter-label"> 搜索弹幕</div>
          <el-input
            style="width: 180px;" size="small"
            v-model="roomInfo.search_content"
            >
          </el-input>
        </div>
        <el-button
          class="filter-item"
          type="primary" v-waves
          icon="el-icon-search"
          size="small"
          @click="searchDanmu"
        >搜索弹幕
        </el-button>
          <!-- <div class="filter-item">
            <div class="filter-label">搜索用户</div>
            <el-input
              style="width: 180px;" size="small"
              v-model="roomInfo.user_nickname"
              >
            </el-input>
          </div>
        <el-button
          class="filter-item"
          type="primary" v-waves
          icon="el-icon-search"
          size="small"
          @click="searchPeople"
        >搜索用户
        </el-button> -->
      </div>
    </transition>
    <template>
      <el-table
        :data="danmuList"
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="给我一点时间" stripe fit
        highlight-current-row border
        style="width: 100%">
       <el-table-column prop="ID" label="用户ID" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.customer_id}}</span>
            <!-- <span v-else-if="scope.row.customer_id !== null && scope.row.customer_id !== '' && scope.row.customer_id !== undefined && getInfo === 2">{{scope.row.customer_id}}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="user_nickname" label="用户昵称" min-width="60" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.customer_shop !== null && scope.row.customer_shop !== '' && scope.row.customer_shop !== undefined">{{scope.row.customer_shop.user_nickname}}</span>
            <!-- <span v-else-if="scope.row.customer_shop !== null && scope.row.customer_shop !== '' && scope.row.customer_shop !== undefined && getInfo === 2">{{scope.row.user_nickname}}</span> -->
            <span v-else>暂无信息</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="弹幕内容" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发言时间" min-width="60" align="center">
          <template slot-scope="scope">
            <span >{{scope.row.updated_at}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="do" label="操作" min-width="60" align="center">
          <template slot-scope="scope">
             <el-button
                type="danger"
                size="small"
                @click="addBlackList(scope.row)"
                :class="scope.row.cantsay ===true ? 'cantPlay' :''"
                >拉黑</el-button>
          </template>
        </el-table-column>
      </el-table>
       <div v-show ="!listLoading" class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="roomInfo.page"
                         :page-size="roomInfo.size"
                         :page-sizes="[10,15]"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
    </template>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {
        getRoomDanmuList,
        pullBlackList,
        getRoomCustomerDanmuList,
        getLiveBlackList,
    } from "@/api/liveBroadcast"
  export default {
    name:"danmuList",
    directives: {
      waves
    },
    data(){
      return{
        danmuList:[],
        listLoading:false,
        tableKey:0,
        total:0,
        getInfo:1,
        roomInfo:{
          live_room_id:null,
          page:1,
          size:10,
          search_content:'',
        },
        roomInfo1:{
          live_room_id:null,
          page:1,
          page_size:10,
          user_nickname:'',
        },
        roomBlackInfo:{
          live_room_id:null,
        },
        black_Query:{
          live_room_id:null,
          customer_id:null,
        },
        black_list:{
          live_room_id:null,
        },
        blackList:[],
      }
    },
    methods:{
      //重置搜索
      resetInfo(){
        this.roomInfo1.search_content = ''
        this.roomInfo.user_nickname = ''
      },
      //弹幕搜索
      searchDanmu(){
        this.roomInfo.user_nickname = ''
        this.getInfo = 1
        this.listLoading = true
        this.roomInfo.page = 1
        this.roomInfo1.page = 1
        getRoomDanmuList(this.roomInfo).then(response => {
          if(response.code === 200){
            this.danmuList = response.data.data
            this.total = response.data.total
            this.listLoading = false
             for(const v in this.danmuList){
              for(const i in this.blackList){
                if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                  this.$set(this.danmuList[v],"cantsay",true)
                }
              }
            }
          }
        }).catch(e => {
          this.listLoading = false

        })
      },
      //发言人搜索

      // searchPeople(){
      //   this.roomInfo.search_content = ''
      //   this.getInfo = 2
      //   this.listLoading = true
      //   this.roomInfo.page = 1
      //   getRoomCustomerDanmuList(this.roomInfo).then(response => {
      //     if(response.code === 200){
      //       let customer_shop = response.data
      //       console.log(response.data)
      //       this.danmuList = response.data.barrage_list.data
      //       this.total = response.data.barrage_list.total
      //       for(let i = 0; i < this.danmuList.length; i++){
      //         this.$set(this.danmuList[i],"customer_shop",customer_shop)
      //       }
      //       for(const v in this.danmuList){
      //         for(const i in this.blackList){
      //           if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
      //             this.$set(this.danmuList[v],"cantsay",true)
      //           }
      //         }
      //       }
      //       this.listLoading = false
      //     }
      //   }).catch(e => {
      //     this.listLoading = false
      //   })
      // },
      searchPeople(){
        this.total = 0
        this.roomInfo.search_content = ''
        this.getInfo = 2
        this.listLoading = true
        this.roomInfo.page = 1
        this.roomInfo1.page = 1
        getRoomCustomerDanmuList(this.roomInfo1).then(response => {
          if(response.code === 200){
            let alllist = response.data.data
            let barrage_list_people = []
            console.log(alllist)
            for(const k in alllist){
              let user_nickname = alllist[k].user_nickname
              let customer_id = alllist[k].customer_id
              let customer_shop = alllist[k]
              if(alllist[k].barrage_list.data.content !== "暂无弹幕数据"){
                for(let a = 0; a < alllist[k].barrage_list.data.length;a++){
                  this.$set(alllist[k].barrage_list.data[a],"user_nickname",user_nickname)
                  alllist[k].barrage_list.data[a].customer_shop = {}
                  alllist[k].barrage_list.data[a].customer_shop.user_nickname = user_nickname
                  alllist[k].barrage_list.data[a].customer_shop.customer_id = customer_id
                  barrage_list_people.push(alllist[k].barrage_list.data[a])
                }
              }else{
                this.$set(alllist[k].barrage_list.data,"live_room_id",this.roomInfo.live_room_id)
                this.$set(alllist[k].barrage_list.data,"user_nickname",user_nickname)
                this.$set(alllist[k].barrage_list.data,"customer_id",customer_id)
                alllist[k].barrage_list.data.customer_shop = {}
                alllist[k].barrage_list.data.customer_shop.user_nickname = user_nickname
                alllist[k].barrage_list.data.customer_shop.customer_id = customer_id
                barrage_list_people.push(alllist[k].barrage_list.data)
              }
              this.total += alllist[k].barrage_list.total
            }
            console.log(barrage_list_people)
            this.danmuList = barrage_list_people
            for(const v in this.danmuList){
              for(const i in this.blackList){
                if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                  this.$set(this.danmuList[v],"cantsay",true)
                }
              }
            }
            this.listLoading = false
          }
        }).catch(e => {
          this.listLoading = false
        })
      },
      //添加黑名单
      addBlackList(row){
        this.listLoading = true
        if(this.getInfo === 1){
          this.black_Query.live_room_id = row.live_room_id
          this.black_Query.customer_id = row.customer_shop.customer_id
          pullBlackList(this.black_Query).then(response =>{
            if(response.code === 200){
                this.$notify({
                title: '拉黑成功',
                message: response.data,
                type: 'success',
                duration: 1000
              })
            }
            getLiveBlackList(this.black_list).then(response => {
              if(response.code === 200){
                this.blackList = response.data.data
              }
              getRoomDanmuList(this.roomInfo).then(response => {
                if(response.code === 200){
                  this.danmuList = response.data.data
                  for(const v in this.danmuList){
                    for(const i in this.blackList){
                      if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                        this.$set(this.danmuList[v],"cantsay",true)
                      }
                    }
                  }
                }
              })
            })
          })
        }
        if(this.getInfo === 2){
          console.log(row)
          this.black_Query.live_room_id = row.live_room_id
          this.black_Query.customer_id = row.customer_shop.customer_id
          pullBlackList(this.black_Query).then(response =>{
            if(response.code === 200){
                this.$notify({
                title: '拉黑成功',
                message: response.data,
                type: 'success',
                duration: 1000
              })
            }
            getLiveBlackList(this.black_list).then(response => {
              if(response.code === 200){
                this.blackList = response.data.data
                getRoomCustomerDanmuList(this.roomInfo).then(response => {
                  if(response.code === 200){
                    let alllist = response.data
                    let barrage_list_people = []
                    for(const k in alllist){
                      let user_nickname = alllist[k].user_nickname
                      let customer_id = alllist[k].customer_id
                      let customer_shop = alllist[k]
                      if(alllist[k].barrage_list.data.content !== "暂无弹幕数据"){
                        for(let a = 0; a < alllist[k].barrage_list.data.length;a++){
                          this.$set(alllist[k].barrage_list.data[a],"user_nickname",user_nickname)
                          alllist[k].barrage_list.data[a].customer_shop = {}
                          alllist[k].barrage_list.data[a].customer_shop.user_nickname = user_nickname
                          alllist[k].barrage_list.data[a].customer_shop.customer_id = customer_id
                          barrage_list_people.push(alllist[k].barrage_list.data[a])
                        }
                      }else{
                        this.$set(alllist[k].barrage_list.data,"live_room_id",this.roomInfo.live_room_id)
                        this.$set(alllist[k].barrage_list.data,"user_nickname",user_nickname)
                        this.$set(alllist[k].barrage_list.data,"customer_id",customer_id)
                        alllist[k].barrage_list.data.customer_shop = {}
                        alllist[k].barrage_list.data.customer_shop.user_nickname = user_nickname
                        alllist[k].barrage_list.data.customer_shop.customer_id = customer_id
                        barrage_list_people.push(alllist[k].barrage_list.data)
                      }
                    }
                    this.danmuList = barrage_list_people
                    for(const v in this.danmuList){
                      for(const i in this.blackList){
                        if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                          this.$set(this.danmuList[v],"cantsay",true)
                        }
                      }
                    }
                    this.listLoading = false
                  }
                }).catch(e => {
                  this.listLoading = false
                })
              }
            })
          })
        }
        this.listLoading = false
      },
      //分页管理
      handleSizeChange(val){
        if(this.getInfo === 1){
          this.listLoading = true
          this.roomInfo.size = val
          getRoomCustomerDanmuList(this.roomInfo).then(response => {
            if(response.code === 200){
              this.danmuList = response.data.data
              this.total = response.data.total
              this.listLoading = false
              for(const v in this.danmuList){
                for(const i in this.blackList){
                  if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                    this.$set(this.danmuList[v],"cantsay",true)
                  }
                }
              }
            }
          }).catch(e => {
            this.listLoading = false
          })
        }
        if(this.getInfo === 2){
          this.listLoading = true
          this.roomInfo.size = val
          getRoomCustomerDanmuList(this.roomInfo).then(response => {
            if(response.code === 200){
              let alllist = response.data
              let barrage_list_people = []
              for(const k in alllist){
                let user_nickname = alllist[k].user_nickname
                let customer_id = alllist[k].customer_id
                let customer_shop = alllist[k]
                if(alllist[k].barrage_list.data.content !== "暂无弹幕数据"){
                  for(let a = 0; a < alllist[k].barrage_list.data.length;a++){
                    this.$set(alllist[k].barrage_list.data[a],"user_nickname",user_nickname)
                    alllist[k].barrage_list.data[a].customer_shop = {}
                    alllist[k].barrage_list.data[a].customer_shop.user_nickname = user_nickname
                    alllist[k].barrage_list.data[a].customer_shop.customer_id = customer_id
                    barrage_list_people.push(alllist[k].barrage_list.data[a])
                  }
                }else{
                  this.$set(alllist[k].barrage_list.data,"live_room_id",this.roomInfo.live_room_id)
                  this.$set(alllist[k].barrage_list.data,"user_nickname",user_nickname)
                  this.$set(alllist[k].barrage_list.data,"customer_id",customer_id)
                  alllist[k].barrage_list.data.customer_shop = {}
                  alllist[k].barrage_list.data.customer_shop.user_nickname = user_nickname
                  alllist[k].barrage_list.data.customer_shop.customer_id = customer_id
                  barrage_list_people.push(alllist[k].barrage_list.data)
                }
              }
              this.danmuList = barrage_list_people
              for(const v in this.danmuList){
                for(const i in this.blackList){
                  if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                    this.$set(this.danmuList[v],"cantsay",true)
                  }
                }
              }
              this.listLoading = false
            }
          }).catch(e => {
            this.listLoading = false
          })
        }
      },
      handleCurrentChange(val){
        if(this.getInfo === 1){
          this.listLoading = true
          this.roomInfo.page = val
          getRoomDanmuList(this.roomInfo).then(response => {
            if(response.code === 200){
              this.danmuList = response.data.data
              this.total = response.data.total
              this.listLoading = false
              for(const v in this.danmuList){
                for(const i in this.blackList){
                  if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                    this.$set(this.danmuList[v],"cantsay",true)
                  }
                }
              }
            }
          }).catch(e => {
            this.listLoading = false
          })
        }
        if(this.getInfo === 2){
          this.listLoading = true
          this.roomInfo.page = val
          getRoomCustomerDanmuList(this.roomInfo).then(response => {
            if(response.code === 200){
              let alllist = response.data
              let barrage_list_people = []
              for(const k in alllist){
                let user_nickname = alllist[k].user_nickname
                let customer_id = alllist[k].customer_id
                let customer_shop = alllist[k]
                if(alllist[k].barrage_list.data.content !== "暂无弹幕数据"){
                  for(let a = 0; a < alllist[k].barrage_list.data.length;a++){
                    this.$set(alllist[k].barrage_list.data[a],"user_nickname",user_nickname)
                    alllist[k].barrage_list.data[a].customer_shop = {}
                    alllist[k].barrage_list.data[a].customer_shop.user_nickname = user_nickname
                    alllist[k].barrage_list.data[a].customer_shop.customer_id = customer_id
                    barrage_list_people.push(alllist[k].barrage_list.data[a])
                  }
                }else{
                  this.$set(alllist[k].barrage_list.data,"live_room_id",this.roomInfo.live_room_id)
                  this.$set(alllist[k].barrage_list.data,"user_nickname",user_nickname)
                  this.$set(alllist[k].barrage_list.data,"customer_id",customer_id)
                  alllist[k].barrage_list.data.customer_shop = {}
                  alllist[k].barrage_list.data.customer_shop.user_nickname = user_nickname
                  alllist[k].barrage_list.data.customer_shop.customer_id = customer_id
                  barrage_list_people.push(alllist[k].barrage_list.data)
                }
              }
              this.danmuList = barrage_list_people
              for(const v in this.danmuList){
                for(const i in this.blackList){
                  if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                    this.$set(this.danmuList[v],"cantsay",true)
                  }
                }
              }
              this.listLoading = false
            }
          }).catch(e => {
            this.listLoading = false
          })
        }
      }
    },
    created(){
      this.roomInfo.live_room_id = localStorage.room_id / 1
      this.roomInfo1.live_room_id = localStorage.room_id / 1
      this.roomBlackInfo.live_room_id = this.roomInfo.live_room_id
      this.black_list.live_room_id = this.roomInfo.live_room_id
    },
    mounted(){
      this.listLoading = true
      getLiveBlackList(this.black_list).then(response => {
        this.blackList = response.data.data
      })
      getRoomDanmuList(this.roomInfo).then(response => {
        if(response.code === 200){
          this.danmuList = response.data.data
          this.total = response.data.total
          this.listLoading = false
          for(const v in this.danmuList){
            for(const i in this.blackList){
              if(this.danmuList[v].customer_id === this.blackList[i].customer_id){
                this.$set(this.danmuList[v],"cantsay",true)
              }
            }
          }
        }
      }).catch(e => {
        this.listLoading = false
      })
    },
  }
</script>

<style scoped>
  .cantPlay{
    	background-color: #c1c1c1;
      border-color: #c1c1c1;
      color:#000000;
      font-weight:600;
      pointer-events: none;
      user-select:none;
  }
  .el-form--inline .el-form-item__content {
    width: 85%;
    padding: 5px 15% 0px 0px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 15%;
    color: #5e81bf;
    font-size: 16px;
  }

  .my-edit-type, .my-edit-type:focus {
    color: #288ccb;
    cursor: pointer;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 15px;
    width: 49%;
    margin-left: 1%;
  }

  .my-form-p {
    margin: 0;
    padding: 0;
    line-height: 20px;
    color: #333;
  }

  .label-span {
    font-weight: bold;
    color: #5e81bf;
  }

  .deleted-p {
    text-decoration: crimson underline overline line-through;
    text-decoration: underline overline line-through;
  }

  .grid-content {
    text-align: left;
    background-color: #edf2f9;
    color: #323233;
    padding: 15px 25px;
  }

  .filtered {
    -webkit-filter: url(#f1);
    filter: url(#f1);
  }

  .data-items {
    padding-left: 50px;
  }
</style>
