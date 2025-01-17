/**
 * folding.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% folding [color:yellow] [child:codeblock|diagram|iframe] [open:false] title %}
 * body
 * {% endfolding %}
 */

'use strict'

var folding_index = 0 

module.exports = ctx => function(args, content) {
  args = ctx.args.map(args, ['color', 'child', 'open'], ['title'])
  var el = ''
  // // header
  // el += '<details class="tag-plugin folding"'
  // el += ' ' + ctx.args.joinTags(args, ['color', 'child']).join(' ')
  // if (args.open && args.open == 'true') {
  //   el += ' open'
  // }
  // el += 'id="foldering_' + ++folding_index + '"'
  // el += '>'
  // // summary
  // el += '<summary><span>' + (args.title || '') + '</span></summary>'
  // // content
  // el += '<div class="body">'
  // el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  // el += '</div></details>'
  
  // header
  el += '<div class="tag-plugin folding"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'child']).join(' ')
  el += 'id="foldering_' + ++folding_index + '"'
  el += '>'
  // summary
  el += '<details' + ((args.open && args.open == 'true') ? ' open' : '') + '><summary><span>' + (args.title || '') + '</span></summary></details>'
  // content
  el += '<div class="body">'
  el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  el += '</div></div>'

  return el
}
