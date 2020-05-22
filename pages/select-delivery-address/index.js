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
    let address = e.currentTarget.dataset.bean;
    if (pages.length >= 2){
      currentPage = pages[pages.length -1];
      prevPage = pages[pages.length - 2];
    }
    if (prevPage){
      prevPage.setData({
        curTakeDeliveryAddressData: address
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
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude)
      },
      fail(e){
        console.error(e)
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    })
  },
  async fetchShops(latitude, longitude){
    const res = await WXAPI.fetchShops({
      curlatitude: latitude,
      curlongitude: longitude
    })
    if (res.code == 0) {
      res.data.forEach(ele => {
        ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
      })
      this.setData({
        addressList: res.data
      })
    } else {
      this.setData({
        shops: null
      })
    }
  },
})