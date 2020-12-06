import request from '../../utils/request'
// pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', //天
    month: '', //月
    recommendList:[], //每日推荐数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: function() {
          //跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }

    //更新日期状态数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    //获取每日推荐数据
    this.getRecommendListData();
  },

  //获取每日推荐数据函数
  async getRecommendListData() {
    let recommendListData = await request('/recommend/songs'); 
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  //跳转转至songDetail
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;

    //路由跳转传参： query参数
    wx.navigateTo({
      //不能将song对象直接作为参数传递，长度过长会自动截取掉
      // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
      url: '/pages/songDetail/songDetail?musicId=' + song.id
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