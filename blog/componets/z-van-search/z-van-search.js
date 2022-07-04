// componets/z-van-search/z-van-search.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: String
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
    onChange(e) {
      this.setData({
        item: e.detail,
      });
    },
    onClick() {
      let keyword = this.data.item;
      keyword = keyword.replace(/[\u00A0\s"`~!@#$%^&*()+=|{}':;',\[\].<>/?~！@#￥%……&*()——+|{}【】‘；：”“'。，、？]/g, "");
      if (keyword.length <= 0) {
        Notify({
          type: 'warning',
          message: '请填写此字段',
          duration: 1000,
          context: this,
          safeAreaInsetTop: true
        });
        return
      }
      this.triggerEvent('searchd', {
        keyword: keyword
      }, {})
    }
  }
})