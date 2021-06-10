// 解决代码选项卡无法加载的问题
import Vue from 'vue'
import CodeBlock from "@theme/components/CodeBlock.vue"
import CodeGroup from "@theme/components/CodeGroup.vue"
import { repairUTCDate } from './util/index'
// Register the Vue global component
Vue.component(CodeBlock)
Vue.component(CodeGroup)

//  注：此文件在浏览器端运行
import postsMixin from '@theme/mixins/posts'
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // 修复ISO8601时间格式为普通时间格式，以及添加作者信息
  siteData.pages.map(item => {
    const { frontmatter: { date, author } } = item
    if (typeof date === 'string' && date.charAt(date.length - 1) === 'Z') {
      item.frontmatter.date = repairUTCDate(date)
    }
    if (author) {
      item.author = author
    } else {
      if (siteData.themeConfig.author) {
        item.author = siteData.themeConfig.author
      }
    }
  })

  // 将对文章数据的处理结果混入Vue实例
  Vue.mixin(postsMixin)
}