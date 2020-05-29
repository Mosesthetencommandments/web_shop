<template>
  <div class="videoList">
    <template>
      <el-table
        :key="tableKey"
        v-loading="listLoading" element-loading-text="给我一点时间"
        stripe fit
        highlight-current-row border
        :data="videoList"
        style="width: 100%">
        <el-table-column
          align="center"
          label="主播图片"
          style="width: 30%">
          <template slot-scope="scope">
            <img :src="scope.row.coverURL" alt="" width="150" height="150">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="大小(KB)"
          style="width: 20%">
          <template slot-scope="scope">
            <p>{{ scope.row.size }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          style="width: 20%">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          style="width: 20%"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-share"
              @click="chooseVideo(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div  class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[4,6]" :page-size="listQuery.size"
                       :disabled="false"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {
    getVideoList,
    getVideoInfo,
    addVideoInfo,
  } from "@/api/liveBroadcast"
    export default {
      name: "videoList",
      directives: {
        waves
      },
      data(){
        return{
          tableKey:0,
          videoId:null,
          videoList:[],
          videoInfo:{
            lr_id:null,
            coverURL:null,
            playURL:null,
            video_id:null,
          },
          total:null,
          listQuery: {
            page: 1,
            size: 4,
          },
          listLoading:true
        }
      },
      methods:{
        getVideoList(){
          getVideoList(this.listQuery).then(response => {
            // console.log(response)

            this.videoList = response.data.LiveRecordVideoList
            this.total = response.data.Total
            this.listLoading = false
            // console.log(this.total)
            if(!response){
              this.$notify({
                title: '已无更多视频',
                message: '请返回上一页',
                type: 'error',
                duration: 1000
              })
            }
          })
        },
        chooseVideo(row){
          // console.log(row)
          this.videoId = row.videoId
          this.videoInfo.video_id = row.videoId
          this.videoInfo.lr_id = localStorage.lr_id / 1
          getVideoInfo({video_id:this.videoId}).then(response => {
            this.videoInfo.coverURL = response.data.coverURL
            this.videoInfo.playURL = response.data.playURL
            addVideoInfo(this.videoInfo).then(response => {
              if(response.code === 200){
                this.$notify({
                  title: '添加成功',
                  message: response.data,
                  type: 'success',
                  duration: 1000
                })
              }else{
                this.$notify({
                  title: '添加失败',
                  message: '失败',
                  type: 'error',
                  duration: 1000
                })
              }
            })
          })
        },
        handleSizeChange(val){
          this.listLoading = true
          this.listQuery.size = val
          this.getVideoList()
        },
        handleCurrentChange(val){
          this.listLoading = true
          this.listQuery.page = val
          this.getVideoList()
        },
      },
      created() {
        this.getVideoList()
      },
    }

</script>

<style scoped>

</style>
