// 科技资讯站点零依赖工具模块（普通 script 引入，挂到 window.TechNewsFeatures）
(function (global) {
  'use strict';

  // 推荐：找出与指定条目共享标签最多的其它条目
  // itemId: 目标条目 id；items: 条目数组；n: 最多返回条数
  function recommend(itemId, items, n) {
    if (!Array.isArray(items)) return [];          // 防御：items 非数组
    var target = items.find(function (it) {
      return it && it.id === itemId;
    });
    if (!target) return [];                         // 防御：找不到目标条目
    var targetTags = target.tags || [];
    var scored = items.filter(function (it) {
      return it && it.id !== itemId;                // 排除自身
    }).map(function (it) {
      var tags = it.tags || [];
      var shared = tags.filter(function (t) {
        return targetTags.indexOf(t) !== -1;        // 统计共享标签数
      }).length;
      return { item: it, shared: shared, score: it.impactScore || 0 };
    });
    scored.sort(function (a, b) {
      // 综合打分：共享标签为主，同分类/同周次为兜底，最后影响力
      var sa = a.shared * 1000 + (a.item.category === target.category ? 100 : 0) + (a.item.week === target.week ? 40 : 0) + a.score / 100;
      var sb = b.shared * 1000 + (b.item.category === target.category ? 100 : 0) + (b.item.week === target.week ? 40 : 0) + b.score / 100;
      return sb - sa;
    });
    var limit = (typeof n === 'number' && n > 0) ? n : scored.length;
    return scored.slice(0, limit).map(function (s) { return s.item; });
  }

  // 热度榜：按 impactScore 降序返回最多 n 条（用于本周热度/编辑精选）
  function trending(items, n) {
    if (!Array.isArray(items)) return [];           // 防御：items 非数组
    var sorted = items.filter(function (it) { return it; }).slice().sort(function (a, b) {
      return (b.impactScore || 0) - (a.impactScore || 0);
    });
    var limit = (typeof n === 'number' && n > 0) ? n : sorted.length;
    return sorted.slice(0, limit);
  }

  // 暴露全局接口
  global.TechNewsFeatures = { recommend: recommend, trending: trending };
})(window);
