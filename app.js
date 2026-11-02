// app.js
App({
  onLaunch() {
    this.globalData.highestScore = wx.getStorageSync('lw_high') || 0;
    this.globalData.totalRounds  = wx.getStorageSync('lw_rounds') || 0;
    // 把 sentences.txt 一次性读入缓存（小程序不能直接 fs 读 txt，要用 wx.getFileSystemManager）
    try {
      const fs = wx.getFileSystemManager();
      const fullPath = `${wx.env.USER_DATA_PATH}/../../../data/sentences.txt`;
      // 注意：这里用 require 的方式在小程序里会编译，更好的方式是用 txt 放在项目根用绝对路径读
      // 但小程序限制，我们改为：在页面里用 require 打包进来（小程序 .js 可以 require 同目录的 .txt 吗？不行）
      // 最简方案：句子数据硬编码到 data/sentences.js 里。下面 buildSentenceModule 是 fallback。
    } catch (e) { /* ignore */ }
  },
  globalData: {
    highestScore: 0,
    totalRounds: 0,
    // 本次练习数据（从 practice 页传到 result 页）
    currentResult: null
  }
});
