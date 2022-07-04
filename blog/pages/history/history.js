// pages/history/history.js
var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var app = getApp();
var SystemInfo = wx.getSystemInfoSync();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: {
            title: "归档",
            is_hide: true
        },
        windowHeight: SystemInfo.windowHeight,
        total:650,
        page: 1,
        allpage: '',
        steps: []
    },
    _loadMore: function () {
        if (this.data.page < this.data.allpage) {
            this.init(++this.data.page);
        }
    },
    toDetail:function(e){
        let link = this.data.steps[e.detail].link;
        if(link) {
            wx.navigateTo({
                url: link,
              })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 2 
        })
      }
      this.init(this.data.page);
    },
    init: function (e) {
        var that = this;
        var page = e;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'history',
                page: page
            }),
            method: 'post',
            success: function (res) {
                var arr = that.data.page == 1 ? [] : that.data.steps;
                res.data.results.forEach(function (value) {
                    arr.push(value);
                });
                if (arr.length != 0) {
                    that.setData({
                        steps: arr,
                        allpage: res.data.allpage,
                        page: res.data.page
                    });
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})