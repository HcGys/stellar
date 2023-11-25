'use strict';

hexo.extend.helper.register('category_color', function(cat){
  const cfg = hexo.theme.config;
  if (cfg.category.colors && cfg.category.colors[cat]) {
    return ' style="color:' + cfg.category.colors[cat] + '"';
  }
  return '';
});
