// pages/detail/detail.js
var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var SystemInfo = wx.getSystemInfoSync();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: {
            title: "详情页",
            is_hide: false
        },
        windowHeight: SystemInfo.windowHeight,
        info: {},
        article: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        let cid = options.cid ? options.cid : 0
        if (cid) {
            this.init(cid);
        }
    },
    onShareAppMessage() {
        return {
            title: this.data.info.title,
            path: '/page/detail/detail?cid='+this.data.info.cid
        }
    },
    onShareTimeline: function () {
        return {
            title: this.data.info.title,
            query: {
                key: '/page/detail/detail?cid='+this.data.info.cid
            },
            imageUrl: '/images/logo.jpg'
        }
    },
    init: function (e) {
        var that = this;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'info',
                cid: e
            }),
            method: 'post',
            success: function (res) {
                if (res.data.info.length != 0) {
                    that.setData({
                        info: res.data.info,
                        article: app.towxml(res.data.info.text, 'markdown'),
                        item: {
                            title: res.data.info.title,
                            is_hide: false
                        }
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