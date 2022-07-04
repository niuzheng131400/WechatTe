var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var SystemInfo = wx.getSystemInfoSync();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: {
            title: "首页",
            is_hide: true
        },
        search: '',
        swiper: {
            //当前所在页面的 index
            current: 0,
            //是否显示面板指示点
            indicatorDots: true,
            //是否自动切换 
            autoplay: true,
            //自动切换时间间隔
            interval: 3000,
            //滑动动画时长
            duration: 800,
            //是否采用衔接滑动
            circular: true,
            swiperCurrent: 0,
            imgUrls: [],
            links: [],
        },
        windowHeight: SystemInfo.windowHeight,
        page: 1,
        allpage: '',
        loading: false,
        list: [],
        keyword: '',
        isFristSearch: false
    },
    _searchd: function (evt, page) {
        var keyword = evt.detail ? evt.detail.keyword : evt;
        var page = page ? page : 1;
        var that = this;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'search',
                keyword: keyword,
                page: page
            }),
            method: 'post',
            success: function (res) {
                var arr = that.data.page == 1 ? [] : that.data.list;
                if(res.data.list.length !=0) {
                    res.data.list.forEach(function (value) {
                        arr.push(value);
                    });
                }
               
                that.setData({
                    swiper: {
                    current: 0,
                    indicatorDots: true,
                    autoplay: true,
                    interval: 3000,
                    duration: 800,
                    circular: true,
                    swiperCurrent: 0,
                        imgUrls: res.data.covers,
                        links: res.data.links
                    }
                });
                if (arr.length != 0) {
                    that.setData({
                        list: arr,
                        keyword: keyword,
                        allpage: res.data.allpage,
                        page: res.data.page
                    });
                }

            }
        });
    },
    _loadMore: function () {
        if (this.data.page < this.data.allpage) {
            if (this.data.keyword) {
                this._searchd(this.data.keyword, ++this.data.page);
            } else {
                this.init(++this.data.page);
            }
        }
    },
    init: function (e) {
        var that = this;
        var page = e;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'list',
                page: page
            }),
            method: 'post',
            success: function (res) {
                var arr = that.data.list;
                res.data.list.forEach(function (value) {
                    arr.push(value);
                });
                that.setData({
                    swiper: {
                    current: 0,
                    indicatorDots: true,
                    autoplay: true,
                    interval: 3000,
                    duration: 800,
                    circular: true,
                    swiperCurrent: 0,
                        imgUrls: res.data.covers,
                        links: res.data.links
                    }
                });
                if (arr.length != 0) {
                    that.setData({
                        list: arr,
                        allpage: res.data.allpage,
                        page: res.data.page
                    });
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 0 
        })
      }
        this.init(this.data.page);
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