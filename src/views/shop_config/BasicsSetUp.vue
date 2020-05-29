<template>
  <div class="app-container">
      <el-form label-position="left" label-width="20%" style="margin:10px;">
        <el-form-item :label="item.shop_config_remarks"
                      label-width="18%"
                      v-for="(item, index) in sortOptions">
          <el-input v-if="item.type_name == 'input'" v-model="item.shop_config_value" :key="item.key" :value="item.key" style="width: 80%;"></el-input>
          <el-switch v-if="item.type_name == 'switch'"
            v-model="item.shop_config_value"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwitch(item)">
          </el-switch>
          <el-select v-if = "item.type_name == 'select'"
                     v-model="item.shop_config_value"
                     filterable
                     remote
                     :remote-method="handletypeList"
                     :loading="typeLoading"
                     placeholder="请选择默认仓库"
                     class="filter-item"
                     @change="handleDefaultWarehouse(item)">
            <el-option
              v-for="item in fullOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!--图片上传预览-->
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div v-if="item.type_name == 'upload'">
            <el-upload
              :action="baseUrl"
              name="image"
              :file-list="item.fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="(res, file, filelist) => {return handleUp(res, file, filelist, index)}">
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>只能上传jpg/png文件,图片大小不能超过１M</span>
          </div>
          <el-button v-if="item.type_name !== 'switch' && item.type_name !== 'select'" type="primary" style="margin-left: 10px;" @click="handleUpdate(item)">确认修改</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import { getShopSystemConfigList, updateShopSystemConfig } from '@/api/setting'
  import { getWarehouseList } from '@/api/setting'
  export default {
    name: 'BasicsSetUp',
    data() {
      return {
        sortOptions: [],
        baseUrl: process.env.BASE_API + '/api/document/uploadImage',
        dialogImageUrl: '',
        dialogVisible: undefined,
        typeLoading: false,
        fullOptions: []
      }
    },
    created() {
      this.getList()
      this.handletypeList()
    },
    methods: {
      getList() {
        getShopSystemConfigList().then(response => {
          this.sortOptions = response.data
          this.sortOptions.forEach((value, index, arr)=> {
            if (value.type_name == 'upload') {
              this.sortOptions[index].fileList = [
                {
                  url: value.shop_config_value
                }
              ]
            }
            if (value.type_name == 'select') {
              value.shop_config_value= parseInt(value.shop_config_value)
            }
          })
          console.log(this.sortOptions)
        })
      },
      handleDefaultWarehouse(item) {
        const tempData = Object.assign({})
        tempData.config_id = item.id
        tempData.config_value = item.shop_config_value
        tempData.shop_config_name = item.shop_config_name
        updateShopSystemConfig(tempData).then(response => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleSwitch(item) {
        const tempData = Object.assign({})
        tempData.config_id = item.id
        tempData.config_value = item.shop_config_value
        tempData.shop_config_name = item.shop_config_name
        updateShopSystemConfig(tempData).then(res => {
          this.getList()
          this.$message.success('修改成功')
        })
      },
      handletypeList() {
        this.typeLoading = true
        getWarehouseList({ page_size: 10 }).then(response => {
          this.fullOptions = response.data
          this.typeLoading = false
        })
      },
      handleUpdate(row) {
        const tempData = Object.assign({})
        tempData.config_id = row.id
        tempData.config_value = row.shop_config_value
        console.log(tempData.config_value)
        tempData.shop_config_name = row.shop_config_name
        updateShopSystemConfig(tempData).then(response => {
          this.fileList = [
            {
              url: row.shop_config_value
            }
          ]
          this.getList()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove() {
        this.sortOptions.shop_config_value = ''
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!')
        }
        return isJPG && isLt2M
      },
      handleUp(response, file, fileList, index) {
        this.sortOptions[index].shop_config_value = response.data.url
      }
    }
  }
</script>

<style scoped>

</style>
