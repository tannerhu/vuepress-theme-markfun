<template>
  <div class="custom-page categories-page">
    <ModuleTransition slot="0.08">
    <MainLayout>
      <template #mainLeft>
        <CategoriesBar
          v-if="$categoriesAndTags.categories.length"
          :categoriesData="$categoriesAndTags.categories"
          :category="category"
        />
        <PostList
          :currentPage="currentPage"
          :perPage="perPage"
          :category="category"
          :loadPage="loadPage"
        />
        <Pagination
          :total="total"
          :perPage="perPage"
          :currentPage="currentPage"
          :loadPage="loadPage"
          @getCurrentPage="handlePagination"
          @getLoadPage="handleLoadPost"
          v-show="Math.ceil(total / perPage) > 1"
        />
      </template>
      <template #mainRight>
        <CategoriesBar
          v-if="$categoriesAndTags.categories.length"
          :categoriesData="$categoriesAndTags.categories"
          :category="category"
        />
      </template>
    </MainLayout>
    </ModuleTransition>
  </div>
</template>

<script>
import MainLayout from '@theme/layouts/components/MainLayout'
import PostList from '@theme/layouts/components/PostList'
import Pagination from '@theme/layouts/components/Pagination'
import CategoriesBar from '@theme/layouts/components/CategoriesBar'
import { ModuleTransition } from '@vuepress-reco/core/lib/components'

export default {
  data () {
    return {
      category: '',
      total: 0, // 总长
      perPage: 10, // 每页长
      currentPage: 1,// 当前页
      loadPage: 1// 当前加载内容的页码
    }
  },
  components: { MainLayout, PostList, Pagination, CategoriesBar , ModuleTransition},
  created() {
    const queryCategory = this.$route.query.category
    if (queryCategory) {
      this.category = queryCategory
      this.total = this.$groupPosts.categories[queryCategory].length
    } else {
      this.total = this.$sortPosts.length
    }
    if (this.$route.query.p) {
      this.currentPage = Number(this.$route.query.p)
    }
    if (this.$route.query.loadPage){
      this.loadPage = Number(this.$route.query.loadPage)
    }
  },
  mounted () {
    // 滚动条定位到当前分类（增强用户体验）
    const cateEl = document.querySelector('.categories')
    if (cateEl) {
      setTimeout(() => {
        const activeEl = cateEl.querySelector('.active')
        const topVal = activeEl ? activeEl.offsetTop : 0
        cateEl.scrollTo({ top: topVal, behavior: 'smooth' })
      }, 300)
    }
  },
  methods: {
    handlePagination (i) { // 分页
      this.currentPage = i
    },
    handleLoadPost(i){
      this.loadPage = i;
    },
  },

  watch: {
    '$route.query.category' (category) {
      this.category = category ? decodeURIComponent(category) : ''
      if (this.category) {
        this.total = this.$groupPosts.categories[this.category].length
      } else {
        this.total = this.$sortPosts.length
      }
      this.currentPage = 1
      this.loadPage = 1
    }
  }
}
</script>

<style lang='stylus'>
.categories-page
  .categories-wrapper
    position sticky
    top: ($navbarHeight + 0.9rem)
    max-height calc(100vh - 10rem)
    min-height 4.2rem
    @media (max-width $MQMobile)
      display none
    .categories
      padding-right 0.5rem
      max-height calc(100vh - 14rem)
      min-height 2.2rem
      overflow-y auto
      transition all 0.2s
      position relative
      &::-webkit-scrollbar-track-piece
        background-color rgba(0, 0, 0, 0.05)
      &::-webkit-scrollbar-thumb:vertical
        background-color rgba(0, 0, 0, 0.15)
      &:hover
        &::-webkit-scrollbar-track-piece
          background-color rgba(0, 0, 0, 0.1)
        &::-webkit-scrollbar-thumb:vertical
          background-color rgba(0, 0, 0, 0.25)
.categories-page
  .main-left
    .categories-wrapper
      position relative
      top 0
      padding 0.9rem 1.5rem
      margin-bottom 0.9rem
      max-height 15rem
      border-radius 0
      display none
      @media (max-width $MQMobile)
        display block
      .categories
        max-height 12.3rem
</style>
