// pages/me/me.js
var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var SystemInfo = wx.getSystemInfoSync();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: {
            title: "个人中心",
            is_hide: true
        },
        windowHeight: SystemInfo.windowHeight,
        info:{
            me:'一名普通的程序员，希望大家一起相互学习。。在编程学习中，越来越体会到知识输出的重要性，所以特地开通这个博客，以后会不定期地在这上面发一些个人笔记。希望在对自己的知识进行总结的同时，亦能接收网友的意见。个人水平有待提高，在博客中难免会有一些见笑的地方，请大家多多见谅，若有错漏之处，也请不吝赐教。',
            motto:'让程序创造人生 ，让学习成为一种习惯。',
            website:'https://niuzheng.net',
            mail:'771036148#qq.com',
            copyright:'本站除注明原创外，其他内容均来源于网络收集，如有侵权，请邮件告知我并删除。',
            footer:"友儿屋",
            nickName: "友儿",
            avatarUrl: '/images/head.jpg',
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 4
        })
      };
      this.init();
    },
    init: function () {
        var that = this;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'me'
            }),
            method: 'post',
            success: function (res) {
                if (res.data.length != 0) {
                    that.setData({
                        info: res.data
                    });
                }
            }
        });
    },
    copy: function ({currentTarget:{dataset:{type}}}) {
        var data='',msg='';
        if(type != 0){
            data += this.data.info.website;
            msg = '复制网址成功';
        } else {
            data += this.data.info.mail;
            msg = '复制邮箱成功';
        }
        wx.setClipboardData({
            data: data,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        wx.showToast({
                            title: msg,
                        })
                    }
                })
            }
        })
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