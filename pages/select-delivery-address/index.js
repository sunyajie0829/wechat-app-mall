const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

const app = getApp()
Page({
  data: {
    addressList: []
  },

  selectTap: function(e) {
    let pages = getCurrentPages();
    let currentPage = null;
    let prevPage = null;
    if (pages.length >= 2){
      currentPage = pages[pages.length -1];
      prevPage = pages[pages.length - 2];
    }
    if (prevPage){
      prevPage.setData({
        curTakeDeliveryAddressData: this.data.addressList[1]
      });
    }
    wx.navigateBack({})
  },
  onLoad: function() {
  },
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initTakeDeliveryAddress();
      } else {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  initTakeDeliveryAddress: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    WXAPI.queryStores(token).then(function(res) {
      if (res.code == 0) {
        that.setData({
          addressList: res.data
        });
      } else if (res.code == 700) {
        that.setData({
          addressList: null
        });
      }
    })
  }

})