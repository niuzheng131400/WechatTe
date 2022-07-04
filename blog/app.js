// app.js
App({
  towxml:require('/towxml/index'),
  onLaunch() {
     // 版本自动更新代码
     const updateManager = wx.getUpdateManager();
     updateManager.onCheckForUpdate(function (res) {
       console.log(res.hasUpdate);
     });
     updateManager.onUpdateReady(function () {
       wx.showModal({
         title: '更新检测',
         content: '检测到新版本，是否重启小程序？',
         success: function (res) {
           if (res.confirm) {
             updateManager.applyUpdate();
           }
         }
       })
     });
     updateManager.onUpdateFailed(function () {
       // 新的版本下载失败
       wx.showModal({
         title: '已有新版本咯',
         content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索“友儿屋”打开呦~',
         showCancel: false
       });
     });
   },
  globalData: {
      cid:0
  }
})
