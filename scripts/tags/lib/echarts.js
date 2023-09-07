/**
 * echarts.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% echarts [height:300px] %}
 * body
 * {% endecharts %}
 */
'use strict';

module.exports = ctx => function(args, content) {
  if (ctx.theme.config.plugins.echarts.enable == null || !ctx.theme.config.plugins.echarts.enable) {
    return ''
  }
  args = ctx.args.map(args, ['height'])
  var el = ''
  // content
  var id = 'echarts' + ((Math.random() * 9999) | 0)
  var h = args.height ? args.height : 300 + 'px'
  el += '<div class="echarts-box" style="height: ' + h + ';"><div id="' + id + '" class="echarts" style="width: 100%; height: 100%;" ></div></div>'
  var theme_has = ctx.theme.config.style.darkmode == 'auto' ? true : false
  var darktheme = ctx.theme.config.plugins.echarts.theme.dark
  var lighttheme = ctx.theme.config.plugins.echarts.theme.light
  el += `<script>
    var theme;
    if (${theme_has}) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? '${darktheme}' : '${lighttheme}';
    }
    var target = document.getElementById('${id}');
    var eChart${id} = echarts.init(target, theme);
    var option${id} = ${content};
    eChart${id}.setOption(option${id});
    </script>`
  // //  当窗口或者大小发生改变时执行resize，重新绘制图表
  // window.addEventListener("resize", function () {
  //   if (!target.parentNode.parentNode.classList.contains('tab-pane') || targetNode.classList.contains('active')) {
  //      eChart${id}.resize();
  //   }
  // });
  // if (target.parentNode.parentNode.classList.contains('tab-pane')) {
  //   // 此时，图表处于tabs标签中，在点击标签时需要重绘，因为display: none时无法获取宽度
  //   // 添加监听器
  //   var targetNode = target.parentNode.parentNode;//监听的元素
  //   //options：监听的属性
  //   var options = { attributes: true};
  //   //回调事件
  //   function callback(mutationsList, observer) {
  //     if (targetNode.classList.contains('active')) {
  //       eChart${id}.resize();
  //       // observer.disconnect();  // 一旦重绘就不再继续监听
  //     }
  //   }
  //   var mutationObserver = new MutationObserver(callback);
  //   mutationObserver.observe(targetNode, options);
  // }
  return el
}
