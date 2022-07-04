# WechatTe --- typecho 小程序插件以及小程序框架

### 最近闲来有空，就自己开发了一套对接typecho框架的微信小程序------`WechatTe`
- 小程序前端框架 [vant-weapp](https://vant-contrib.gitee.io/vant-weapp/#/home) 和 [微信官方组件](https://developers.weixin.qq.com/miniprogram/dev/component/)
- 本小程序美观、简洁、大方。
- 后端数据缓存驱动提供了`Memcache`、`Redis`。
- 请求数据加密。
- 数据动态更新。
- 首页轮播图、个人中心头图、个人中心名称、关于我、座右铭、博客地址、个人中心邮箱、版权等展示方面的配置。
- 主要页面有`首页`、`分类列表`、`标签列表`、`文章详情页`、`文章归档`、`个人中心`等页面。

### 图片展示

- 首页、分类/标签文章页、文章归档页、标签页、个人中心

<img src="https://niuzheng.net/usr/uploads/2022/07/index.jpg" width="150px"/> <img src="https://niuzheng.net/usr/uploads/2022/07/cate.jpg" width="150px"/><img src="https://niuzheng.net/usr/uploads/2022/07/cate.jpg" width="150px"/><img src="https://niuzheng.net/usr/uploads/2022/07/history.jpg" width="150px"/><img src="https://niuzheng.net/usr/uploads/2022/07/tag.jpg" width="150px"/><img src="https://niuzheng.net/usr/uploads/2022/07/me.jpg" width="150px"/>

### 安装
- 微信公共号平台配置
  - 获取AppID : 开发管理 -> 开发设置 -> AppID(小程序ID)  
  - request合法域名配置(你的接口域名): https://xxxxx.net  
- 获取代码(`blog`为小程序源码文件;`WechatTe`为typecho小程序插件)
- 插件上传安装
  - 上传WechatTe到网站插件目录(/usr/plugins/)
  - 启用插件WechatTe
- 配置项
  - 首页轮播图配置 : 按例子格式配置
  - 通信密钥: 配置api密钥
  - 个人中心
    - 个人中心头图
    - 个人中心名称
    - 关于我
    - 座右铭
    - 博客地址
    - 个人中心邮箱
    - 个人中心版权说明
  - 小程序版权
    - 小程序底部版权
  - 缓存相关的
    - 缓存过期时间 
    - 缓存驱动
    - 主机地址
    - 端口号
    - 连接密码
    - 是否清除当前缓存
- 下载微信开发者工具并以你上面获取的AppID导入blog目录
  - 修改config.js配置
    - domain 为你接口的域名,该域名在上面必须`微信公共号平台配置在request合法域名配置里面`
    - app_secret 为WechatTe插件后台配置的`通信密钥`
- 这样你就可以访问你的小程序了，上传到服务器等着审核就可以了  
