<template>
    <div>
        <el-table
            :data="activePosterList"
            v-loading="listLoading"
            element-loading-text="给我一点时间" stripe fit
            highlight-current-row border
            align="center"
            style="width: 100%">
        <el-table-column
            label="序号"
            min-width="180"
            align="center"
        >
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="类型"
            min-width="180"
            align="center"
        >
            <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column
            min-width="180"
            label="操作"
            align="center"
        >
        <template slot-scope="scope">
            <el-button type="primary" size="small" @click="gotoPoster(scope.row)">海报管理</el-button>
        </template>
        </el-table-column>
        </el-table> 
    </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {
      getActivePosterList,
      getActivePosterInfo,
      changeActivePoster,
    }from '@/api/community'
  export default {
    name:"blackList",
    directives: {
      waves
    },
    data(){
      return{
        listLoading:false,
        activePosterList:[],
      }
    },
    methods:{
      getActivePosterList(){
        getActivePosterList().then(response =>{
          if(response.code === 200){
            this.activePosterList = response.data
          }
        })
      },
      gotoPoster(row){
        let add = JSON.parse(localStorage.getItem('activeType'))
        if(add === null || add.length === 0){
          localStorage.setItem('activeType',JSON.stringify(row.id))
        }else{
          localStorage.activeType = row.id
        }
        this.$router.push({
            name:"communityPoster"
        })
      }
    },
    created(){
      this.getActivePosterList()
    },
}
</script>

<style scoped>

</style>