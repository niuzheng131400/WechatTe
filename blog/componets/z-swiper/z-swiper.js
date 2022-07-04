const { isObj } = require("../../miniprogram_npm/@vant/weapp/common/validator");
// componets/z-swiper/z-swiper.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        swiper: Object
    },
    /**
     * 组件的初始数据
     */
    data: {
        swiperCurrent:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //轮播图的切换事件
        swiperChange: function (e) {
            this.setData({
                swiperCurrent: e.detail.current
            })
        },
        //点击图片触发事件
        swipclick: function (e) {
            let index = this.data.swiperCurrent;
            let link = this.properties.swiper.links[index];
            if(link) {
               wx.reLaunch({
                 url: link,
               })
            }
        }
    }
})