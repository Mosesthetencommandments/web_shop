<template>
  <div class="hamburger-container" >
    <div class="svg-warpper" @click="toggleClick" >
      <svg-icon style="margin: 0" icon-class="sidebar-show" class="svg_icon hamburger" :class="{'sidebar-is-active':isActive}"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
  .hamburger-container {
    height: 48px;
    width: 16px;
    line-height: 16px;
    cursor: pointer;
  }
  .svg-warpper {
    position: absolute;
    left: 0;
    top: 16px;
    width: 16px;
    height: 16px;
    background: #8a8a8a;
  }
  .svg-warpper:before {
    content: '';
    width: 0;
    height: 0;
    top: -16px;
    left: 0;
    border: 8px solid transparent;
    border-bottom-color: #8a8a8a;
    border-left-color: #8a8a8a;
    position: absolute;
  }
  .svg-warpper:after {
    content: '';
    width: 0;
    height: 0;
    left: 0;
    bottom: -16px;
    position: absolute;
    border: 8px solid;
    border-color: #8a8a8a transparent transparent #8a8a8a;
  }
.hamburger {
  font-size: 14px;
  display: inline-block;
  cursor: pointer;
  transform: rotate(0deg);
  transform-origin: 50% 50%;
}
.sidebar-is-active {
    transform: rotate(180deg);
}
</style>
