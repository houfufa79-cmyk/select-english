const { SENTENCES, pickQuestions } = require('../../data/sentences.js');
const app = getApp();

Page({
  data: {
    highestScore: 0,
    totalRounds: 0,
    totalSentences: 0,
    questionCount: 10,
  },

  onLoad() {
    this.setData({
      highestScore: app.globalData.highestScore,
      totalRounds: app.globalData.totalRounds,
      totalSentences: SENTENCES.length,
    });
  },

  onShow() {
    this.setData({
      highestScore: app.globalData.highestScore,
      totalRounds: app.globalData.totalRounds,
    });
  },

  onPickCount(e) {
    this.setData({ questionCount: e.currentTarget.dataset.count });
  },

  onStart() {
    const questions = pickQuestions(this.data.questionCount);
    app.globalData.practiceQuestions = questions;
    wx.navigateTo({ url: '/pages/practice/practice' });
  }
});
