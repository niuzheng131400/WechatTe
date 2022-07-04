// componets/z-item/z-item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        info: Object,
        titleclass: String,
        customclass: String
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
        toDetail({currentTarget: {dataset: {link}}}) {
            wx.navigateTo({
                url: link,
              })
        }
    }
})