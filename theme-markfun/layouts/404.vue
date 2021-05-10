<template>
  <div class="theme-container">
    <div class="theme-markfun-content">
      <span>404</span>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>
const msgs = [
  `消失在网络中.........`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>

<style lang="stylus" scoped>
.theme-markfun-content
  margin 3rem auto
  padding 1.5rem
  span
    font-size 6rem
    color $accentColor
</style>
