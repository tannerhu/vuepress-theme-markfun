<template>
  <div class="home-wrapper">
    <!-- banner块 -->
    <div
      class="banner"
      :class="{ 'hide-banner': !showBanner }"
      :style="`background-image: url(${bannerBgImg}) ;background-attachment: ${bgAttachment}`"
    >
      <div
        class="banner-conent"
      >
        <header class="hero">
          <img
            v-if="homeData.heroImage"
            :src="$withBase(homeData.heroImage)"
            :alt="homeData.heroAlt"
          />
          <h1 v-if="homeData.heroText" id="main-title" class="blog-title-font">
            {{ homeData.heroText }}
          </h1>
          <p v-if="homeData.tagline" class="description" >
            {{ homeData.tagline }}
          </p>
          <p class="action" v-if="homeData.actionText && homeData.actionLink">
            <NavLink class="action-button" :item="actionLink" />
          </p>
        </header>

      </div>
      <div class="slant-left"></div>
      <div class="slant-right"></div>

    </div>
    <!-- banner块 -->
    <ModuleTransition delay="0.04">
    <MainLayout>
      <template #mainLeft>
        <!-- 简约版文章列表 -->
        <UpdateArticle
          class="card-box"
          v-if="homeData.postList === 'simple'"
          :length="homeData.simplePostListLength || 10"
        />

        <!-- 详情版文章列表 -->
        <template
          v-else-if="!homeData.postList || homeData.postList === 'detailed'"
        >
          <PostList :currentPage="currentPage" :perPage="perPage" />
          <Pagination
            :total="total"
            :perPage="perPage"
            :currentPage="currentPage"
            @getCurrentPage="handlePagination"
            v-show="Math.ceil(total / perPage) > 1"
          />
        </template>

        <Content class="theme-markfun-content custom card-box" />
      </template>

      <template #mainRight>
        <CategoriesBar
          v-if="
            $themeConfig.category !== false &&
            $categoriesAndTags.categories.length
          "
          :categoriesData="$categoriesAndTags.categories"
          :length="10"
        />
        <TagsBar
          v-if="$themeConfig.tag !== false && $categoriesAndTags.tags.length"
          :tagsData="$categoriesAndTags.tags"
          :length="30"
        />
        <div
          class="custom-html-box card-box"
          v-if="homeSidebarB"
          v-html="homeSidebarB"
        ></div>
      </template>
    </MainLayout>
    </ModuleTransition>
  </div>
</template>

<script>
import NavLink from "@theme/layouts/components/NavLink";
import BScroll from "@better-scroll/core"
import Slide from "@better-scroll/slide"
import MainLayout from '@theme/layouts/components/MainLayout'
import PostList from '@theme/layouts/components/PostList'
import UpdateArticle from '@theme/layouts/components/UpdateArticle'
import Pagination from '@theme/layouts/components/Pagination'
import CategoriesBar from '@theme/layouts/components/CategoriesBar'
import TagsBar from '@theme/layouts/components/TagsBar'
import { type } from '../../util'
import { ModuleTransition } from '@vuepress-reco/core/lib/components'

const MOBILE_DESKTOP_BREAKPOINT = 720 // refer to config.styl

BScroll.use(Slide)

export default {

  data () {
    return {
      bannerBgImg: '',
      bgAttachment: 'fixed',
      isMQMobile: false,

      slide: null,
      currentPageIndex: 0,
      playTimer: 0,
      mark: 0,

      total: 0, // 总长
      perPage: 10, // 每页长
      currentPage: 1// 当前页
    }
  },
  computed: {
    homeData () {
      return {
        ...this.$page.frontmatter
      }
    },
    homeSidebarB () {
      const { htmlModules } = this.$themeConfig
      return htmlModules ? htmlModules.homeSidebarB : ''
    },
    showBanner () { // 当分页不在第一页时隐藏banner栏
      return this.$route.query.p
        && this.$route.query.p != 1
        && (!this.homeData.postList || this.homeData.postList === 'detailed')
        ? false : true
    },
    actionLink () {
      return {
        link: this.homeData.actionLink,
        text: this.homeData.actionText
      };
    }
  },
  components: { NavLink, MainLayout, PostList, UpdateArticle, CategoriesBar, TagsBar, Pagination ,ModuleTransition},
  created () {
    this.total = this.$sortPosts.length
  },
  beforeMount () {
    this.isMQMobile = window.innerWidth < MOBILE_DESKTOP_BREAKPOINT ? true : false; // vupress在打包时不能在beforeCreate(),created()访问浏览器api（如window）
  },
  mounted () {
    if (this.$route.query.p) {
      this.currentPage = Number(this.$route.query.p)
    }
    let osInfo = navigator.userAgent.toLowerCase();

    //apple的 ios 不支持 background-attachment: fixed
    let os = osInfo.indexOf('os')
    if (os>0){
      this.bgAttachment = 'initial'
    }

    let bannerBg = this.homeData.bannerBg
    if (type(bannerBg) === 'array') { //多图
    let count = 0
    let timer = null
    this.bannerBgImg = bannerBg[count]
    clearInterval(timer)
    timer = setInterval(() => {
      if (++count >= bannerBg.length) {
        count = 0
      }
      this.bannerBgImg = bannerBg[count]
    }, 15000);
    } else if (type(bannerBg) === 'string') { //单图
     this.bannerBgImg = bannerBg
    }
  },
  beforeDestroy () {
    clearTimeout(this.playTimer)
    this.slide && this.slide.destroy()
  },
  watch: {
    '$route.query.p' () {
      if (!this.$route.query.p) {
        this.currentPage = 1
      } else {
        this.currentPage = Number(this.$route.query.p)
      }
    }
  },
  methods: {
    init () {
      clearTimeout(this.playTimer)
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true, // x轴滚动
        scrollY: false, // y轴滚动
        slide: {
          loop: true,
          threshold: 100
        },
        useTransition: true, // 使用css3 transition动画
        momentum: false,
        bounce: false, // 回弹
        stopPropagation: false, // 是否阻止事件冒泡
        probeType: 2,
        preventDefault: false
      })

      // user touches the slide area
      this.slide.on('beforeScrollStart', () => {
        clearTimeout(this.playTimer)
      })
      // user touched the slide done
      this.slide.on('scrollEnd', () => {
        this.autoGoNext()
      })
      this.slide.on('slideWillChange', (page) => {
        this.currentPageIndex = page.pageX
      })
      this.autoGoNext()
    },
    autoGoNext () {
      clearTimeout(this.playTimer)
      this.playTimer = setTimeout(() => {
        this.slide.next()
      }, 4000)
    },
    handlePagination (i) { // 分页
      this.currentPage = i
    },
    getScrollTop () {
      return window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop
    },
  },

};
</script>

<style lang="stylus" scoped>
.home-wrapper
  .banner
    transition background 0.5s
    width 100%
    min-height 600px
    margin-top $navbarHeight
    color $bannerTextColor
    position relative
    overflow hidden
    background-position center center
    background-repeat no-repeat
    -webkit-background-size cover
    -moz-background-size cover
    -o-background-size cover
    background-size cover
    .banner-conent
      max-width $homePageWidth
      margin 0px auto
      position relative
      z-index 1
      overflow hidden
      .hero
        text-align center
        margin-top 3rem
        img
          max-width 100%
          max-height 240px
          display block
          margin 2rem auto 1.5rem
        h1
          margin 0
          font-size 3.2rem
        .description, .action
          margin 1.5rem auto
        .description
          max-width 40rem
          font-size 1.1rem
          line-height 1.3
          opacity 0.9
        .action-button
          display inline-block
          font-size 1.2rem
          background-color $accentColor
          padding 0.8rem 1.6rem
          border-radius 4px
          transition background-color 0.1s ease
          box-sizing border-box
          border-bottom 1px solid darken($accentColor, 10%)
          color #fff
          &:hover
            background-color lighten($accentColor, 10%)
  // 分页不在第一页时，隐藏banner栏
  .banner.hide-banner
    display none
    & + .main-wrapper
      margin-top: ($navbarHeight + 0.9rem)
  .main-wrapper
    margin-top 2rem
    .main-left
      .card-box
        margin-bottom 0.9rem
      .pagination
        margin-bottom 4rem
      .theme-markfun-content
        padding 0 2rem
        overflow hidden
        &>:first-child
          padding-top 2rem
        &>:last-child
          padding-bottom 2rem
    .main-right
      .custom-html-box
        padding 0
        overflow hidden
  .slant-right
    background var(--bodyBg)
    width 101%
    position absolute
    bottom -80px
    left 48%
    height: 200px
    -webkit-transform: rotate(
        -6deg
    )
    -moz-transform: rotate(-6deg)
    -ms-transform: rotate(-6deg)
    -o-transform: rotate(-6deg)
    transform: rotate(-6deg)
  .slant-left
    background var(--bodyBg)
    width 101%
    position absolute
    bottom -80px
    right 48%
    height 200px
    -webkit-transform rotate(
        6deg
    )
    -moz-transform rotate(6deg)
    -ms-transform rotate(6deg)
    -o-transform rotate(6deg)
    transform rotate(6deg)
@keyframes heart
  from
    transform translate(0, 0)
  to
    transform translate(0, 8px)
// 1025px以下
@media (max-width 1025px)
  .home-wrapper
    .slant-left
      height 130px
    .slant-right
      height 130px
    .banner
      min-height 500px
      .banner-conent
        .hero
          h1
            font-size 2.5rem
          .description
            font-size 1rem
        .feature
          a
            h2
              font-size 1.1rem
            .feature-img
              width 9rem
              height 9rem
// 719px以下
@media (max-width $MQMobile)
  .home-wrapper
    .slant-left
      height 115px
      bottom -65px
      transform rotate(8deg)
      -webkit-transform rotate(
          8deg
      )
      -moz-transform rotate(8deg)
      -ms-transform rotate(8deg)
      -o-transform rotate(8deg)
    .slant-right
      height 115px
      bottom -65px
      transform rotate(-8deg)
      -webkit-transform rotate(
          -8deg
      )
      -moz-transform rotate(-8deg)
      -ms-transform rotate(-8deg)
      -o-transform rotate(-8deg)
    .banner
      min-height 500px
      .banner-conent
        .features
          display none !important
// 419px以下
@media (max-width $MQMobileNarrow)
  .home-wrapper
    .slant-left
      height 100px
      transform rotate(10deg)
      -webkit-transform rotate(
          10deg
      )
      -moz-transform rotate(10deg)
      -ms-transform rotate(10deg)
      -o-transform rotate(10deg)
    .slant-right
      height 100px
      transform rotate(-10deg)
      -webkit-transform rotate(
          -10deg
      )
      -moz-transform rotate(-10deg)
      -ms-transform rotate(-10deg)
      -o-transform rotate(-10deg)
    .banner
      min-height 400px
      .banner-conent
        padding-left 1.5rem
        padding-right 1.5rem
        .hero
          img
            max-height 210px
            margin 2rem auto 1.2rem
          h1
            font-size 2rem
          h1, .description, .action
            margin 1.2rem auto
          .description
            font-size 1.2rem
          .action-button
            font-size 1rem
            padding 0.6rem 1.2rem
        .feature
          h2
            font-size 1.25rem
</style>
