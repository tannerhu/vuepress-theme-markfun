<template>
  <div class="custom-page tags-page">
    <ModuleTransition slot="0.08">
    <MainLayout>
      <template #mainLeft>
        <TagsBar
          v-if="$categoriesAndTags.tags.length"
          :tagsData="$categoriesAndTags.tags"
          :tag="tag"
        />
        <PostList
          :currentPage="currentPage"
          :perPage="perPage"
          :tag="tag"
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
        <TagsBar
          v-if="$categoriesAndTags.tags.length"
          :tagsData="$categoriesAndTags.tags"
          :tag="tag"
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
import TagsBar from '@theme/layouts/components/TagsBar'
import { ModuleTransition } from '@vuepress-reco/core/lib/components'

export default {
  data () {
    return {
      tag: '',
      total: 0, // 总长
      perPage: 10, // 每页长
      currentPage: 1,// 当前页
      loadPage: 1// 当前加载内容的页码
    }
  },
  components: { MainLayout, PostList, Pagination, TagsBar , ModuleTransition},
  created() {
    const queryTag = this.$route.query.tag

    if (queryTag) {
      this.tag = queryTag
      this.total = this.$groupPosts.tags[queryTag].length
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
    '$route.query.tag' (tag) {
      this.tag = tag ? decodeURIComponent(tag) : ''

      if (this.tag) {
        this.total = this.$groupPosts.tags[this.tag].length
      } else {
        this.total = this.$sortPosts.length
      }
      this.currentPage = 1

    }
  }
}
</script>

<style lang='stylus'>
.tags-page
  .tags-wrapper
    position sticky
    top ($navbarHeight + 0.9rem)
    max-height calc(100vh - 10rem)
    min-height 4.2rem
    @media (max-width $MQMobile)
      display none
    .tags
      max-height calc(100vh - 14rem)
      min-height 2.2rem
      overflow-x hidden
      overflow-y auto
      transition all 0.2s
      &::-webkit-scrollbar-track-piece
        background-color rgba(0, 0, 0, 0.05)
      &::-webkit-scrollbar-thumb:vertical
        background-color rgba(0, 0, 0, 0.15)
      &:hover
        &::-webkit-scrollbar-track-piece
          background-color rgba(0, 0, 0, 0.1)
        &::-webkit-scrollbar-thumb:vertical
          background-color rgba(0, 0, 0, 0.25)
.tags-page
  .main-left
    .tags-wrapper
      position relative
      top 0
      padding 0.9rem 1.5rem
      margin-bottom 0.9rem
      max-height 15rem
      border-radius 0
      display none
      @media (max-width $MQMobile)
        display block
      .tags
        max-height 11.5rem
</style>
