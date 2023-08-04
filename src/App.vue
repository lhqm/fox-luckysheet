<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'


export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 隐藏浏览器默认滚动条 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f5f5f5;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #ebebeb;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgba(66, 185, 131, 0.5);
  border-radius: 5px;
}

/* 滚动条滑块悬停时的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(44, 134, 89, 0.05);
}

/* Firefox浏览器的滚动条样式 */
/* 宽度和滑块颜色与上面的样式保持一致 */
/* 轨道颜色稍微淡一点 */
/* border-radius 属性在 Firefox 上不适用，需要用 -moz-border-radius */
/* 悬停样式与上面相同 */
/* 注意：Firefox上的样式使用了-webkit前缀，但它不会影响其他浏览器 */
/* 可根据需要自行调整样式 */
/*scrollbar-width: thin;*/

/*scrollbar-color: #42b983 #ebebeb;*/
/*-moz-appearance: none;*/
/*-moz-border-radius: 5px;*/
</style>
