const head = require('./config/head.js');
const plugins = require('./config/plugins.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  // theme: 'npmThemeName', // 使用npm包主题
  theme: require.resolve('../../theme-markfun'), // 使用本地主题

  title: "Tanner's blog | 晓夜记",
  description: '深夜随记,至简。',
  // base: '/', // 格式：'/<仓库名>/'， 默认'/'
  markdown: {
    lineNumbers: true, // 代码行号
  },

  head,
  plugins,
  themeConfig,
}
