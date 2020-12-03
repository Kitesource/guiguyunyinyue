// pages/personal/personal.js
let startY = 0; //手指起始坐标
let moveY = 0; //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    // console.log("start");
    startY = event.touches[0].clientY;
  },

  handleTouchMove(event) {
    // console.log("move");
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    // console.log(moveDistance);
    if(moveDistance <= 0) {
      return; //不能往上移动
    }
    if(moveDistance >= 80) {
      moveDistance = 80;
    }
    // 动态更新coverTransform中的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },

  handleTouchEnd() {
    // console.log("end");
    // 动态更新coverTransform中的状态值
    this.setData({
      coverTransform: `translateY(0)`,
      coverTransition: 'transform 1s linear'
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