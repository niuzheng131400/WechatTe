// componets/z-tabbar/z-tabbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
         active:0,
         "list": [
            {
                "pagePath": "/pages/index/index"
            },
            {
                "pagePath": "/pages/cate/cate"
            },
            {
                "pagePath": "/pages/history/history"
            },
            {
                "pagePath": "/pages/tag/tag"
            },
            {
                "pagePath": "/pages/me/me"
            }
        ]
    },
    attached(){

    },
    /**
     * 组件的方法列表
     */
    methods: {
        onChange({detail}) {
            let active = detail;
            const url = this.data.list[active].pagePath;
            wx.switchTab({url});
            this.setData({ active: active });
        }
    }
})
