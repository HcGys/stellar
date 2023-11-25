console.log('\n' + '%c Stellar v' + stellar.GLOBAL_CONFIG.version + ' %c\n' + stellar.GLOBAL_CONFIG.github + '\n', 'color:#e8fafe;background:#03c7fa;padding:8px;border-radius:4px', 'margin-top:8px');

// variables
let messageCopyrightShow = 0;

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
        result = parseInt(monthCount) + ' ' + stellar.GLOBAL_CONFIG.config.date_suffix.month
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + ' ' + stellar.GLOBAL_CONFIG.config.date_suffix.day
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + ' ' + stellar.GLOBAL_CONFIG.config.date_suffix.hour
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + ' ' + stellar.GLOBAL_CONFIG.config.date_suffix.min
      } else {
        result = stellar.GLOBAL_CONFIG.config.date_suffix.just
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

  // 消息提示：复制
  messageCopyright: () => {
    // 消息提示 复制时弹出
    if (stellar.GLOBAL_CONFIG.plugins.message.enable
      && stellar.GLOBAL_CONFIG.plugins.message.copyright.enable
      && messageCopyrightShow < 1) {
      messageCopyrightShow++;
      hud.message(stellar.GLOBAL_CONFIG.plugins.message.copyright.title,
        stellar.GLOBAL_CONFIG.plugins.message.copyright.message, {
        icon: stellar.GLOBAL_CONFIG.plugins.message.copyright.icon,
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        displayMode: 1
      });
    }
  },

  // 工具类：复制字符串到剪切板
  utilWriteClipText: (str) => {
    return navigator.clipboard
      .writeText(str)
      .then(() => {
        return Promise.resolve()
      })
      .catch(e => {
        const input = document.createElement('textarea');
        input.setAttribute('readonly', 'readonly');
        document.body.appendChild(input);
        input.innerHTML = str;
        input.select();
        try {
          let result = document.execCommand('copy')
          document.body.removeChild(input);
          if (!result || result === 'unsuccessful') {
            return Promise.reject('复制文本失败!')
          } else {
            return Promise.resolve()
          }
        } catch (e) {
          document.body.removeChild(input);
          return Promise.reject(
            '当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作!'
          )
        }
      })
  },

  animateIn: (ele, text) => {
    ele.style.display = "block";
    ele.style.animation = text;
  },

  animateOut: (ele, text) => {
    ele.addEventListener("animationend", function f() {
      ele.style.display = "";
      ele.style.animation = "";
      ele.removeEventListener("animationend", f);
    });
    ele.style.animation = text;
  }
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
  // 消息提示：标准
  message: (title, message, option = {}, done = null) => {
    if (typeof iziToast === "undefined") {
      stellar.loadCSS(stellar.GLOBAL_CONFIG.config.cdn.izitoast_css)
      stellar.loadScript(stellar.GLOBAL_CONFIG.config.cdn.izitoast_js, () => {
        tozashMessage(title, message, option, done);
      });
    } else {
      tozashMessage(title, message, option, done);
    }
    function tozashMessage(title, message, option, done) {
      const {
        icon,
        time,
        position,
        transitionIn,
        transitionOut,
        messageColor,
        titleColor,
        backgroundColor,
        zindex,
        displayMode
      } = option;
      iziToast.show({
        layout: '2',
        icon: 'Fontawesome',
        closeOnEscape: 'true',
        displayMode: displayMode || 'replace',
        transitionIn: transitionIn || stellar.GLOBAL_CONFIG.plugins.message.transitionIn,
        transitionOut: transitionOut || stellar.GLOBAL_CONFIG.plugins.message.transitionOut,
        messageColor: messageColor || stellar.GLOBAL_CONFIG.plugins.message.messageColor,
        titleColor: titleColor || stellar.GLOBAL_CONFIG.plugins.message.titleColor,
        backgroundColor: backgroundColor || stellar.GLOBAL_CONFIG.plugins.message.backgroundColor,
        zindex: zindex || stellar.GLOBAL_CONFIG.plugins.message.zindex,
        icon: icon || stellar.GLOBAL_CONFIG.plugins.message.icon.default,
        timeout: time || stellar.GLOBAL_CONFIG.plugins.message.time.default,
        position: position || stellar.GLOBAL_CONFIG.plugins.message.position,
        title: title,
        message: message,
        // theme: stellar.dark.mode,
        onClosed: () => {
          if (done) done();
        },
      });
    }
  },

  // 消息提示：询问
  question : (title, message, option = {}, success = null, cancel = null, done = null) => {
    if (typeof iziToast === "undefined") {
      stellar.loadCSS(stellar.GLOBAL_CONFIG.config.cdn.izitoast_css)
      stellar.loadScript(stellar.GLOBAL_CONFIG.config.cdn.izitoast_js, () => {
        tozashQuestion(title, message, option, success, cancel, done);
      });
    } else {
      tozashQuestion(title, message, option, success, cancel, done);
    }

    function tozashQuestion(title, message, option, success, cancel, done) {
      const {
        icon,
        time,
        position,
        transitionIn,
        transitionOut,
        messageColor,
        titleColor,
        backgroundColor,
        zindex
      } = option;
      iziToast.question({
        id: 'question',
        icon: 'Fontawesome',
        close: false,
        overlay: true,
        displayMode: 'once',
        position: 'center',
        messageColor: messageColor || stellar.GLOBAL_CONFIG.plugins.message.messageColor,
        titleColor: titleColor || stellar.GLOBAL_CONFIG.plugins.message.titleColor,
        backgroundColor: backgroundColor || stellar.GLOBAL_CONFIG.plugins.message.backgroundColor,
        zindex: zindex || stellar.GLOBAL_CONFIG.plugins.message.zindex,
        icon: icon || stellar.GLOBAL_CONFIG.plugins.message.icon.quection,
        timeout: time || stellar.GLOBAL_CONFIG.plugins.message.time.quection,
        title: title,
        message: message,
        buttons: [
          ['<button><b>是</b></button>', (instance, toast) => {
            instance.hide({ transitionOut: transitionOut || 'fadeOut' }, toast, 'button');
            if (success) success(instance, toast)
          }],
          ['<button><b>否</b></button>', (instance, toast) => {
            instance.hide({ transitionOut: transitionOut || 'fadeOut' }, toast, 'button');
            if (cancel) cancel(instance, toast)
          }]
        ],
        onClosed: (instance, toast, closedBy) => {
          if (done) done(instance, toast, closedBy);
        }
      });
    }
  },

  // 消息提示：隐藏
  hideMessage:  (done = null) => {
    const toast = document.querySelector('.iziToast');
    if (!toast) {
      if (done) done()
      return;
    }

    if (typeof iziToast === "undefined") {
      stellar.loadCSS(stellar.GLOBAL_CONFIG.config.cdn.izitoast_css)
      stellar.loadScript(stellar.GLOBAL_CONFIG.config.cdn.izitoast_js, () => {
        hideMessage(done);
      });
    } else {
      hideMessage(done);
    }

    function hideMessage(done) {
      iziToast.hide({}, toast);
      if (done) done();
    }
  },

}


const sidebar = {
  toggle: () => {
    if (stellar.dom.l_body) {
      stellar.dom.l_body.classList.add('mobile');
      stellar.dom.l_body.classList.toggle("sidebar");
      stellar.dom.mask.style.display = stellar.dom.mask.style.display === 'none' ? 'flex' : 'none';
      stellar.dom.mask.classList.toggle('active');
    }
  }
}

const StellarApp = (() => {
  const fn = {};
  // 初始化
  fn.init = () => {
    if (stellar.dom.header) {
      scrollCorrection = stellar.dom.header.clientHeight + 16;
    }

    window.onresize = () => {
      if (document.documentElement.clientWidth < 500) {
        stellar.isMobile = 1;
      } else {
        stellar.isMobile = 0;
      }
      if (stellar.isMobile != stellar.isMobileOld) {
        fn.setGlobalHeaderMenuEvent();
        fn.setHeader();
        fn.setHeaderSearch();
      }
    }
    stellar.scroll.push(fn.scrollEventCallBack, "scrollEventCallBack")
  }
  fn.event = () => {
    stellar.dom.$(document.getElementById("scroll-down"))?.on('click', function () {
      fn.scrolltoElement(stellar.dom.bodyAnchor);
    });

    stellar.dom.$(document.getElementById("start-wrap"))?.on('click', function () {
      fn.scrolltoElement(stellar.dom.bodyAnchor);
    });

    // 如果 sidebar 为空，隐藏 sidebar。
    const sidebar = document.querySelector(".l_left")
    if (sidebar) {
      const widgetList = sidebar.querySelectorAll("widget")
      if (!widgetList.length) {
        document.querySelector(".l_main").classList.add("no_sidebar")
      }
    }

    // 消息提示 复制时弹出
    document.body.oncopy = function () {
      util.messageCopyright();
    };
  }
  fn.setSideBar = () => {
    stellar.jQuery(() => {
      $("#data-toc a.toc-link").click(function (e) {
        stellar.dom.l_body.classList.remove("sidebar");
      });
    })
  }
  fn.setRelativeDate = (selector) => {
    selector.forEach(item => {
      const $this = item
      const timeVal = $this.getAttribute('datetime')
      let relativeValue = util.diffDate(timeVal, true)
      if (relativeValue) {
        $this.innerText = relativeValue
      }
    })
  }
  // 初始化图表 针对fold folding下的图表
  fn.diaFoldConfig = () => {
    document.querySelectorAll('.folder details').forEach(node => {
      node.addEventListener("toggle", (event) => {
        if (node.open) {
          /* 元素切换至打开状态 */
          if (stellar.GLOBAL_CONFIG.plugins.mermaid && window.mermaid) {
            var mNode = node.nextSibling.querySelector('.mermaid.' + node.parentNode.parentNode.id);
            mNode && !mNode.classList.contains('drew') && node.nextSibling.querySelectorAll('.mermaid.' + node.parentNode.parentNode.id).forEach(m => {
              m.classList.add('wait-drew');
            });
            diagramRenderMark('.mermaid', node.nextSibling);
            var waitDrewNodes = node.nextSibling.querySelectorAll('.mermaid.wait-drew');
            mermaid.run({
              suppressErrors: true,
              nodes: waitDrewNodes,
            });
            waitDrewNodes.forEach(m => {
              m.classList.remove('wait-drew');
              m.classList.add('drew');
            });
          }
          if (stellar.GLOBAL_CONFIG.plugins.echarts && window.echarts) {
            var eNode = node.nextSibling.querySelector('.echarts.' + node.parentNode.parentNode.id);
            eNode && !eNode.classList.contains('drew') && node.nextSibling.querySelectorAll('.echarts.' + node.parentNode.parentNode.id).forEach(e => {
              e.classList.add('wait-drew');
            });
            eNode && node.nextSibling.querySelectorAll('.echarts.' + node.parentNode.parentNode.id).forEach(e => {
              e.classList.add('active');
            });
            diagramRenderMark('.echarts', node.nextSibling);
            var waitDrewNodes = node.nextSibling.querySelectorAll('.echarts.wait-drew');
            for (var i = 0; i < waitDrewNodes.length; ++i) {
              echarts.getInstanceByDom(waitDrewNodes[i]).resize();
              waitDrewNodes[i].classList.add('drew');
              waitDrewNodes[i].classList.remove('wait-drew');
            }
          }
        } else {
          /* 元素切换至关闭状态 */
          if (stellar.GLOBAL_CONFIG.plugins.echarts && window.echarts) {
            node.nextSibling.querySelectorAll('.echarts.active').forEach(e=>{
              e.classList.remove('active');
            });
          }
        }
      });
    });
    document.querySelectorAll('.folding details').forEach(node => {
      node.addEventListener("toggle", (event) => {
        if (node.open) {
          /* 元素切换至打开状态 */
          if (stellar.GLOBAL_CONFIG.plugins.mermaid && window.mermaid) {
            var mNode = node.nextSibling.querySelector('.mermaid.' + node.parentNode.id);
            mNode && !mNode.classList.contains('drew') && node.nextSibling.querySelectorAll('.mermaid.' + node.parentNode.id).forEach(m => {
              m.classList.add('wait-drew');
            });
            diagramRenderMark('.mermaid', node.nextSibling);
            var waitDrewNodes = node.nextSibling.querySelectorAll('.mermaid.wait-drew');
            mermaid.run({
              suppressErrors: true,
              nodes: waitDrewNodes,
            });
            waitDrewNodes.forEach(m => {
              m.classList.remove('wait-drew');
              m.classList.add('drew');
            });
          }
          if (stellar.GLOBAL_CONFIG.plugins.echarts && window.echarts) {
            var eNode = node.nextSibling.querySelector('.echarts.' + node.parentNode.id);
            eNode && !eNode.classList.contains('drew') && node.nextSibling.querySelectorAll('.echarts.' + node.parentNode.id).forEach(e => {
              e.classList.add('wait-drew');
            });
            eNode && node.nextSibling.querySelectorAll('.echarts.' + node.parentNode.id).forEach(e => {
              e.classList.add('active');
            });
            diagramRenderMark('.echarts', node.nextSibling);
            var waitDrewNodes = node.nextSibling.querySelectorAll('.echarts.wait-drew');
            for (var i = 0; i < waitDrewNodes.length; ++i) {
              echarts.getInstanceByDom(waitDrewNodes[i]).resize();
              waitDrewNodes[i].classList.add('drew');
              waitDrewNodes[i].classList.remove('wait-drew');
            }
          }
        } else {
          /* 元素切换至关闭状态 */
          if (stellar.GLOBAL_CONFIG.plugins.echarts && window.echarts) {
            node.nextSibling.querySelectorAll('.echarts.active').forEach(e=>{
              e.classList.remove('active');
            });
          }
        }
      });
    });
  }
  /**
   * Tabs tag listener (without twitter bootstrap).
   */
  fn.registerTabsTag = () => {
    // Binding `nav-tabs` & `tab-content` by real time permalink changing.
    document.querySelectorAll('.tabs .nav-tabs .tab').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        // Prevent selected tab to select again.
        if (element.classList.contains('active')) return;
        // Add & Remove active class on `nav-tabs` & `tab-content`.
        [...element.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === element);
        });
        // https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
        // const tActive = document.getElementById(element.querySelector('a').getAttribute('href').replace('#', ''));
        const tActive = document.getElementById(element.querySelector('a').classList[0].replace('#', ''));
        const tabsId = tActive.parentNode.parentNode.id;
        [...tActive.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === tActive);
          if (stellar.GLOBAL_CONFIG.plugins.echarts) {
            target.querySelectorAll('.echarts.' + tabsId).forEach(e=>{
              e.classList.toggle('active', target === tActive);
            });
          }
        });
        // 自定义
        if (stellar.GLOBAL_CONFIG.plugins.mermaid && window.mermaid) {
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
        if (stellar.GLOBAL_CONFIG.plugins.echarts && window.echarts) {
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
  }

  fn.setIsMobile = () => {
    if (document.documentElement.clientWidth < 500) {
      stellar.isMobile = 1;
      stellar.isMobileOld = 1;
    } else {
      stellar.isMobile = 0;
      stellar.isMobileOld = 0;
    }
  }

  // 设置导航栏
  fn.setHeader = () => {
    // !!! 此处的Dom对象需要重载 !!!
    if (!pdata.ispage) return;

    // 填充二级导航文章标题 【移动端 PC】
    stellar.dom.wrapper?.find('.nav-sub .title')?.html(document.title.split(" - ")[0]);

    // ====== bind events to every btn =========
    // 评论按钮 【移动端 PC】
    stellar.dom.comment = stellar.dom.$(document.getElementById("s-comment")); // 评论按钮  桌面端 移动端
    stellar.dom.commentTarget = stellar.dom.$(document.querySelector('.l_main div#comments')); // 评论区域
    if (stellar.dom.commentTarget && stellar.dom.comment) {
      stellar.dom.comment.click(e => { // 评论按钮点击后 跳转到评论区域
        e.preventDefault();
        e.stopPropagation();
        // stellar.cleanContentVisibility();
        fn.scrolltoElement(stellar.dom.commentTarget);
        e.stopImmediatePropagation();
      });
    } else {
      if (stellar.dom.comment) stellar.dom.comment.style.display = 'none'; // 关闭了评论，则隐藏评论按钮
    }

    // 移动端toc目录按钮 【移动端】
    if (stellar.isMobile) {
      stellar.dom.toc = stellar.dom.$(document.getElementById("s-toc")); // 目录按钮  仅移动端
      stellar.dom.tocTarget = stellar.dom.$(document.querySelector('.l_left .widget-wrapper.toc')); // 侧边栏的目录列表
      if (stellar.dom.tocTarget && stellar.dom.toc) {
        // 点击移动端目录按钮 激活目录按钮 显示侧边栏的目录列表
        stellar.dom.toc.click((e) => {
          e.stopPropagation();
          stellar.dom.tocTarget.toggleClass('active');
          stellar.dom.toc.toggleClass('active');
        });
        // 点击空白 隐藏
        stellar.dom.$(document).click(function (e) {
          e.stopPropagation();
          if (stellar.dom.tocTarget) {
            stellar.dom.tocTarget.removeClass('active');
          }
          stellar.dom.toc?.removeClass('active');
        });
      } else if (stellar.dom.toc) stellar.dom.toc.style.display = 'none'; // 隐藏toc目录按钮
    }
  }

  // 设置导航栏菜单选中状态  【移动端 PC】
  fn.setHeaderMenuSelection = () => {
    // !!! 此处的Dom对象需要重载 !!!
    stellar.dom.headerMenu = stellar.dom.$(document.querySelectorAll('#l_header .navigation,#l_cover .navigation,#l_side .navigation')); // 导航列表

    // 先把已经激活的取消激活
    stellar.dom.headerMenu.forEach(element => {
      let li = stellar.dom.$(element).find('li a.active')
      if (li)
        li.removeClass('active')
      let div = stellar.dom.$(element).find('div a.active')
      if (div)
        div.removeClass('active')
    });

    // replace '%' '/' '.'
    var idname = location.pathname.replace(/\/|%|\./g, '');
    if (idname.length == 0) {
      idname = 'home';
    }
    var page = idname.match(/page\d{0,}$/g);
    if (page) {
      page = page[0];
      idname = idname.split(page)[0];
    }
    var index = idname.match(/index.html/);
    if (index) {
      index = index[0];
      idname = idname.split(index)[0];
    }
    // 转义字符如 [, ], ~, #, @
    idname = idname.replace(/(\[|\]|~|#|@)/g, '\\$1');
    if (idname && stellar.dom.headerMenu) {
      stellar.dom.headerMenu.forEach(element => {
        // idname 不能为数字开头, 加一个 action- 前缀
        let id = element.querySelector("[active-action=action-" + idname + "]")
        if (id) {
          stellar.dom.$(id).addClass('active')
        }
      });
    }
  }

  // 导航栏激活设定
  fn.nextSiteMenu = () => {
    const element = document.querySelector('.widget.nextsite');
    if (element) {
      let activeItem = element.querySelector('li.menu-item-active');
      if (activeItem) {
        activeItem.removeClass('.menu-item-active');
      }
      let idname = location.pathname.replace(/\/|%|\./g, '');
      if (idname.length == 0) {
        idname = 'home';
      }
      var page = idname.match(/page\d{0,}$/g);
      if (page) {
        page = page[0];
        idname = idname.split(page)[0];
      }
      var index = idname.match(/index.html/);
      if (index) {
        index = index[0];
        idname = idname.split(index)[0];
      }
      // 转义字符如 [, ], ~, #, @
      idname = idname.replace(/(\[|\]|~|#|@)/g, '\\$1');
      let nowItem = element.querySelector("[active-action=action-" + idname + "]");
      if (nowItem?.parentElement) {
        stellar.dom.$(nowItem.parentElement).addClass('menu-item-active')
      }
    }
  }

  // 设置全局事件
  fn.setGlobalHeaderMenuEvent = () => {
    if (stellar.isMobile) {
      // 【移动端】 关闭已经展开的子菜单 点击展开子菜单
      document.querySelectorAll('#l_header .m-phone li').forEach(function (e) {
        if (e.querySelector(".list-v")) {
          // 点击菜单
          stellar.dom.$(e).click(function (e) {
            e.stopPropagation();
            // 关闭已经展开的子菜单
            e.currentTarget.parentElement.childNodes.forEach(function (e) {
              if (Object.prototype.toString.call(e) == '[object HTMLLIElement]') {
                e.childNodes.forEach(function (e) {
                  if (Object.prototype.toString.call(e) == '[object HTMLUListElement]') {
                    stellar.dom.$(e).hide()
                  }
                })
              }
            })
            // 点击展开子菜单
            let array = e.currentTarget.children
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              if (stellar.dom.$(element).title === 'menu') { // 移动端菜单栏异常
                stellar.dom.$(element).display = "flex"      // https://github.com/stellar-x/hexo-theme-stellar/issues/706
              } else {
                stellar.dom.$(element).show()
              }
            }
            // 对明亮按钮进行处理
            dark_header_icon();
          }, 0);
        }
      })
    } else {
      // 【PC端】 hover时展开子菜单，点击时[target.baseURI==origin时]隐藏子菜单? 现有逻辑大部分情况不隐藏子菜单
      document.querySelectorAll('#wrapper .m-pc li > a[href]').forEach(function (e) {
        stellar.dom.$(e.parentElement).click(function (e) {
          e.stopPropagation();
          if (e.target.origin == e.target.baseURI) {
            document.querySelectorAll('#wrapper .m-pc .list-v').forEach(function (e) {
              stellar.dom.$(e).hide(); // 大概率不会执行
            })
          }
        }, 0);
      })
    }
    fn.setPageHeaderMenuEvent();
  }

  // 【移动端】隐藏子菜单
  fn.setPageHeaderMenuEvent = () => {
    if (!stellar.isMobile) return
    // 【移动端】 点击空白处隐藏子菜单
    stellar.dom.$(document).click(function (e) {
      stellar.dom.mPhoneList.forEach(function (e) {
        stellar.dom.$(e).hide();
      })
    });
  }

  // 设置导航栏搜索框 【移动端】
  fn.setHeaderSearch = () => {
    if (!stellar.isMobile) return;
    if (!stellar.dom.switcher) return;
    // 点击移动端搜索按钮
    stellar.dom.switcher.click(function (e) {
      e.stopPropagation();
      stellar.dom.header.toggleClass('z_search-open'); // 激活移动端搜索框
      stellar.dom.switcher.toggleClass('active'); // 移动端搜索按钮
    });
    // 点击空白取消激活
    stellar.dom.$(document).click(function (e) {
      stellar.dom.header.removeClass('z_search-open');
      stellar.dom.switcher.removeClass('active');
    });
    // 移动端点击搜索框 停止事件传播
    stellar.dom.search.click(function (e) {
      e.stopPropagation();
    });
  }

  // 滚动事件回调们
  fn.scrollEventCallBack = () => {
    // 【移动端 PC】//////////////////////////////////////////////////////////////////////

    // 显示/隐藏 Header导航 topBtn 【移动端 PC】
    const showHeaderPoint = stellar.dom.bodyAnchor.offsetTop - scrollCorrection;
    const scrollTop = stellar.scroll.getScrollTop(); // 滚动条距离顶部的距离

    // topBtn
    if (stellar.dom.topBtn) {
      if (scrollTop > stellar.dom.bodyAnchor.offsetTop) {
        stellar.dom.topBtn.addClass('show');
        // 向上滚动高亮 topBtn
        if (stellar.scroll.del > 0) {
          stellar.dom.topBtn.removeClass('hl');
        } else {
          stellar.dom.topBtn.addClass('hl');
        }
      } else {
        stellar.dom.topBtn.removeClass('show').removeClass('hl');
      }
    }

    // Header导航
    if (stellar.dom.header) {
      if (scrollTop - showHeaderPoint > -1) {
        stellar.dom.header.addClass('show');
      } else {
        stellar.dom.header.removeClass('show');
      }
    }

    // 决定一二级导航栏的切换 【向上滚动切换为一级导航栏；向下滚动切换为二级导航栏】  【移动端 PC】
    if (pdata.ispage && stellar.dom.wrapper) {
      if (stellar.scroll.del > 0 && scrollTop > 100) { // 向下滚动
        stellar.dom.wrapper.addClass('sub'); // <---- 二级导航显示
      } else if (stellar.scroll.del < 0) { // 向上滚动
        stellar.dom.wrapper.removeClass('sub'); // <---- 取消二级导航显示 一级导航显示
      }
    }

    // 【移动端】//////////////////////////////////////////////////////////////////////
    if (stellar.isMobile) {
      // 【移动端】 页面滚动  隐藏 移动端toc目录按钮
      if (pdata.ispage && stellar.dom.tocTarget && stellar.dom.toc) {
        stellar.dom.tocTarget.removeClass('active');
        stellar.dom.toc.removeClass('active');
      }
      // 【移动端】 滚动时隐藏子菜单
      if (stellar.dom.mPhoneList) {
        stellar.dom.mPhoneList.forEach(function (e) {
          stellar.dom.$(e).hide();
        })
      }
    }
  }

  // 校正页面定位（被导航栏挡住的区域）
  fn.scrolltoElement = (elem, correction = scrollCorrection) => {
    stellar.scroll.to(elem, {
      top: elem.getBoundingClientRect().top + document.documentElement.scrollTop - correction
    })
  }

  // 设置滚动锚点
  fn.setScrollAnchor = () => {
    // click topBtn 滚动至bodyAnchor 【移动端 PC】
    if (stellar.dom.topBtn && stellar.dom.bodyAnchor) {
      stellar.dom.topBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        fn.scrolltoElement(stellar.dom.bodyAnchor);
        e.stopImmediatePropagation();
      });
    }

  }
  
  return {
    init_volantis_layout: () => {
      fn.init();
      fn.event();
      fn.setIsMobile();

      fn.setRelativeDate(document.querySelectorAll('#post-meta time'));
      fn.diaFoldConfig();
      fn.registerTabsTag();

      fn.setHeader();
      fn.setHeaderMenuSelection();
      fn.setGlobalHeaderMenuEvent();
      fn.setHeaderSearch();

      fn.setScrollAnchor();

      fn.nextSiteMenu();
    },
    init_default_layout: () => {

      stellar.dom.$(document.getElementById("start-wrap"))?.on('click', function () {
        stellar.scroll.to(stellar.dom.l_body, {
          top: stellar.dom.l_body.getBoundingClientRect().top + document.documentElement.scrollTop
        });
      });

      fn.setSideBar();
      fn.setRelativeDate(document.querySelectorAll('#post-meta time'));
      fn.diaFoldConfig();
      fn.registerTabsTag();
    },
    scrolltoElement: fn.scrolltoElement
  }
})()
Object.freeze(StellarApp);

// highlightKeyWords 与 搜索功能搭配 https://github.com/next-theme/hexo-theme-next/blob/eb194a7258058302baf59f02d4b80b6655338b01/source/js/third-party/search/local-search.js
// Question: 锚点稳定性未知
// ToDo: 查找模式
// 0. (/////////要知道浏览器自带全页面查找功能 CTRL + F)
// 1. 右键开启查找模式 / 导航栏菜单开启?? / CTRL + F ???
// 2. 查找模式面板 (可拖动? or 固定?)
// 3. keyword mark id 从 0 开始编号 查找下一处 highlightKeyWords.scrollToNextHighlightKeywordMark() 查找上一处 scrollToPrevHighlightKeywordMark() 循环查找(取模%)
// 4. 可输入修改 查找关键词 keywords(type:list)
// 5. 区分大小写 caseSensitive (/ 全字匹配?? / 正则匹配??)
// 6. 在选定区域中查找 querySelector ??
// 7. 关闭查找模式
// 8. 搜索跳转 (URL 入口) 自动开启查找模式 调用 scrollToNextHighlightKeywordMark()
const highlightKeyWords = (() => {
  let fn = {}
  fn.markNum = 0
  fn.markNextId = -1
  fn.startFromURL = () => {
    const params = decodeURI(new URL(location.href).searchParams.get('keyword'));
    const keywords = params ? params.split(' ') : [];
    const post = document.querySelector('.l_main');
    if (keywords.length == 1 && keywords[0] == "null") {
      return;
    }
    fn.start(keywords, post); // 渲染耗时较长
    fn.scrollToFirstHighlightKeywordMark()
  }
  fn.scrollToFirstHighlightKeywordMark = () => {
    // volantis.cleanContentVisibility();
    let target = fn.scrollToNextHighlightKeywordMark("0");
    if (!target) {
      stellar.requestAnimationFrame(fn.scrollToFirstHighlightKeywordMark)
    }
  }
  fn.scrollToNextHighlightKeywordMark = (id) => {
    // Next Id
    let input = id || (fn.markNextId + 1) % fn.markNum;
    fn.markNextId = parseInt(input)
    let target = document.getElementById("keyword-mark-" + fn.markNextId);
    if (!target) {
      fn.markNextId = (fn.markNextId + 1) % fn.markNum;
      target = document.getElementById("keyword-mark-" + fn.markNextId);
    }
    if (target) {
      let tempHeight = stellar.dom.header ? stellar.dom.header.offsetHeight : 0;
      stellar.scroll.to(target, { addTop: - tempHeight - 10, behavior: 'instant' })
    }
    // Current target
    return target
  }
  fn.scrollToPrevHighlightKeywordMark = (id) => {
    // Prev Id
    let input = id || (fn.markNextId - 1 + fn.markNum) % fn.markNum;
    fn.markNextId = parseInt(input)
    let target = document.getElementById("keyword-mark-" + fn.markNextId);
    if (!target) {
      fn.markNextId = (fn.markNextId - 1 + fn.markNum) % fn.markNum;
      target = document.getElementById("keyword-mark-" + fn.markNextId);
    }
    if (target) {
      let tempHeight = stellar.dom.header ? stellar.dom.header.offsetHeight : 0;
      stellar.scroll.to(target, { addTop: - tempHeight - 5, behavior: 'instant' })
    }
    // Current target
    return target
  }
  fn.start = (keywords, querySelector) => {
    fn.markNum = 0
    if (!keywords.length || !querySelector || (keywords.length == 1 && keywords[0] == "null")) return;
    console.log(keywords);
    const walk = document.createTreeWalker(querySelector, NodeFilter.SHOW_TEXT, null);
    const allNodes = [];
    while (walk.nextNode()) {
      if (!walk.currentNode.parentNode.matches('button, select, textarea')) allNodes.push(walk.currentNode);
    }
    allNodes.forEach(node => {
      const [indexOfNode] = fn.getIndexByWord(keywords, node.nodeValue);
      if (!indexOfNode.length) return;
      const slice = fn.mergeIntoSlice(0, node.nodeValue.length, indexOfNode);
      fn.highlightText(node, slice, 'keyword');
      fn.highlightStyle()
    });
  }
  fn.getIndexByWord = (words, text, caseSensitive = false) => {
    const index = [];
    const included = new Set();
    words.forEach(word => {
      const div = document.createElement('div');
      div.innerText = word;
      word = div.innerHTML;

      const wordLen = word.length;
      if (wordLen === 0) return;
      let startPosition = 0;
      let position = -1;
      if (!caseSensitive) {
        text = text.toLowerCase();
        word = word.toLowerCase();
      }
      while ((position = text.indexOf(word, startPosition)) > -1) {
        index.push({ position, word });
        included.add(word);
        startPosition = position + wordLen;
      }
    });
    index.sort((left, right) => {
      if (left.position !== right.position) {
        return left.position - right.position;
      }
      return right.word.length - left.word.length;
    });
    return [index, included];
  };
  fn.mergeIntoSlice = (start, end, index) => {
    let item = index[0];
    let { position, word } = item;
    const hits = [];
    const count = new Set();
    while (position + word.length <= end && index.length !== 0) {
      count.add(word);
      hits.push({
        position,
        length: word.length
      });
      const wordEnd = position + word.length;

      index.shift();
      while (index.length !== 0) {
        item = index[0];
        position = item.position;
        word = item.word;
        if (wordEnd > position) {
          index.shift();
        } else {
          break;
        }
      }
    }
    return {
      hits,
      start,
      end,
      count: count.size
    };
  };
  fn.highlightText = (node, slice, className) => {
    const val = node.nodeValue;
    let index = slice.start;
    const children = [];
    for (const { position, length } of slice.hits) {
      const text = document.createTextNode(val.substring(index, position));
      index = position + length;
      let mark = document.createElement('mark');
      mark.className = className;
      mark = fn.highlightStyle(mark)
      mark.appendChild(document.createTextNode(val.substr(position, length)));
      children.push(text, mark);
    }
    node.nodeValue = val.substring(index, slice.end);
    children.forEach(element => {
      node.parentNode.insertBefore(element, node);
    });
  }
  fn.highlightStyle = (mark) => {
    if (!mark) return;
    mark.id = "keyword-mark-" + fn.markNum;
    fn.markNum++;
    mark.style.background = "#ff0";
    mark.style["border-bottom"] = "1px dashed #ff2a2a";
    mark.style["color"] = "#ff2a2a";
    mark.style["font-weight"] = "bold";
    return mark
  }
  fn.cleanHighlightStyle = () => {
    document.querySelectorAll(".keyword").forEach(mark => {
      mark.style.background = "transparent";
      mark.style["border-bottom"] = null;
      mark.style["color"] = null;
      mark.style["font-weight"] = null;
    })
  }
  return {
    start: (keywords, querySelector) => {
      fn.start(keywords, querySelector)
    },
    startFromURL: () => {
      fn.startFromURL()
    },
    scrollToNextHighlightKeywordMark: (id) => {
      fn.scrollToNextHighlightKeywordMark(id)
    },
    scrollToPrevHighlightKeywordMark: (id) => {
      fn.scrollToPrevHighlightKeywordMark(id)
    },
    cleanHighlightStyle: () => {
      fn.cleanHighlightStyle()
    },
  }
})()
Object.freeze(highlightKeyWords);

/* DOM 控制 */ 
const DOMController = {
  /**
   * 控制元素显隐
   */
  visible: (ele, type = true) => {
    if (ele) ele.style.display = type === true ? 'block' : 'none';
  },

  /**
   * 移除元素
   */
  remove: (param) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.remove();
    })
  },

  removeList: (list) => {
    list.forEach(param => {
      DOMController.remove(param)
    })
  },

  /**
   * 设置属性
   */
  setAttribute: (param, attrName, attrValue) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.setAttribute(attrName, attrValue)
    })
  },

  setAttributeList: (list) => {
    list.forEach(item => {
      DOMController.setAttribute(item[0], item[1], item[2])
    })
  },

  /**
   * 设置样式
   */
  setStyle: (param, styleName, styleValue) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.style[styleName] = styleValue;
    })
  },

  setStyleList: (list) => {
    list.forEach(item => {
      DOMController.setStyle(item[0], item[1], item[2])
    })
  },

  fadeIn: (e) => {
    if (!e) return;
    e.style.visibility = "visible";
    e.style.opacity = 1;
    e.style.display = "block";
    e.style.transition = "all 0.5s linear";
    return e
  },

  fadeOut: (e) => {
    if (!e) return;
    e.style.visibility = "hidden";
    e.style.opacity = 0;
    e.style.display = "none";
    e.style.transition = "all 0.5s linear";
    return e
  },

  fadeToggle: (e) => {
    if (!e) return;
    if (e.style.visibility == "hidden") {
      e = DOMController.fadeIn(e)
    } else {
      e = DOMController.fadeOut(e)
    }
    return e
  },

  fadeToggleList: (list) => {
    list.forEach(param => {
      DOMController.fadeToggle(param)
    })
  },

  hasClass: (e, c) => {
    if (!e) return;
    return e.className.match(new RegExp('(\\s|^)' + c + '(\\s|$)'));
  },

  addClass: (e, c) => {
    if (!e) return;
    e.classList.add(c);
    return e
  },

  removeClass: (e, c) => {
    if (!e) return;
    e.classList.remove(c);
    return e
  },

  toggleClass: (e, c) => {
    if (!e) return;
    if (DOMController.hasClass(e, c)) {
      DOMController.removeClass(e, c)
    } else {
      DOMController.addClass(e, c)
    }
    return e
  },

  toggleClassList: (list) => {
    list.forEach(item => {
      DOMController.toggleClass(item[0], item[1])
    })
  }
}
Object.freeze(DOMController);


// StellarApp.init();
stellar.requestAnimationFrame(() => {
  if (stellar.GLOBAL_CONFIG.config.layout === 'default') {
    StellarApp.init_default_layout();
  } else if (stellar.GLOBAL_CONFIG.config.layout === 'volantis') {
    StellarApp.init_volantis_layout();
    highlightKeyWords.startFromURL();
  }
});