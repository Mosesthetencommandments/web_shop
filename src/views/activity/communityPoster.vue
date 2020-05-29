<template>
  <div 
    class="communityPoster"
    v-loading="listLoading" 
    element-loading-text="给我一点时间" 
    stripe fit
  >
    <el-container>
      <el-aside 
        width="50%">
        <div class="leftImg"

        >
          <img :src="left_img" alt="" class="posterImg">
          <img src="../../assets/ercode.jpg" alt="" class="ercodeImg"
              :style="codeText"
               v-if="qr_code.width !== '' && qr_code.width !== null && qr_code.width !== 0"
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
            @change="changeInfo()" :min="0" 
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
                @input="changeInfo()"
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
    import{
      getActivePosterList,
      getActivePosterInfo,
      changeActivePoster,
    }from '@/api/community'
    export default {
      name:"communityPoster",
      directives: {
        waves
      },
      data(){
        return{
          baseUrl: process.env.BASE_API + '/api/document/uploadImage',
          listLoading:false,
          posterID:{
            id:null,
          },
          timer:null,
          communityPoster:[],
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
            id:null,
            qr_code_size:null,
            top_margin:null,
            left_margin:null,
            template_img:null,
          },
          PIC:null,
          judjeImg:null,
          number:null,
        }
      },
      methods:{
        //获得海报详情
        getActivePosterInfo(){
          this.posterID.id = localStorage.activeType
          this.listLoading = true
          getActivePosterInfo(this.posterID).then(response => {
            if(response.code === 200){
               this.communityPoster = response.data
               if(this.communityPoster.template_img === null || this.communityPoster.template_img === undefined || this.communityPoster.communityPoster === ''){
                   this.listLoading = false
                  return 
               }else{
                this.timer = setTimeout(()=>{
                    this.communityPoster = response.data
                    this.listLoading = false
                    this.left_img = this.communityPoster.template_img 
                    this.number = this.PIC[0].naturalWidth / 375
                    //原来的
                    this.qr_code.width = Math.round(this.communityPoster.qr_code_size * 375 / this.PIC[0].naturalWidth)
                    this.qr_code.top = Math.round(this.communityPoster.top_margin *  this.PIC[0].clientHeight / this.PIC[0].naturalHeight)
                    this.qr_code.left = Math.round(this.communityPoster.left_margin * 375 / this.PIC[0].naturalWidth)                                                                                                                                                                                                          
                    //更改后
                    // this.qr_code.width = Math.round(this.communityPoster.qr_code_size * this.number)
                    // this.qr_code.top = Math.round(this.communityPoster.top_margin * this.number)
                    // this.qr_code.left = Math.round(this.communityPoster.left_margin * this.number)
                    this.changeInfo()
                },500)
                  this.left_img = this.communityPoster.template_img
                  this.imgbox.img_url = this.communityPoster.template_img
                  this.codeText.width = this.communityPoster.qr_code_size
                  this.codeText.top = this.communityPoster.top_margin
                  this.codeText.left =this.communityPoster.left_margin
               }
            }
          })
        },
        //大小更改
        changeInfo(){
          this.codeText.width = this.qr_code.width + "px"
          this.codeText.top = this.qr_code.top + "px"
          this.codeText.right = this.qr_code.right + "px"
          this.codeText.bottom = this.qr_code.bottom + "px"
          this.codeText.left = this.qr_code.left + "px"
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
            console.log(this.PIC)
          })
        },
        //确定样式
        getCss(){
          this.ercodePosition.id = localStorage.activeType
          this.number = this.PIC[0].naturalWidth / 375
          this.ercodePosition.qr_code_size = Math.round(this.qr_code.width * this.PIC[0].naturalWidth / 375)
          this.ercodePosition.top_margin =  Math.round(this.qr_code.top * this.PIC[0].naturalHeight / this.PIC[0].clientHeight)
          this.ercodePosition.left_margin = Math.round(this.qr_code.left * this.PIC[0].naturalWidth / 375)
          // this.ercodePosition.qr_code_size = Math.round(this.qr_code.width * this.number)
          // this.ercodePosition.top_margin =  Math.round(this.qr_code.top * this.number)
          // this.ercodePosition.left_margin = Math.round(this.qr_code.left * this.number)
          this.ercodePosition.template_img  = this.imgbox.img_url
          console.log(this.ercodePosition)
          changeActivePoster(this.ercodePosition).then(response => {
              console.log(response)
            if(response.code === 200){
               this.$notify({
                  title: '设置成功',
                  message: '成功',
                  type: 'success',
                  duration: 1000
                })  
            }else{
                this.$notify({
                    title: '设置失败',
                    message: '失败',
                    type: 'error',
                    duration: 1000
                })  
            }
          })
        },
      },
      mounted(){
         this.$nextTick(() => {
          this.PIC = document.getElementsByClassName("posterImg")
        })
        this.getActivePosterInfo()
      },
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
    width:375px;
    
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