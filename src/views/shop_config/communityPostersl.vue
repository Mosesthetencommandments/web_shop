<template>
  <div class="communityPoster" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit>
    <el-container>
      <!-- 大图 -->
      <el-aside width="50%">
        <div class="leftImg">
          <img :src="left_img" alt class="posterImg" />
          <img src="../../assets/ercode.jpg" alt class="ercodeImg" :style="codeText" />
        </div>
      </el-aside>
      <!-- 右边部分 -->
      <el-main>
        <el-form label-position="left" label-width="20%" style="width: 80%; margin-left:10%;">
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
              :limit="1"
              multiple
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过2M</span>
          </el-form-item>
          <el-form-item label label-width="20%">
            <el-button type="primary" @click="consentImg">确 定</el-button>
          </el-form-item>
          <el-form-item label="类型选择">
            <el-select
              class="filter-item"
              style="width: 203px"
              v-model="qr_code.type"
              filterable
              clearable
              placeholder="选择类型"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二维码大小" label-width="20%">
            <span style="margin-right:8px">宽</span>
            <el-input-number
              style="width:200px"
              placeholder="请输入大小"
              v-model="qr_code.width"
              controls-position="right"
              @change="changeInfo()"
              :min="0"
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
                @change="changeInfo()"
                :min="0"
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
          <el-form-item label label-width="20%">
            <el-button type="primary" @click="getCss">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import waves from "@/directive/waves";
import { getActivePosterList, changeActivePoster } from "@/api/community";
import {
  createShopPosterTemplate,
  getShopPosterTemplateInfo,
  updateShopPosterTemplate
} from "@/api/setting";
export default {
  name: "communityPostersl",
  directives: {
    waves
  },
  data() {
    return {
      options: [
        {
          value: 3,
          label: "分享海报"
        },
        {
          value: 6,
          label: "VIP"
        },
        {
          value: 7,
          label: "授权书"
        }
      ],
      baseUrl: process.env.BASE_API + "/api/document/uploadImage",
      listLoading: false,
      posterID: {
        id: null
      },
      timer: null,
      communityPoster: [],
      oldPoster: {},
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: undefined,
      imgbox: {
        img_url: undefined,
        link: undefined,
        remark: undefined,
        sort: undefined
      },
      qr_code: {
        width: 100 + "px",
        top: 100 + "px",
        right: 100 + "px",
        bottom: 100 + "px",
        left: 100 + "px",
        type: null
      },
      left_img: "",
      codeText: {
        width: 100 + "px",
        top: 100 + "px",
        right: 100 + "px",
        bottom: 100 + "px",
        left: 100 + "px",
        lr_id: 100 + "px"
      },
      ercodePosition: {
        template_width: null,
        template_height: null,
        qr_code_size: null,
        top_margin: null,
        left_margin: null,
        template_img: null,
        type: null
      },
      PIC: null,
      judjeImg: null,
      number: null
    };
  },
  methods: {
    //大小更改
    changeInfo() {
      this.codeText.width = this.qr_code.width + "px";
      this.codeText.top = this.qr_code.top + "px";
      this.codeText.right = this.qr_code.right + "px";
      this.codeText.bottom = this.qr_code.bottom + "px";
      this.codeText.left = this.qr_code.left + "px";
    },
    //图片上传
    handlePictureCardPreviews(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePicture(img_url) {
      this.dialogImageUrl = img_url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.imgbox.img_url = "";
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleUp(response, file, fileList) {
      this.imgbox.img_url = response.data.url;
    },
    //确定图片
    consentImg() {
      this.left_img = this.imgbox.img_url;
      this.$nextTick(() => {
        this.PIC = document.getElementsByClassName("posterImg");
      });
    },
    //创建确定样式
    getCss() {
      this.ercodePosition.qr_code_size = Math.round(this.qr_code.width);
      this.ercodePosition.top_margin = Math.round(this.qr_code.top);
      this.ercodePosition.template_width = this.PIC[0].clientWidth;
      this.ercodePosition.template_height = this.PIC[0].clientHeight;
      this.ercodePosition.left_margin = Math.round(this.qr_code.left);
      this.ercodePosition.template_img = this.imgbox.img_url;
      this.ercodePosition.type = this.qr_code.type;
      createShopPosterTemplate(this.ercodePosition).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: "设置成功",
            message: "成功",
            type: "success",
            duration: 1000
          });
          this.$router.push({
            name: "manage"
          });
        } else {
          this.$notify({
            title: "设置失败",
            message: "失败",
            type: "error",
            duration: 1000
          });
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.PIC = document.getElementsByClassName("posterImg");
    });
  }
};
</script>

<style scoped>
.leftImg {
  text-align: left;
  position: relative;
  margin-left: 50px;
  margin-top: 30px;
}
.posterImg {
  width: 375px;
}
.ercodeImg {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
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
