<template>
  <div class="tags-view-container" v-if="visitedViews.length > 0">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :style="{backgroundColor: isActive(tag)? $store.getters.theme : '#fff',borderColor: isActive(tag)? $store.getters.theme : '#d8dce5'}" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        <!-- {{generateTitle(tag.title)}} -->
        {{tag.title}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from '@/components/ScrollPane'
  import { generateTitle } from '@/utils/i18n'
  export default {
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        styleObj: {
          backgroundColor: this.$store.getters.theme
        }
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    watch: {
      $route(val) {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          window.addEventListener('click', this.closeMenu)
        } else {
          window.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
    },
    methods: {
      generateTitle, // generateTitle by vue-i18n
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      isActive(route) {
        return route.path === this.$route.path || route.name === this.$route.name
      },
      addViewTags() {
        const route = this.generateRoute()
        // console.log(route)
        if (!route  || route.meta.hidden) {
          return false
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      moveToCurrentTag() {
        this.$nextTick(() => {
          const tags = this.$refs.tag
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView.path)
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag.path)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX
        this.top = e.clientY
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/variables.scss";

  .tags-view-container {
    position: relative;
    height: 34px;
    z-index:900;
    .tags-view-wrapper {
      background: #fff;
      width: 100%;
      top: 40px;
      position: fixed;
      height: 34px;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
      .tags-view-item {
        display: inline-block;
        border-radius: 12px;
        position: relative;
        height: 24px;
        line-height: 24px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 13px;
        margin-left: 3px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &.active {
          color: #fff;
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: relative;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 2;
      position: fixed;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
  /*.tags-view-container .tags-view-wrapper .tags-view-item.active[data-v-57b800e8] {*/
  /*background-color: #409EFF;*/
  /*border-color: #409EFF;*/
  /*}*/
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 20px;
        height: 20px;
        vertical-align: 3px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          /*transform: scale(.6);*/
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
