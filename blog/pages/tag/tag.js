// pages/tag/tag.js
var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var SystemInfo = wx.getSystemInfoSync();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      item:{
        title:"标签",
        is_hide:true
      },
      windowHeight: SystemInfo.windowHeight,
      page:1,
      list:[]
    },
    _loadMore:function(){
        this.setData({loading:true});
    },
    toDetail({currentTarget: {dataset: {link}}}) {
        wx.reLaunch({
            url: link,
          });
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 3
        })
      }
        this.init();
    },
    init: function () {
        var that = this;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'tag'
            }),
            method: 'post',
            success: function (res) {
                if (res.data.list.length != 0) {
                    that.setData({
                        list: res.data.list
                    });
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})