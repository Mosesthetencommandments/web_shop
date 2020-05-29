<template>
  <div class="poster"
    v-loading="listLoading" 
    element-loading-text="给我一点时间" 
    stripe fit
  >
    <el-container>
      <el-aside 
        width="40%">
        <div class="leftImg"
         
        >
          <img :src="left_img" alt="" class="posterImg">
          <img src="../../assets/ercode.jpg" alt="" class="ercodeImg"
              :style="codeText"
               v-if="qr_code.width !==''&& qr_code.width !== null"
          >
        </div>
      </el-aside>
      <el-main>
        <el-form
          label-position="left" label-width="20%"
          style='width: 80%; margin-left:10%;'
        >
          <el-form-item label="上传海报" label-width="20%" prop="img_url">
            <el-upload
              :action="baseUrl"
              name="image"
              :file-list="fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreviews"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handleUp"
              :limit = 1
              multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过2M</span>
          </el-form-item>
          <el-form-item label="" label-width="20%" >
            <el-button  type="primary" @click="consentImg">确 定</el-button>
          </el-form-item>
          <el-form-item label="二维码大小" label-width="20%">
            <span style="margin-right:8px">宽</span>
            <el-input-number 
            style="width:200px"
            placeholder="请输入大小"
            v-model="qr_code.width" 
            controls-position="right" 
            @input="changeInfo()" :min="0" 
            ></el-input-number>
            <span style="margin-left:8px">px</span>
          </el-form-item>
          <el-form-item label="距离设置(px)" label-width="20%">
            <div>
              <span style="margin-right:8px">上</span>
              <el-input-number
                v-model="qr_code.top"
                placeholder="请输入大小"
                style="width:200px"
                controls-position="right" 
                @change="changeInfo()" :min="0" 
              ></el-input-number>
              <span style="margin-left:8px">px</span>
            </div>
            <div style="margin-top:20px">
              <span style="margin-right:8px">左</span>
              <el-input-number
                v-model="qr_code.left"
                placeholder="请输入大小"
                style="width:200px"
                controls-position="right" 
                @change="changeInfo()"
              ></el-input-number>
              <span style="margin-left:8px">px</span>
            </div>
          </el-form-item>
          <el-form-item label="" label-width="20%" >
            <el-button  type="primary" @click="getCss">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
    import waves from '@/directive/waves'
    import {
      ercodePosition,
      getPoster,
    } from "@/api/liveBroadcast"
    export default {
      name: "poster",
      directives: {
        waves
      },
      data() {
        return {
          baseUrl: process.env.BASE_API + '/api/document/uploadImage',
          listLoading:false,
          getInfo:{
            live_room_id:null,
            poster_type:'',
            video_id:null
          },
          video_id:null,
          timer:null,
          oldPoster:{},
          fileList:[],
          dialogImageUrl: '',
          dialogVisible: undefined,
          imgbox:{
            img_url:undefined,
            link: undefined,
            remark: undefined,
            sort: undefined
          },
          qr_code: {
            width:null,
            top: null,
            right: null,
            bottom: null,
            left: null,
          },
          left_img:'',
          codeText:{
            width:null,
            top:null,
            right: null,
            bottom: null,
            left: null,
            lr_id: null,
          },
          ercodePosition:{
            poster_type:'',
            live_room_id:null,
            video_id:'',
            qr_code_size:null,
            top_margin:null,
            left_margin:null,
            template_img:null,
            template_width:0,
            template_height:0,
            type:null
          },
          PIC:null,
          judjeImg:null,
        }
      },
      methods:{
        //大小更改
        changeInfo(){
          this.codeText.width = this.qr_code.width + "px"
          this.codeText.top = this.qr_code.top + "px"
          this.codeText.right = this.qr_code.right + "px"
          this.codeText.bottom = this.qr_code.bottom + "px"
          this.codeText.left = this.qr_code.left + "px"
          console.log(1)
        },
        //图片上传
        handlePictureCardPreviews(file) {
          this.dialogImageUrl = file.url
          this.dialogVisible = true
        },
        handlePicture(img_url) {
          this.dialogImageUrl = img_url
          this.dialogVisible = true
        },
        handleRemove() {
          this.imgbox.img_url = ''
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg' || 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        },
        handleUp(response, file, fileList) {
          // console.log(file)
          this.imgbox.img_url = response.data.url
          // this.temp.img_url = file.url
          // console.log(this.temp)
        },
        //确定图片
        consentImg(){
          this.left_img = this.imgbox.img_url
          this.$nextTick(() => {
            this.PIC = document.getElementsByClassName("posterImg")
          })
        },
        //确定css
        getCss(){
          // console.log(this.PIC[0].naturalHeight)
          // console.log(this.PIC[0].naturalWidth)
          if(localStorage.video === "null"){
            if(this.imgbox.img_url == this.judjeImg){
              this.ercodePosition.type = "update"
            }else{
              this.ercodePosition.type = "create"
            }
            delete this.ercodePosition.video_id
            this.ercodePosition.live_room_id = localStorage.lr_id / 1
            this.ercodePosition.poster_type = localStorage.poster
            this.ercodePosition.qr_code_size = Math.round(this.qr_code.width * this.PIC[0].naturalWidth / 360)
            this.ercodePosition.top_margin = Math.round(this.qr_code.top * this.PIC[0].naturalHeight / 640)
            this.ercodePosition.left_margin = Math.round(this.qr_code.left * this.PIC[0].naturalWidth / 360)
            this.ercodePosition.template_img  = this.imgbox.img_url
            // console.log(this.ercodePosition)
            ercodePosition(this.ercodePosition).then(response => {
              if(response.code === 200){
                this.$notify({
                  title: '设置成功',
                  message: '成功',
                  type: 'success',
                  duration: 1000
                })
                // this.qr_code.width = null
                // this.qr_code.size = null
                // this.qr_code.top = null
                // this.qr_code.left = null
                // this.imgbox.img_url = ''
                // this.left_img = ''
                // this.judjeImg = null
                // this.fileList = []
              }else{
                this.$notify({
                  title: '设置失败',
                  message: '失败',
                  type: 'error',
                  duration: 1000
                })
              }
            }).catch(e => {
              console.log(e)
            })
          }else{
            if(this.imgbox.img_url == this.judjeImg){
              this.ercodePosition.type = "update"
            }else{
              this.ercodePosition.type = "create"
            }
            delete this.ercodePosition.live_room_id
            this.ercodePosition.video_id = localStorage.video
            this.ercodePosition.poster_type = localStorage.poster
            this.ercodePosition.qr_code_size = Math.round(this.qr_code.width * this.PIC[0].naturalWidth / 360)
            this.ercodePosition.top_margin = Math.round(this.qr_code.top * this.PIC[0].naturalHeight / 640)
            this.ercodePosition.left_margin = Math.round(this.qr_code.left * this.PIC[0].naturalWidth / 360)
            this.ercodePosition.template_img  = this.imgbox.img_url
            // console.log(this.ercodePosition)
            ercodePosition(this.ercodePosition).then(response => {
              if(response.code === 200){
                this.$notify({
                  title: '设置成功',
                  message: '成功',
                  type: 'success',
                  duration: 1000
                })
                // this.qr_code.width = null
                // this.qr_code.size = null
                // this.qr_code.top = null
                // this.qr_code.left = null
                // this.imgbox.img_url = ''
                // this.left_img = ''
                // this.judjeImg = null
                // this.fileList = []
              }else{
                this.$notify({
                  title: '设置失败',
                  message: '失败',
                  type: 'error',
                  duration: 1000
                })
              }
            }).catch(e => {
              console.log(e)
            })
          }
        },
      },
      mounted(){
        this.$nextTick(() => {
          this.PIC = document.getElementsByClassName("posterImg")
        })
        if(localStorage.video === 'null'){
          this.listLoading = true
          this.getInfo.live_room_id = localStorage.lr_id / 1
          this.getInfo.poster_type = localStorage.poster
          delete this.getInfo.video_id
          getPoster(this.getInfo).then(response => {
            if(response.code === 200){
              this.timer = setTimeout(()=>{
                this.oldPoster = response.data
                this.listLoading = false
                this.left_img = this.oldPoster.template_img 
                this.qr_code.width = Math.round(this.oldPoster.qr_code_size * 360 / this.PIC[0].naturalWidth)
                this.qr_code.top = Math.round(this.oldPoster.top_margin * 640 / this.PIC[0].naturalHeight)
                this.qr_code.left = Math.round(this.oldPoster.left_margin * 360 / this.PIC[0].naturalWidth)
                this.changeInfo()
              },500)
              this.oldPoster = response.data
              this.left_img = this.oldPoster.template_img 
              if(this.left_img === "" || this.left_img === null || this.left_img === undefined){
                return
              }
              this.judjeImg = this.oldPoster.template_img 
              this.imgbox.img_url = this.oldPoster.template_img 
              this.codeText.width = this.oldPoster.qr_code_size
              this.codeText.top = this.oldPoster.top_margin
              this.codeText.left =this.oldPoster.left_margin
            }
          }).catch(e =>{
            this.listLoading = false
          })
        }else{
          this.listLoading = true
          this.getInfo.poster_type = localStorage.poster
          this.getInfo.video_id = localStorage.video
          delete this.getInfo.live_room_id
          getPoster(this.getInfo).then(response => {
            if(response.code === 200){
              this.timer = setTimeout(()=>{
                this.oldPoster = response.data
                this.listLoading = false
                this.left_img = this.oldPoster.template_img 
                this.qr_code.width = Math.round(this.oldPoster.qr_code_size * 360 / this.PIC[0].naturalWidth)
                this.qr_code.top = Math.round(this.oldPoster.top_margin * 640 / this.PIC[0].naturalHeight)
                this.qr_code.left = Math.round(this.oldPoster.left_margin * 360 / this.PIC[0].naturalWidth)
                this.changeInfo()
              },500)
              this.oldPoster = response.data
              this.left_img = this.oldPoster.template_img 
              if(this.left_img === "" || this.left_img === null || this.left_img === undefined){
                return
              }
              this.judjeImg = this.oldPoster.template_img 
              this.imgbox.img_url = this.oldPoster.template_img 
              this.codeText.width = this.oldPoster.qr_code_size
              this.codeText.top = this.oldPoster.top_margin
              this.codeText.left = this.oldPoster.left_margin
            }
          }).catch(e => {
            this.listLoading = false
          })
        }
      },
      beforeDestroy(){
        this.qr_code.width = null
        this.qr_code.size = null
        this.qr_code.top = null
        this.qr_code.left = null
        this.imgbox.img_url = ''
        this.left_img = ''
        this.getInfo.live_room_id = null
        this.getInfo.poster_type = ""
        clearTimeout(this.timer)
      }
    }
</script>

<style scoped>
  .leftImg{
    text-align:left;
    position: relative;
    margin-left:50px;
    margin-top:30px;
  }
  .posterImg{
    width:360px;
    height:640px;
  }
  .ercodeImg{
    position: absolute;
    z-index:5;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
