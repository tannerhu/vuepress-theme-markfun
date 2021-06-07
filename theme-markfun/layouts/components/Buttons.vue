<template>
  <div class="buttons">
    <transition name="fade">
      <div
        title="返回顶部"
        :class="`button blur iconfont icon-fanhuidingbu ${topButtonClass}`"
        v-show="showToTop"
        @click="scrollToTop"
        @mouseenter="topGoFlag = true"
        @mouseleave="topGoFlag = false"
        @touchstart="topGoFlag = false"
        @touchend="topGoFlag = true"
      />
    </transition>

    <transition name="fade">
      <div
          title="返回原处"
          :class="`button blur back iconfont icon-fanhui ${backButtonClass}`"
          v-show="!showToTop&&scrollBackLocation"
          @click="scrollBack"
          @mouseenter="backFlag = true"
          @mouseleave="backFlag = false"
          @touchstart="backFlag = false"
          @touchend="backFlag = true"
      />
    </transition>

    <div
      title="去评论"
      :class="`button blur go-to-comment iconfont icon-pinglun ${toCommentClass}`"
      @mouseenter="toCommentFlag = true"
      @mouseleave="toCommentFlag = false"
      @touchstart="toCommentFlag = false"
      @touchend="toCommentFlag = true"
      v-show="showCommentBut"
      @click="scrollToComment"
    />
    <div
      title="主题模式"
      :class="`button blur theme-mode-but iconfont icon-zhuti ${themeButtonClass}`"
      @mouseenter="bounceInFlag = true"
      @mouseleave="bounceInFlag = false"
      @touchstart="bounceInFlag = false"
      @touchend="bounceInFlag = true"
      @click="toggleMode()"
    >
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import storage from 'good-storage' // 本地存储
const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl

export default {
  data () {
    return {
      threshold: 100,
      scrollTop: null,
      showCommentBut: false,
      commentTop: null,
      currentMode: null,
      bounceInFlag: false,
      topGoFlag: true,
      backFlag: true,
      toCommentFlag: true,
      scrollBackLocation: null,
      _scrollTimer: null,
      _textareaEl: null,
      _recordScrollTop: null,
      COMMENT_SELECTOR_1: '#vuepress-plugin-comment', // 评论区元素的选择器1
      COMMENT_SELECTOR_2: '#valine-vuepress-comment', // 评论区元素的选择器2
      COMMENT_SELECTOR_3: '.vssue' // 评论区元素的选择器3
    }
  },
  mounted () {
    this.currentMode = storage.get('mode') || 'auto'

    this.scrollTop = this.getScrollTop()
    window.addEventListener('scroll', debounce(() => {
      this.scrollTop = this.getScrollTop()
    }, 100))

    window.addEventListener('load', () => {
      this.getCommentTop()
    })

    // 小屏时选择主题模式后关闭选择框
    if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
      const modeBox = this.$refs.modeBox
      modeBox.onclick = () => {
        this.bounceInFlag = false
      }
      window.addEventListener('scroll', debounce(() => {
        if (this.bounceInFlag) {
          this.bounceInFlag = false
        }
      }, 100))
    }


    // 移动端对类似:hover效果的处理
    const buttons = document.querySelectorAll('.buttons .button')
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]
      button.addEventListener('touchstart', function () {
        button.classList.add('hover')
      })
      button.addEventListener('touchend', function () {
        setTimeout(() => {
          button.classList.remove('hover')
        }, 150)
      })
    }

  },
  computed: {
    showToTop () {
      return this.scrollTop > this.threshold
    },
    themeButtonClass (){
      if (this.bounceInFlag){
        return 'deform'
      }else {
        return ''
      }
    },
    toCommentClass (){
      if (this.toCommentFlag){
        return 'deform-comment'
      }else {
        return ''
      }
    },
    topButtonClass(){
      if (this.topGoFlag){
        return 'deform-top'
      }else {
        return ''
      }
    },
    backButtonClass(){
      if (this.backFlag){
        return 'rotating'
      }else {
        return ''
      }
    }
  },
  methods: {
    toggleMode () {
      this.bounceInFlag = true
      if (this.currentMode === 'auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches
          ||this.currentMode === 'dark') {
        this.setThemeMode('light')
      } else {
        this.setThemeMode('dark')
      }
    },
    setThemeMode(key){
      this.currentMode = key
      this.$emit('toggle-theme-mode', key)
    },
    getScrollTop () {
      return window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop || 0
    },

    scrollToTop () {
      this.scrollBackLocation = document.documentElement.scrollTop || document.body.scrollTop

      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.scrollTop = 0
    },
    scrollBack() {
      if (this.scrollBackLocation>0){
        window.scrollTo({ top: this.scrollBackLocation, behavior: 'smooth' })
        this.scrollBackLocation = null
      }

    },
    getCommentTop () {
      setTimeout(() => {
        let commentEl = document.querySelector(this.COMMENT_SELECTOR_1) || document.querySelector(this.COMMENT_SELECTOR_2) || document.querySelector(this.COMMENT_SELECTOR_3)
        if (commentEl) {
          this.showCommentBut = this.$frontmatter.comment !== false && this.$frontmatter.home !== true
          this.commentTop = commentEl.offsetTop - 58
        }
      }, 500)
    },


    scrollToComment () {
      window.scrollTo({ top: this.commentTop, behavior: 'smooth' })
      this._textareaEl = document.querySelector(this.COMMENT_SELECTOR_1 + ' textarea') || document.querySelector(this.COMMENT_SELECTOR_2 + ' input') || document.querySelector(this.COMMENT_SELECTOR_3 + ' textarea')
      if (this._textareaEl && this.getScrollTop() !== this._recordScrollTop) {
        document.addEventListener("scroll", this._handleListener)
      } else if (this._textareaEl && this.getScrollTop() === this._recordScrollTop) {
        this._handleFocus()
      }
    },

    _handleListener () {
      clearTimeout(this._scrollTimer)
      this._scrollTimer = setTimeout(() => {
        document.removeEventListener('scroll', this._handleListener)
        this._recordScrollTop = this.getScrollTop()
        this._handleFocus()
      }, 30)
    },

    _handleFocus () {
      this._textareaEl.focus()
      this._textareaEl.classList.add('yellowBorder')
      setTimeout(() => {
        this._textareaEl.classList.remove('yellowBorder')
      }, 500)
    }
  },
  watch: {
    '$route.path' () {
      this.showCommentBut = false
      this.getCommentTop()
      this.scrollBackLocation = null
    }
  }
}
</script>

<style lang='stylus'>
.yellowBorder
  // border: #FFE089 1px solid!important
  border-radius 5px
  box-shadow 0 0 15px #FFE089 !important
.buttons
  position fixed
  right 2rem
  bottom 2.5rem
  z-index 11
  @media (max-width $MQNarrow)
    right 1rem
    bottom 1.5rem
  .button
    width 2.2rem
    height 2.2rem
    line-height 2.2rem
    border-radius 50%
    box-shadow 0 2px 6px rgba(0, 0, 0, 0.15)
    margin-top 0.9rem
    text-align center
    cursor pointer
    transition all 0.5s
    background var(--blurBg)
    &.hover
      background $accentColor
      box-shadow 0 0 15px $accentColor
      &:before
        color #fff
    @media (any-hover hover)
      &:hover
        background $accentColor
        box-shadow 0 0 15px $accentColor
        &:before
          color #fff
  .back
    right 5.2rem
    position fixed
    bottom 2.5rem
    @media (max-width $MQNarrow)
      right 4.2rem

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
.fade-enter, .fade-leave-to
  opacity 0

.deform-top
  animation top-go 0.4s  ease-in-out 0.2s 1 alternate forwards

@keyframes top-go
  0% {
    transform: scale3d(1, 1, 1);
  }
  25% {
    transform: scale3d(1.1, 0.8, 1);
  }
  30% {
    transform: translate3d(0px,-15px,0px);
  }
  45% {
    transform: scale3d(0.7, 2, 1);
  }
  55% {
    transform: scale3d(1.1, 0.8, 1);
  }
  85% {
    transform: scale3d(0.9, 1.1, 1);
  }
  90% {
    transform: translate3d(0,0,0);
  }
  100% {
    transform:scale3d(1, 1, 1);
  }

.deform-comment
  animation to-comment 0.4s  ease-in-out 0.2s 1 alternate forwards

@keyframes to-comment
  0% {
    transform: scale3d(0.5, 0.5, 1);
  }
  60% {
    transform: scale3d(1.3, 1.3, 1);
  }
  100% {
    transform:scale3d(1, 1, 1);
  }

.deform
  animation bounce-in 0.4s  ease-in-out 0.1s 1 alternate forwards

@keyframes bounce-in
  0% {
    transform: scale3d(1, 1, 1);
  }
  10% {
    transform: scale3d(0.8, 1.1, 1);
  }
  25% {
    transform: scale3d(1.1, 0.8, 1);
  }
  45% {
    transform: scale3d(0.7, 1.3, 1);
  }
  55% {
    transform: scale3d(1.3, 0.8, 1);
  }
  85% {
    transform: scale3d(0.9, 1.1, 1);
  }
  100% {
    transform:scale3d(1, 1, 1);
  }

.rotating
  animation go-back 0.4s  ease-in-out 0.1s 1 alternate forwards

@keyframes go-back
  0% {
    transform: scale3d(1.5, 1.5, 1.5);
  }
  10% {
    transform: rotate(720deg)
  }

</style>
