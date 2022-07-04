// pages/cate/cate.js
var Api = require('../../helpers/api');
var Req = require('../../helpers/req');
var app = getApp();
var SystemInfo = wx.getSystemInfoSync();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //nav-bar
        item: {
            title: "分类文章",
            is_hide: true
        },
        //scroll-view分页高度
        windowHeight: SystemInfo.windowHeight,
        //分页
        page: 1,
        //右侧样式
        span: 12,
        //是否加载动画
        loading: false,
        //右侧文章数据
        items: [],
        mainActiveIndex: 0,
        cate: 0,
        oldcate:0,
        //左侧分类/标签数据
        list: [],
        //总页数
        allpage:'',
        //右侧文章距离顶部距离
        top:0,
        //分类/标签
        type:'category'
    },
    //触底事件
    _loadMore: function () {
        if (this.data.page < this.data.allpage) {
            let type  = this.data.type; 
            this.init(++this.data.page,this.data.cate,type);
        }
    },
    //左侧点击事件
    onClickNav({detail = {}}) {
        let oldcate = this.data.cate;
        let type  = this.data.type; 
        let cate = this.data.items[detail.index].id;
        this.setData({
            mainActiveIndex: this.items || 0,
            cate: cate,
            page:1,
            top:0,
            oldcate:oldcate,
            type:type
        });
        this.init(this.data.page,cate,type);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 1 
        })
      }
      let cate = options.cate ? options.cate: 0;
      let type = options.type ? options.type : 'category';
      this.setData({
        item: {
            title: type == 'tag' ? '标签文章':"分类文章",
            is_hide: true
        },
        type: type
      });
      this.init(this.data.page, cate, type);
    },
    //初始化方法
    init: function (e,cate,type) {
        var that = this;
        var page = e;
        Req.request({
            url: Api.url,
            data: Api.GetSignParams({
                method: 'cate',
                page: page,
                cate: cate,
                type:type
            }),
            method: 'post',
            success: function (res) {
                if (res.data.list.length != 0) {
                    that.setData({
                        items: res.data.list
                    });
                    that.data.items.forEach(function(val,index){
                        if(val.id == cate) {
                            that.setData({
                                mainActiveIndex: index
                            });
                        }
                    });
                }
                
                var arr = that.data.page == 1 || that.data.cate != that.data.oldcate ?  [] : that.data.list;
                if(res.data.cates.length != 0) {
                    res.data.cates.forEach(function (value) {
                        arr.push(value);
                    });
                }
                if (arr.length != 0) {
                    that.setData({
                        list: arr,
                        allpage: res.data.allpage,
                        cate: res.data.cate,
                        page:res.data.page
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