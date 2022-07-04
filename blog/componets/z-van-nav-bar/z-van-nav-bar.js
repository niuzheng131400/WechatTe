// componets/z-van-nav-bar/van-nav-bar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item:Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickLeft() {
            wx.navigateBack({
        	delta: 1
           })
        }
    }
})
