// head
module.exports = [
  // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
  ['link', { rel: 'icon', href: '/img/favicon.ico' }], //favicons，资源放在public文件夹
  [
    'meta',
    {
      name: 'keywords',
      content: '后端,后端框架,数据库,监控,硬件,摄影,素描,色彩,漫画,前端,前端开发,前端框架,缓存,MacOS,linux,web前端,技术文档,java,spring,springboot,tomcat,nginx,JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github,markdown',
    },
  ],
  // ['meta', { name: 'baidu-site-verification', content: '' }], // 百度统计的站长验证
  ['meta', { name: 'theme-color', content: '#11a8cd' }], // 移动浏览器主题颜色
  // [
  //   'script',
  //   {
  //     'data-ad-client': '',
  //     async: 'async',
  //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
  //   },
  // ], // 网站关联Google AdSense 与 html格式广告支持
]
