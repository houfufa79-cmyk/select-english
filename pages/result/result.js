const app = getApp();

Page({
  data: {
    questions: [],
    totalScore: 0,
    totalMax: 0,
    accuracy: 0,
    emoji: '🌟',
    title: 'Great Job!',
    subtitle: 'Keep talking like a native',
  },

  onLoad() {
    const r = app.globalData.currentResult;
    if (!r) {
      wx.showToast({ title: '暂无结果', icon: 'none' });
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }

    const correctCount = r.questions.filter(q => q.correct).length;
    const accuracy = r.questions.length === 0 ? 0 : Math.round((correctCount / r.questions.length) * 100);
    const totalMax = r.questions.length * 10;

    let emoji = '🌟', title = 'Great Job!', subtitle = 'Keep talking like a native';
    if (accuracy >= 90) { emoji = '🏆'; title = 'Native Level!'; subtitle = '准确率超 90%，继续保持'; }
    else if (accuracy >= 75) { emoji = '👏'; title = 'Excellent!'; subtitle = '很不错！继续练习'; }
    else if (accuracy >= 55) { emoji = '💪'; title = 'Good Effort!'; subtitle = '再接再厉'; }
    else { emoji = '📚'; title = 'Keep Going!'; subtitle = '多练几次就好'; }

    this.setData({
      questions: r.questions,
      totalScore: r.totalScore,
      totalMax, accuracy,
      emoji, title, subtitle,
    });
  },

  onHome() { wx.redirectTo({ url: '/pages/index/index' }); },
  onRetry() { wx.redirectTo({ url: '/pages/index/index' }); },
});
