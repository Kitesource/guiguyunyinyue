// pages/search/search.js
import request from '../../utils/request'
let isSend = false; //函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder 的内容
    hotList: [], //热搜榜数据
    searchContent: '', //用户输入的表单项数据
    searchList: [], //关键字模糊匹配到的数据
    historyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取初始化数据
    this.getInitData();
    //获取历史记录
    this.getSearchHistory();
  },

  //获取本地搜索历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList,
      })
    }
  },

  //获取初始化的数据的回调
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    })
  },

  //input内容发生改变的回调
  handleInputChange(event) {
    // console.log(event);
    //更新searchContent的数据
    this.setData({
      searchContent: event.detail.value.trim(),
    })

    if (isSend) {
      return
    }
    isSend = true;
    this.getSearchList();
    //函数节流
    setTimeout(() => {
      isSend = false;
    }, 500)

  },
  //获取搜索数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: [],
      })
      return;
    }
    let { searchContent, historyList } = this.data;
    //发送请求获取关键字模糊匹配数据
    let searchListData = await request('/search', { keywords: searchContent, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs,
    })

    //将搜索的关键字添加到搜索历史记录
    if (historyList.indexOf(searchContent) !== -1) { //之前存在搜索记录
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    //将搜索历史记录添加到本地
    wx.setStorageSync('searchHistory', historyList);
  },

  //清空搜索内容
  clearContent() {
    this.setData({
      searchContent: '',
      searchList: [],
    })
  },

  //删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除吗？',
      success: (res) => {
        // console.log(res);
        if (res.confirm) {
          //清空data中的historyList,
          this.setData({
            historyList: [],
          })
          //清空本地的历史记录缓存
          wx.removeStorageSync('searchHistory');
        }
      }
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