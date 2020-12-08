// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
//获取全局实例
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //标识音乐是否在播放
    song: {}, //歌曲详情对象
    musicId: '', //音乐的id
    musicLink: '', //播放音乐的链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options用于接收路由跳转的query参数
    // console.log(options);
    //原生小程序中路由传参，对参数的长度有限制，如果长度过长会自动截取掉
    // console.log(options.song);
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    //获取音乐详情
    this.getMusicInfo(musicId);

    //判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      //修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }

    /* 
      问题： 如果用户操作系统的控制音乐播放/暂停，页面不知道，导致页面显示是否
      播放的状态不一致
      解决： 1.通过控制音乐的实例，backgroundAudioManager 去监视音乐播放/暂停
    */
    //创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监视音乐的播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      // console.log('play');
      // this.setData({
      //   isPlay: true
      // })
      this.changePlayState(true);
      //修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      // console.log('pause');
      //修改音乐是否播放状态
      // this.setData({
      //   isPlay: false
      // })
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      // this.setData({
      //   isPlay: false
      // })
      this.changePlayState(false);
    });
  },

  //修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay: isPlay
    })
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },

  //获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', { ids: musicId });
    this.setData({
      song: songData.songs[0]
    })

    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })

  },

  //控制音乐暂停/播放的状态
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })

    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) { //音乐播放
      if (!musicLink) {
        //获取音乐播放链接
        let musicLinkData = await request('/song/url', { id: musicId })
        // console.log(musicLinkData);
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink,
        })
      }

      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;

    } else { //暂停音乐
      this.backgroundAudioManager.pause();
    }
  },

  //点击切换歌曲的回调
  handleSwitch(event) {
    //获取切换歌的类型（上一首/下一首）
    let type = event.currentTarget.id
    // console.log(type);

    //切换之前关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    //订阅来自recommendSong 页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      //获取音乐的详情信息
      this.getMusicInfo(musicId);
      //切换后自动播放
      this.musicControl(true, musicId);
      //取消订阅
      PubSub.unsubscribe('musicId');
    })

    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
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