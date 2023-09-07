console.log('\n' + '%c Stellar v' + stellar.version + ' %c\n' + stellar.github + '\n', 'color:#e8fafe;background:#03c7fa;padding:8px;border-radius:4px', 'margin-top:8px');

// utils
const util = {

  // https://github.com/jerryc127/hexo-theme-butterfly
  diffDate: (d, more = false) => {
    const dateNow = new Date()
    const datePost = new Date(d)
    const dateDiff = dateNow.getTime() - datePost.getTime()
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30

    let result
    if (more) {
      const monthCount = dateDiff / month
      const dayCount = dateDiff / day
      const hourCount = dateDiff / hour
      const minuteCount = dateDiff / minute

      if (monthCount > 12) {
        result = null
      } else if (monthCount >= 1) {
        result = parseInt(monthCount) + ' ' + stellar.config.date_suffix.month
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + ' ' + stellar.config.date_suffix.day
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + ' ' + stellar.config.date_suffix.hour
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + ' ' + stellar.config.date_suffix.min
      } else {
        result = stellar.config.date_suffix.just
      }
    } else {
      result = parseInt(dateDiff / day)
    }
    return result
  },

  copy: (id, msg) => {
    const el = document.getElementById(id);
    if (el) {
      el.select();
      document.execCommand("Copy");
      if (msg && msg.length > 0) {
        hud.toast(msg);
      }
    }
  },

  toggle: (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle("display");
    }
  },

  browser: {
    // 判断浏览器版本
    browserVersion: () => {
      var version = null;
      var userAgent = navigator.userAgent;
      if (/MSIE (\d+\.\d+);/.test(userAgent)) { // 匹配IE浏览器
        version = parseFloat(RegExp.$1);
      } else if (/Firefox\/([\d.]+)/.test(userAgent)) { // 匹配Firefox浏览器
        version = parseFloat(RegExp.$1);
      } else if (/Chrome\/([\d.]+)/.test(userAgent)) { // 匹配Chrome浏览器
        version = parseFloat(RegExp.$1);
      } else if (/Version\/([\d.]+).*Safari/.test(userAgent)) { // 匹配Safari浏览器
        version = parseFloat(RegExp.$1);
      } else if (/Opera\/([\d.]+)/.test(userAgent)) { // 匹配Opera浏览器
        version = parseFloat(RegExp.$1);
      }
      
      return version;
    },

    // 判断浏览器内核
    browserEngine: () => {
      var engine = null;
      var userAgent = navigator.userAgent;
      if (/Trident\/([\d.]+)/.test(userAgent)) { // 匹配Trident内核（IE浏览器）
        engine = 'Trident';
      } else if (/Gecko\/([\d.]+)/.test(userAgent)) { // 匹配Gecko内核（Firefox浏览器）
        engine = 'Gecko';
      } else if (/AppleWebKit\/([\d.]+)/.test(userAgent)) { // 匹配Webkit内核（Chrome、Safari浏览器）
        engine = 'Webkit';
      } else if (/Presto\/([\d.]+)/.test(userAgent)) { // 匹配Presto内核（Opera浏览器）
        engine = 'Presto';
      }
      
      return engine;
    }
  },

}

const hud = {
  toast: (msg, duration) => {
    duration = isNaN(duration) ? 2000 : duration;
    var el = document.createElement('div');
    el.classList.add('toast');
    el.innerHTML = msg;
    document.body.appendChild(el);
    setTimeout(function () {
      var d = 0.5;
      el.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      el.style.opacity = '0';
      setTimeout(function () { document.body.removeChild(el) }, d * 1000);
    }, duration);
  },

}

// defines

const l_body = document.querySelector('.l_body');
const browserEngine = util.browser.browserEngine();

const sidebar = {
  toggle: () => {
    if (l_body) {
      l_body.classList.add('mobile');
      l_body.classList.toggle("sidebar");
    }
  }
}

function markNodePos(node){
  if (browserEngine === 'Gecko') {
    // 针对firefox中的图表在folders、folding中的渲染宽高问题
    document.querySelectorAll('.folders').forEach(folders=>{
      folders.querySelectorAll(node).forEach(m => {
        mPos = m.getAttribute('pos');
        if (!mPos || !folders.querySelector('#' + mPos)) {
          if (mPos) {
            if (m.classList.contains('intab')) {
              m.classList.remove('intab');
            } else if (m.classList.contains('infolding')) {
              m.classList.remove('infolding');
            }
          }
          if (!m.classList.contains('infolder')) m.classList.add('infolder');
          if (mPos) m.classList.remove(mPos);
          m.classList.add(folders.id);
          m.setAttribute('pos', folders.id);
        }
      });
    });
    document.querySelectorAll('.folding').forEach(folding=>{
      folding.querySelectorAll(node).forEach(m => {
        mPos = m.getAttribute('pos');
        if (!mPos || !folders.querySelector('#' + mPos)) {
          if (mPos) {
            if (m.classList.contains('intab')) {
              m.classList.remove('intab');
            } else if (m.classList.contains('infolder')) {
              m.classList.remove('infolder');
            }
          }
          if (!m.classList.contains('infolding')) m.classList.add('infolding');
          if (mPos) m.classList.remove(mPos);
          m.classList.add(folding.id);
          m.setAttribute('pos', folding.id);
        }  
      });
    });
  }
  // 对tabs下的dia进行标记，用以区分
  document.querySelectorAll('.tabs').forEach(tabs=>{
    var mNodes = tabs.querySelectorAll(node);
    mNodes.forEach(m => {
      mPos = m.getAttribute('pos');
      if (!mPos || !tabs.querySelector('#' + mPos)) {
        // firefox浏览器兼容
        if (browserEngine === 'Gecko' && mPos) {
          if (m.classList.contains('infolder')) {
            m.classList.remove('infolder');
          } else if (m.classList.contains('infolding')) {
            m.classList.remove('infolding');
          }
        }
        if (!m.classList.contains('intab')) m.classList.add('intab');
        if (mPos) m.classList.remove(mPos);
        m.classList.add(tabs.id);
        m.setAttribute('pos', tabs.id);
      }
    });
  });
}

function diagramRenderMark(dia, contain) {
  // 对默认显示的tab下面的mermaid进行标记，用以初始化渲染
  contain.querySelectorAll('.tab-pane').forEach(tabPane => {
    if (tabPane.classList.contains('active')) {
      // 将初始显示的tab下的所有mermaid标记为drew,，以便后续渲染
      tabPane.querySelectorAll( dia + '.' + tabPane.parentNode.parentNode.id).forEach(m => {
        if (dia === '.echarts') {
          m.classList.add('active');
        }
        if (dia !== '.echarts' || contain !== document) m.classList.add('wait-drew');
      });
    } else {
      // 针对tab循环嵌套的情形 将所有在非active的tab下的由于嵌套的tabs（firefox时的folding）导致错误的mermaid drew去掉
      tabPane.querySelectorAll(dia + '.wait-drew').forEach(m => {
        if (dia === '.echarts') {
          m.classList.remove('active');
        }
        if (dia !== '.echarts' || contain !== document) m.classList.remove('wait-drew');
      });
    }
  });

  if (browserEngine === 'Gecko') {
    // 对默认显示的folders下面的dia进行标记，用以初始化渲染
    contain.querySelectorAll('.folders').forEach(folders => {
      folders.querySelectorAll(dia + '.wait-drew').forEach(m => {
        if (dia === '.echarts') {
          m.classList.remove('active');
        }
        if (dia !== '.echarts' || contain !== document) m.classList.remove('wait-drew');
      });
    });

    // 对默认显示的folding下面的dia进行标记，用以初始化渲染
    contain.querySelectorAll('.folding').forEach(folding => {
      if (folding.open) {
        // 将初始显示的folding下的所有dia标记为drew,，以便后续渲染
        folding.querySelectorAll( dia + '.' + folding.id).forEach(m => {
          if (dia === '.echarts') {
            m.classList.add('active');
          }
          if (dia !== '.echarts' || contain !== document) m.classList.add('wait-drew');
        });
      } else {
        // 针对folding循环嵌套的情形 将所有在非open的folding下的由于嵌套的tabs（firefox时的folding）导致错误的dia drew去掉
        folding.querySelectorAll(dia + '.wait-drew').forEach(m => {
          if (dia === '.echarts') {
            m.classList.remove('active');
          }
          if (dia !== '.echarts' || contain !== document) m.classList.remove('wait-drew');
        });
      }
    });
  }
}

const init = {
  toc: () => {
    stellar.jQuery(() => {
      const scrollOffset = 32;
      var segs = [];
      $("article.md-text :header").each(function (idx, node) {
        segs.push(node)
      });
      // 定位到激活的目录树（不如pjax体验好）
      // const widgets = document.querySelector('.widgets')
      // const e1 = document.querySelector('.doc-tree-link.active')
      // const offsetTop = e1.getBoundingClientRect().top - widgets.getBoundingClientRect().top - 100
      // if (offsetTop > 0) {
      //   widgets.scrollBy({top: offsetTop, behavior: 'smooth'})
      // }
      // 滚动
      $(document, window).scroll(function (e) {
        var scrollTop = $(this).scrollTop();
        var topSeg = null
        for (var idx in segs) {
          var seg = $(segs[idx])
          if (seg.offset().top > scrollTop + scrollOffset) {
            continue
          }
          if (!topSeg) {
            topSeg = seg
          } else if (seg.offset().top >= topSeg.offset().top) {
            topSeg = seg
          }
        }
        if (topSeg) {
          $("#data-toc a.toc-link").removeClass("active")
          var link = "#" + topSeg.attr("id")
          if (link != '#undefined') {
            const highlightItem = $('#data-toc a.toc-link[href="' + encodeURI(link) + '"]')
            if (highlightItem.length > 0) {
              highlightItem.addClass("active")
              const e0 = document.querySelector('.widgets')
              const e1 = document.querySelector('#data-toc a.toc-link[href="' + encodeURI(link) + '"]')
              const offsetBottom = e1.getBoundingClientRect().bottom - e0.getBoundingClientRect().bottom + 100
              const offsetTop = e1.getBoundingClientRect().top - e0.getBoundingClientRect().top - 64
              if (offsetTop < 0) {
                e0.scrollBy(0, offsetTop)
              } else if (offsetBottom > 0) {
                e0.scrollBy(0, offsetBottom)
              }
            }
          } else {
            $('#data-toc a.toc-link:first').addClass("active")
          }
        }
      })
    })
  },
  sidebar: () => {
    stellar.jQuery(() => {
      $("#data-toc a.toc-link").click(function (e) {
        l_body.classList.remove("sidebar");
      });
    })
  },
  relativeDate: (selector) => {
    selector.forEach(item => {
      const $this = item
      const timeVal = $this.getAttribute('datetime')
      let relativeValue = util.diffDate(timeVal, true)
      if (relativeValue) {
        $this.innerText = relativeValue
      }
    })
  },
  firefoxConfig: () => {
    if (browserEngine === 'Gecko') {
    
      document.querySelectorAll('.folder').forEach(node => {
        node.addEventListener("toggle", (event) => {
          if (node.open) {
            /* 元素切换至打开状态 */
            if (stellar.plugins.mermaid && window.mermaid) {
              var mNode = node.querySelector('.mermaid.' + node.parentNode.id);
              mNode && !mNode.classList.contains('drew') && node.querySelectorAll('.mermaid.' + node.parentNode.id).forEach(m => {
                m.classList.add('wait-drew');
              });
              diagramRenderMark('.mermaid', node);
              var waitDrewNodes = node.querySelectorAll('.mermaid.wait-drew');
              mermaid.run({
                suppressErrors: true,
                nodes: waitDrewNodes,
              });
              waitDrewNodes.forEach(m => {
                m.classList.remove('wait-drew');
                m.classList.add('drew');
              });
            }
            if (stellar.plugins.echarts && window.echarts) {
              var eNode = node.querySelector('.echarts.' + node.parentNode.id);
              eNode && !eNode.classList.contains('drew') && node.querySelectorAll('.echarts.' + node.parentNode.id).forEach(e => {
                e.classList.add('wait-drew');
              });
              eNode && node.querySelectorAll('.echarts.' + node.parentNode.id).forEach(e => {
                e.classList.add('active');
              });
              diagramRenderMark('.echarts', node);
              var waitDrewNodes = node.querySelectorAll('.echarts.wait-drew');
              for (var i = 0; i < waitDrewNodes.length; ++i) {
                echarts.getInstanceByDom(waitDrewNodes[i]).resize();
                waitDrewNodes[i].classList.add('drew');
                waitDrewNodes[i].classList.remove('wait-drew');
              }
            }
          } else {
            /* 元素切换至关闭状态 */
            if (stellar.plugins.echarts && window.echarts) {
              node.querySelectorAll('.echarts.active').forEach(e=>{
                e.classList.remove('active');
              });
            }
          }
        });
      });
      document.querySelectorAll('.folding').forEach(node => {
        node.addEventListener("toggle", (event) => {
          if (node.open) {
            /* 元素切换至打开状态 */
            if (stellar.plugins.mermaid && window.mermaid) {
              var mNode = node.querySelector('.mermaid.' + node.id);
              mNode && !mNode.classList.contains('drew') && node.querySelectorAll('.mermaid.' + node.id).forEach(m => {
                m.classList.add('wait-drew');
              });
              diagramRenderMark('.mermaid', node);
              var waitDrewNodes = node.querySelectorAll('.mermaid.wait-drew');
              mermaid.run({
                suppressErrors: true,
                nodes: waitDrewNodes,
              });
              waitDrewNodes.forEach(m => {
                m.classList.remove('wait-drew');
                m.classList.add('drew');
              });
            }
            if (stellar.plugins.echarts && window.echarts) {
              var eNode = node.querySelector('.echarts.' + node.id);
              eNode && !eNode.classList.contains('drew') && node.querySelectorAll('.echarts.' + node.id).forEach(e => {
                e.classList.add('wait-drew');
              });
              eNode && node.querySelectorAll('.echarts.' + node.id).forEach(e => {
                e.classList.add('active');
              });
              diagramRenderMark('.echarts', node);
              var waitDrewNodes = node.querySelectorAll('.echarts.wait-drew');
              for (var i = 0; i < waitDrewNodes.length; ++i) {
                echarts.getInstanceByDom(waitDrewNodes[i]).resize();
                waitDrewNodes[i].classList.add('drew');
                waitDrewNodes[i].classList.remove('wait-drew');
              }
            }
          } else {
            /* 元素切换至关闭状态 */
            if (stellar.plugins.echarts && window.echarts) {
              node.querySelectorAll('.echarts.active').forEach(e=>{
                e.classList.remove('active');
              });
            }
          }
        });
      });
    }
  },
  /**
   * Tabs tag listener (without twitter bootstrap).
   */
  registerTabsTag: function () {
    // Binding `nav-tabs` & `tab-content` by real time permalink changing.
    document.querySelectorAll('.tabs .nav-tabs .tab').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        // Prevent selected tab to select again.
        if (element.classList.contains('active')) return;
        // Add & Remove active class on `nav-tabs` & `tab-content`.
        [...element.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === element);
        });
        // https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
        const tActive = document.getElementById(element.querySelector('a').getAttribute('href').replace('#', ''));
        const tabsId = tActive.parentNode.parentNode.id;
        [...tActive.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === tActive);
          if (stellar.plugins.echarts) {
            target.querySelectorAll('.echarts.' + tabsId).forEach(e=>{
              e.classList.toggle('active', target === tActive);
            });
          }
        });
        // 自定义
        if (stellar.plugins.copycode) {
          // 修复tab里面display:none时因获取不到宽度而导致位置错误的COPY按钮
          var copybtnNode = tActive.querySelector('.copy-btn');
          if (copybtnNode && !copybtnNode.classList.contains('drew')) {
            const codeElementArr = tActive.querySelectorAll('.code');
            codeElementArr.forEach(code => {
              const codeBeforeWidth = window.getComputedStyle(code, '::before').width.split('px')[0];
              const codeBeforePadding = window.getComputedStyle(code, '::before').padding.split(' ').pop().split('px')[0];
              var codeCopyBtn = code.querySelector('.copy-btn');
              codeCopyBtn.style.right = Number(codeBeforeWidth) + Number(codeBeforePadding) * 2 + 'px';
              codeCopyBtn.classList.add('drew');
            });
          }
        }
        if (stellar.plugins.mermaid && window.mermaid) {
          // 修复tab里面display:none时因获取不到宽度而导致宽度错误的mermaid图表，并且只会绘制一次
          var mermaidFirstNode = tActive.querySelector('.mermaid.' + tabsId);
          mermaidFirstNode && !mermaidFirstNode.classList.contains('drew') && tActive.querySelectorAll('.mermaid.' + tabsId).forEach(m => {
            m.classList.add('wait-drew');
          }); 
          diagramRenderMark('.mermaid', tActive);
          var waitDrewNodes = tActive.querySelectorAll('.mermaid.wait-drew');
          mermaid.run({
            suppressErrors: true,
            nodes: waitDrewNodes,
          });
          waitDrewNodes.forEach(m => {
            m.classList.remove('wait-drew');
            m.classList.add('drew');
          });
        }
        if (stellar.plugins.echarts && window.echarts) {
          var eNode = tActive.querySelector('.echarts.' + tabsId);
          eNode && !eNode.classList.contains('drew') && tActive.querySelectorAll('.echarts.' + tabsId).forEach(e => {
            e.classList.add('wait-drew');
          });
          diagramRenderMark('.echarts', tActive);
          var drewNodes = tActive.querySelectorAll('.echarts.wait-drew');
          for (var i = 0; i < drewNodes.length; ++i) {
            echarts.getInstanceByDom(drewNodes[i]).resize();
            drewNodes[i].classList.add('drew');
            drewNodes[i].classList.remove('wait-drew');
          }
        }
        // Trigger event
        tActive.dispatchEvent(new Event('tabs:click', {
          bubbles: true
        }));
      });
    });

    window.dispatchEvent(new Event('tabs:register'));
  },
  
}


// init
init.toc()
init.sidebar()
init.relativeDate(document.querySelectorAll('#post-meta time'))
init.firefoxConfig()
init.registerTabsTag()


// mermaid
if (stellar.plugins.mermaid && window.mermaid) {
  // 对tabs下的mermaid进行标记，用以区分
  markNodePos('.mermaid');

  // 对默认显示的tab下面的mermaid进行标记，用以初始化渲染
  diagramRenderMark('.mermaid', document);

  // 初始化渲染
  var firstRender = [];
  var merNodes = document.querySelectorAll('.mermaid');
  for (var i = 0; i < merNodes.length; ++i) {
    // 修改文本内容，主要是mermaid标签中含有<会报错，对'\n'处理是为了与其他标签的处理保持一致，但是不导致报错的后处理
    var mCode = merNodes[i].innerHTML;
    // merNodes[i].innerHTML = mCode.replaceAll('&#60;', '<').split('&#13;').join('\n');
    merNodes[i].innerHTML = mCode.split('&#13;').join('\n');
    if (browserEngine === 'Gecko' && (merNodes[i].classList.contains('infolder') || merNodes[i].classList.contains('infolding'))) {
      // 火狐浏览器
      // 修复 folder、folding下的mermaid宽度高度问题
      continue;
    }
    if (!merNodes[i].classList.contains('intab') || merNodes[i].classList.contains('wait-drew')) {
      firstRender.push(merNodes[i]);
      if (merNodes[i].classList.contains('wait-drew')) {
        merNodes[i].classList.remove('wait-drew');
        merNodes[i].classList.add('drew');
      }
    }
  }
  mermaid.run({
    suppressErrors: true,
    nodes: firstRender,
  });
}

if (stellar.plugins.echarts && window.echarts) {

  // 对tabs下的echarts进行标记，用以区分
  markNodePos('.echarts');
  // 对默认显示的tab下面的echarts进行标记，用以初始化渲染
  diagramRenderMark('.echarts', document);
  // 监听窗口大小变化，重绘echarts
  window.addEventListener("resize", function () {
    var echartsNodes = document.querySelectorAll('.echarts');
    for (var i = 0; i < echartsNodes.length; ++i) {
      if (browserEngine === 'Gecko' && (echartsNodes[i].classList.contains('infolder') || echartsNodes[i].classList.contains('infolding'))) {
        // 火狐浏览器
        // 修复 folder、folding下的mermaid宽度高度问题
        if (echartsNodes[i].classList.contains('active')) {
          echarts.getInstanceByDom(echartsNodes[i]).resize();
        } else {
          echartsNodes[i].classList.remove('drew');
        }
      }
      if (!echartsNodes[i].classList.contains('intab') || echartsNodes[i].classList.contains('active')) {
        echarts.getInstanceByDom(echartsNodes[i]).resize();
      } else if (echartsNodes[i].classList.contains('intab') && !echartsNodes[i].classList.contains('active')) {
        echartsNodes[i].classList.remove('drew');
      }
    }
  });
}

// scrollreveal
if (stellar.plugins.scrollreveal) {
  stellar.loadScript(stellar.plugins.scrollreveal.js).then(function () {
    ScrollReveal().reveal("body .reveal", {
      distance: stellar.plugins.scrollreveal.distance,
      duration: stellar.plugins.scrollreveal.duration,
      interval: stellar.plugins.scrollreveal.interval,
      scale: stellar.plugins.scrollreveal.scale,
      easing: "ease-out"
    });
  })
}

// lazyload
if (stellar.plugins.lazyload) {
  stellar.loadScript(stellar.plugins.lazyload.js, { defer: true })
  // https://www.npmjs.com/package/vanilla-lazyload
  // Set the options globally
  // to make LazyLoad self-initialize
  window.lazyLoadOptions = {
    elements_selector: ".lazy",
  };
  // Listen to the initialization event
  // and get the instance of LazyLoad
  window.addEventListener(
    "LazyLoad::Initialized",
    function (event) {
      window.lazyLoadInstance = event.detail.instance;
    },
    false
  );
  document.addEventListener('DOMContentLoaded', function () {
    window.lazyLoadInstance?.update();
  });
}

// stellar js
if (stellar.plugins.stellar) {
  for (let key of Object.keys(stellar.plugins.stellar)) {
    let js = stellar.plugins.stellar[key];
    if (key == 'linkcard') {
      stellar.loadScript(js, { defer: true }).then(function () {
        setCardLink(document.querySelectorAll('a.link-card[cardlink]'));
      });
    } else {
      const els = document.getElementsByClassName('stellar-' + key + '-api');
      if (els != undefined && els.length > 0) {
        stellar.jQuery(() => {
          stellar.loadScript(js, { defer: true });
          if (key == 'timeline') {
            stellar.loadScript(stellar.plugins.marked);
          }
        })
      }
    }
  }
}

// swiper
if (stellar.plugins.swiper) {
  const swiper_api = document.getElementById('swiper-api');
  if (swiper_api != undefined) {
    stellar.loadCSS(stellar.plugins.swiper.css);
    stellar.loadScript(stellar.plugins.swiper.js, { defer: true }).then(function () {
      const effect = swiper_api.getAttribute('effect') || '';
      var swiper = new Swiper('.swiper#swiper-api', {
        slidesPerView: 'auto',
        spaceBetween: 8,
        centeredSlides: true,
        effect: effect,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    })
  }
}

// preload
if (stellar.plugins.preload) {
  if (stellar.plugins.preload.service == 'instant_page') {
    stellar.loadScript(stellar.plugins.preload.instant_page, {
      defer: true,
      type: 'module',
      integrity: 'sha384-OeDn4XE77tdHo8pGtE1apMPmAipjoxUQ++eeJa6EtJCfHlvijigWiJpD7VDPWXV1'
    })
  } else if (stellar.plugins.preload.service == 'flying_pages') {
    window.FPConfig = {
      delay: 0,
      ignoreKeywords: [],
      maxRPS: 5,
      hoverDelay: 25
    };
    stellar.loadScript(stellar.plugins.preload.flying_pages, { defer: true })
  }
}

// fancybox
if (stellar.plugins.fancybox) {
  let selector = 'img[fancybox]:not(.error)';
  if (stellar.plugins.fancybox.selector) {
    selector += `, ${stellar.plugins.fancybox.selector}`
  }
  if (document.querySelectorAll(selector).length !== 0) {
    stellar.loadCSS(stellar.plugins.fancybox.css);
    stellar.loadScript(stellar.plugins.fancybox.js, { defer: true }).then(function () {
      Fancybox.bind(selector, {
        groupAll: true,
        hideScrollbar: false,
        Thumbs: {
          autoStart: false,
        },
        caption: function (fancybox, carousel, slide) {
          return slide.$trigger.alt || null
        }
      });
    })
  }
}


if (stellar.search.service) {
  if (stellar.search.service == 'local_search') {
    stellar.jQuery(() => {
      stellar.loadScript('/js/search/local-search.js', { defer: true }).then(function () {
        var $inputArea = $("input#search-input");
        if ($inputArea.length == 0) {
          return;
        }
        var $resultArea = document.querySelector("div#search-result");
        $inputArea.focus(function() {
          var path = stellar.search[stellar.search.service]?.path || '/search.json';
          if (path.startsWith('/')) {
            path = path.substring(1);
          }
          path = stellar.config.root + path;
          const filter = $inputArea.attr('data-filter') || '';
          searchFunc(path, filter, 'search-input', 'search-result');
        });
        $inputArea.keydown(function(e) {
          if (e.which == 13) {
            e.preventDefault();
          }
        });
        var observer = new MutationObserver(function(mutationsList, observer) {
          if (mutationsList.length == 1) {
            if (mutationsList[0].addedNodes.length) {
              $('.search-wrapper').removeClass('noresult');
            } else if (mutationsList[0].removedNodes.length) {
              $('.search-wrapper').addClass('noresult');
            }
          }
        });
        observer.observe($resultArea, { childList: true });
      });
    })
  }
}


// heti
if (stellar.plugins.heti) {
  stellar.loadCSS(stellar.plugins.heti.css);
  stellar.loadScript(stellar.plugins.heti.js, { defer: true }).then(function () {
    const heti = new Heti('.heti');
    
    // Copied from heti.autoSpacing() without DOMContentLoaded.
    // https://github.com/sivan/heti/blob/eadee6a3b748b3b7924a9e7d5b395d4bce479c9a/js/heti-addon.js
    //
    // We managed to minimize the code modification to ensure .autoSpacing()
    // is synced with upstream; therefore, we use `.bind()` to emulate the 
    // behavior of .autoSpacing() so we can even modify almost no code.
    void (function () {
      const $$rootList = document.querySelectorAll(this.rootSelector)

      for (let $$root of $$rootList) {
        this.spacingElement($$root)
      }
    }).bind(heti)();

    stellar.plugins.heti.enable = false;
  });
}

if (stellar.plugins.copycode) {
  stellar.loadScript(stellar.plugins.copycode.js, { defer: true })
}