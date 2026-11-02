const app = getApp();

Page({
  data: {
    questions: [],
    currentIdx: 0,
    current: null,
    total: 0,
    progressPct: 0,
    totalScore: 0,
    feedback: false,
    chosenIdx: -1,
    questionScore: 0,
    labelMap: ['A', 'B', 'C'],
  },
  results: [],

  onLoad() {
    const questions = app.globalData.practiceQuestions || [];
    if (!questions.length) {
      wx.showToast({ title: '请先在首页开始练习', icon: 'none' });
      wx.navigateBack();
      return;
    }
    this.setData({
      questions, total: questions.length,
      current: questions[0],
      progressPct: (1 / questions.length) * 100,
    });
    this.results = [];
  },

  onOptTap(e) {
    if (this.data.feedback) return;
    const idx = e.currentTarget.dataset.idx;
    const cur = this.data.current;
    const correct = idx === cur.correctIdx;
    const questionScore = correct ? 10 : -5;
    const totalScore = this.data.totalScore + questionScore;

    this.results.push({
      id: cur.id, en: cur.en, correctZh: cur.correctZh,
      chosenZh: cur.options[idx], chosenIdx: idx, correct,
      questionScore,
    });

    this.setData({
      feedback: true, chosenIdx: idx,
      questionScore, totalScore,
    });
  },

  onNext() {
    const nextIdx = this.data.currentIdx + 1;
    if (nextIdx >= this.data.total) {
      app.globalData.currentResult = {
        questions: this.results,
        totalScore: this.data.totalScore,
        roundCount: this.data.total,
      };
      app.globalData.highestScore = Math.max(app.globalData.highestScore || 0, this.data.totalScore);
      app.globalData.totalRounds = (app.globalData.totalRounds || 0) + 1;
      wx.setStorageSync('lw_high', app.globalData.highestScore);
      wx.setStorageSync('lw_rounds', app.globalData.totalRounds);
      wx.redirectTo({ url: '/pages/result/result' });
      return;
    }
    this.setData({
      currentIdx: nextIdx,
      current: this.data.questions[nextIdx],
      progressPct: ((nextIdx + 1) / this.data.total) * 100,
      feedback: false, chosenIdx: -1, questionScore: 0,
    });
  }
});
