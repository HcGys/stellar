function init() {
  const highlightElementArr = document.querySelectorAll('figure.highlight')
  highlightElementArr.forEach(hl => {
    var code = hl.querySelector('.code')

    const btnDiv = document.createElement('div');
    btnDiv.classList.add('code-btns');

    // fullscreen btn
    const codeFullscreenBtn = document.createElement('span')
    codeFullscreenBtn.classList.add('fullscreen-btn')
    codeFullscreenBtn.innerHTML = `<i class='fa-duotone fa-expand fa-fw'></i><span class="desc">放大</span>`
    const codeFullscreenBtnDesc = codeFullscreenBtn.querySelector('span');
    const codeFullscreenBtnIcon = codeFullscreenBtn.querySelector('i');
    codeFullscreenBtn.addEventListener('click', ()=>{
      hl.classList.toggle('fullscreen');
      if (hl.classList.contains('fullscreen')) {
        codeFullscreenBtnIcon.classList.remove('fa-expand');
        codeFullscreenBtnIcon.classList.add('fa-compress');
        codeFullscreenBtnDesc.innerText = '缩小';
        document.querySelector('body').setAttribute('style', 'overflow:hidden;');
      } else {
        codeFullscreenBtnIcon.classList.remove('fa-compress');
        codeFullscreenBtnIcon.classList.add('fa-expand');
        codeFullscreenBtnDesc.innerText = '放大';
        document.querySelector('body').removeAttribute('style');
        util.animateOut(hl, "slide-out .5s");
      }
    })
    
    btnDiv.appendChild(codeFullscreenBtn);

    // copy btn 
    const codeCopyBtn = document.createElement('span')
    codeCopyBtn.classList.add('copy-btn')
    codeCopyBtn.innerHTML = `<i class='fa-duotone fa-copy fa-fw'></i><span class="desc">${stellar.GLOBAL_CONFIG.plugins.copycode.default_text}</span>`
    const codeCopyBtnIcon = codeCopyBtn.querySelector('i');
    const codeCopyBtnDesc = codeCopyBtn.querySelector('span');

    btnDiv.appendChild(codeCopyBtn);

    // code.appendChild(codeCopyBtn)

    codeCopyBtn.addEventListener('click', async () => {
      const currentCodeElement = code.children[0]?.innerText
      await copyCode(currentCodeElement)

      codeCopyBtnDesc.innerText = stellar.GLOBAL_CONFIG.plugins.copycode.success_text
      codeCopyBtn.classList.add('success')
      codeCopyBtnIcon.classList.remove('fa-copy')
      codeCopyBtnIcon.classList.remove('fa-circle-exclamation')
      codeCopyBtnIcon.classList.add('fa-circle-check')
      
      util.messageCopyright()

      setTimeout(() => {
        codeCopyBtnDesc.innerText = stellar.GLOBAL_CONFIG.plugins.copycode.default_text
        codeCopyBtn.classList.remove('success')
        codeCopyBtnIcon.classList.remove('fa-check')
        codeCopyBtnIcon.classList.add('fa-copy')
      },3000)
    })

    // hl.appendChild(btnDiv);

    // code-lang
    let langName = hl.getAttribute('class').split(' ')[1]
    const codeLang = document.createElement('div');
    codeLang.classList.add('code-lang');
    codeLang.innerHTML = `<span>${langName}</span>`;

    const codeBtnsAndLang = document.createElement('div');
    codeBtnsAndLang.classList.add('code-btns-and-lang');
    codeBtnsAndLang.appendChild(btnDiv);
    codeBtnsAndLang.appendChild(codeLang);

    // code-tools
    const codeTools = document.createElement('div');
    codeTools.classList.add('code-tools');
    let caption = hl.querySelector('.highlight figcaption');
    if (caption) {
      codeTools.appendChild(caption);
    } else {
      codeTools.appendChild(document.createElement('figcaption'));
    }
    codeTools.appendChild(codeBtnsAndLang);

    hl.insertBefore(codeTools, hl.children[0]);

  })
}

async function copyCode(currentCode) {
  // console.log(currentCode)
  // console.log('复制代码')
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(currentCode)
      } catch (error) {
      // 未获得用户许可
      codeCopyBtnDesc.innerText = '未获得用户许可'
      codeCopyBtn.classList.add('warning')
      codeCopyBtnIcon.classList.remove('fa-copy')
      codeCopyBtnIcon.classList.add('fa-circle-exclamation')

      hud.message('未获得用户许可', error, {
        icon: 'fa-duotone fa-exclamation-square red',
        displayMode: 1,
        time: 9000
      });

      setTimeout(() => {
        codeCopyBtnDesc.innerText = stellar.GLOBAL_CONFIG.plugins.copycode.default_text
        codeCopyBtn.classList.remove('warning')
        codeCopyBtnIcon.classList.remove('fa-circle-exclamation')
        codeCopyBtnIcon.classList.add('fa-copy')
      },3000)
    }
  } else {
    codeCopyBtnDesc.innerText = '当前浏览器不支持此api'
    codeCopyBtn.classList.add('warning')
    codeCopyBtnIcon.classList.remove('fa-copy')
    codeCopyBtnIcon.classList.add('fa-circle-exclamation')

    hud.message('COPY错误', '当前浏览器不支持此api', {
      icon: 'fa-duotone fa-exclamation-square red',
      displayMode: 1,
      time: 9000
    });

    setTimeout(() => {
      codeCopyBtnDesc.innerText = stellar.GLOBAL_CONFIG.plugins.copycode.default_text
      codeCopyBtn.classList.remove('warning')
      codeCopyBtnIcon.classList.remove('fa-circle-exclamation')
      codeCopyBtnIcon.classList.add('fa-copy')
    },3000)
  }
}

init();