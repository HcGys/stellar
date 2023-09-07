/**
 * mermaid.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% mermaid %}
 * body
 * {% endmermaid %}
 */
'use strict';

module.exports = ctx => function(args, content) {
  if (ctx.theme.config.plugins.mermaid.enable == null || !ctx.theme.config.plugins.mermaid.enable) {
    return ''
  }
  var el = ''
  // content
  el += '<pre class="mermaid">' + content.replaceAll('<', '&#60;').split('\n').join('&#13;') + '</pre>'
  return el
}
