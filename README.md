<p align="center"><a href="https://haxbk.com/" target="_blank" rel="noopener noreferrer"><img width="180" src="https://image.haxbk.com/blog/MarkFun.png" alt="logo"></a></p>

<h2 align="center">vuepress-theme-markfun</h2>

## Introduce

vuepress-theme-markfun for vuepress

一个基于VuePress的博客主题简单 精致 有趣

Demo： [Tanner's blog](https://haxbk.com/)


## Quick start

🌱vuepress-theme-markfun1.x master 分支 [点击切换分支](https://github.com/tannerhu/vuepress-theme-markfun/tree/master)

```bash
# 克隆项目
git clone -b master https://github.com/tannerhu/vuepress-theme-markfun.git
# 进入项目目录安装依赖 
cd vuepress-theme-markfun && npm i
# 进入主题目录安装依赖
cd theme-markfun && npm i
# 回到项目主目录 启动项目
cd ../ && npm run dev
```

## Directory structure

```
.
├── docs
│   ├── 01.**    //首个自定义导航
│   │   └── 01.**.md
│   ├── 02.**    //第二个自定义导航（03.类推）
│   │   └── 01.**.md
│   ├── index.md
│   ├── _posts   //随笔文章目录
│   │   └── 文章归类名
│   │       └── **.md
│   └── .vuepress
│       ├── config
│       │   ├── head.js        //<head>标签设置
│       │   ├── plugins.js
│       │   ├── themeConfig
│       │   │    └── nav.js
│       │   └── themeConfig.js  //主题配置
│       ├── config.js           //vuepress配置入口
│       ├── enhanceApp.js
│       ├── public
│       │   └── img             //静态图片图标资源
│       │       ├── favicon.ico
│       │       └──**.png
│       └── styles
│           ├── index.styl
│           └── palette.styl   //主题布局颜色配置
├── LICENSE
├── package.json
├── README.md
├── theme-markfun  //主题根目录
│   ├── components //公用组件
│   │   ├── **.vue
│   ├── enhanceApp.js
│   ├── index.js
│   ├── layouts    //主布局组件
│   │   ├── **.vue
│   │   └── components
│   │       └── **.vue
│   ├── mixins
│   │   └── **.js
│   ├── node_utils
│   │   ├── getSidebarData.js
│   │   ├── handlePage.js
│   │   ├── modules
│   │   │   ├── fn.js
│   │   │   └── readFileList.js
│   │   └── setFrontmatter.js
│   ├── noopModule.js
│   ├── package.json
│   ├── styles
│   │   └── **.styl
│   ├── templates
│   │   └── **.html
│   └── util
│       └── **.js
└── utils        //工具包
    ├── baiduPush.js
    ├── config.yml
    ├── editFrontmatter.js
    └── modules
        └── **.js
```



## Thanks

| Project                                                          |
| ---------------------------------------------------------------- |
| [VuePress](https://github.com/vuejs/vuepress)                              |
| [vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing)     |
| [vuepress-theme-reco](https://github.com/vuepress-reco/vuepress-theme-reco)   |

[More](https://github.com/tannerhu/vuepress-theme-markfun#readme).