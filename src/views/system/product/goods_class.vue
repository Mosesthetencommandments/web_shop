<template>
  <div class="app-container calendar-list-container">
    <el-card style="width: 50%">
      <template slot="header">
        <el-button type="primary"
                   @click="append(0)">创建根分类
        </el-button>
      </template>
      <el-tree :data="data"
               :props="defaultProps"
               node-key="id"
               :indent="20"
               @node-expand="treeExpand"
               @node-collapse="treeCollapse"
               :default-expanded-keys="expandTree"
               :expand-on-click-node="false"
               :default-expand-all="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="position: absolute;right: 0;top: 0;">
           <el-button
             type="text"
             size="mini"
             style="font-size: 12px;text-align: right;"
             @click.stop="() => exit(node, data)">
            编辑
          </el-button>
          <el-button
            type="text"
            v-if="data.deep < 3"
            size="mini"
            style="font-size: 12px;text-align: right;"
            @click.stop="() => append(data)">
            添加
          </el-button>
          <el-switch
            v-model="data.status"
            :active-value="1"
            @change="value => changeStatus(value,data)"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>

          <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--style="font-size: 12px;text-align: right;"-->
            <!--@click="() => remove(node, data)">-->
            <!--删除-->
          <!--</el-button>-->
        </span>
      </span>
      </el-tree>
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="innerDataForm1" :model="temp" label-position="left" label-width="80px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="分类名称" prop="auth_name">
          <el-input v-model="temp.category_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createData(currentData)">确 定</el-button>
        <el-button v-else type="primary" @click="updataData(currentData)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getShopGoodsCategoryTree,
    createShopGoodsCategory,
    updateShopGoodsCategory,
    changeShopGoodsCategoryStatus
  } from '@/api/goods'

  export default {
    name: 'productGoodsClass',
    data() {
      return {
        listLoading: true,
        dialogFormVisible: false,
        currentData: {},
        data: [],
        expandTree: [],
        menunode: undefined,
        temp: {
          category_name: undefined,
          deep: 1
        },
        defaultProps: {
          children: 'son',
          label: 'category_name'
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dragtemp: {
          pid: undefined,
          user_menu_id: undefined
        },
        draggingNodelist: []
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      getMenuList() {
        this.listLoading = true
        getShopGoodsCategoryTree().then(response => {
          this.data = response.data
          this.listLoading = false
        })
      },
      append(data) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.currentData = data
      },
      exit(node, data) {
        this.menunode = node
        this.temp = {
          category_name: data.category_name
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.currentData = data
      },
      updataData(data) {
        const parms = this.temp
        parms.product_category_id = data.id
        updateShopGoodsCategory(parms).then(response => {
          const parent = this.menunode.parent
          const children = parent.data.son || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children[index].category_name = parms.category_name
          this.dialogFormVisible = false
        })
      },
      changeStatus(value,data) {
        const parms = {
          product_category_id: data.id,
          status: value,
          deep: data.deep
        }
        changeShopGoodsCategoryStatus(parms).then(res => {
          this.getMenuList()
        }).catch(() => {
          data.status = value == 0 ? 1 : 0
        })
      },
      treeExpand(data) {
        this.expandTree.push(data.id)
      },
      treeCollapse(data) {
        this.expandTree.splice(this.expandTree.findIndex(item => item.id === data.id), 1)
      },
      remove(node, data) { },
      resetTemp() {
        this.temp = {
          category_name: undefined
        }
      },
      createData(data) {
        if (data === 0) {
          this.temp.pid = 0
          this.temp.deep = 1
        } else {
          this.temp.pid = data.id
          this.temp.deep = ++data.deep
        }
        createShopGoodsCategory(this.temp).then(response => {
          this.getMenuList()
          this.dialogFormVisible = false
        })
      },
      handleDrop(draggingNode, dropNode, dropType, ev) { }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-tree-node__content {
    position: relative;
  }
</style>
