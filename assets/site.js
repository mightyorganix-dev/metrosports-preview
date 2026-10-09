(function(){
  // mobile nav
  var nav=document.getElementById('site-nav'),open=document.querySelector('.site-header .menu-toggle:not(.close)'),close=nav&&nav.querySelector('.close'),scrim;
  function setNav(on){
    if(!nav)return; nav.classList.toggle('open',on); open.setAttribute('aria-expanded',on);
    if(close) close.style.display=on?'block':'none';
    if(on){scrim=document.createElement('div');scrim.className='scrim';scrim.onclick=function(){setNav(false)};document.body.appendChild(scrim);(nav.querySelector('a')||nav).focus();}
    else if(scrim){scrim.remove();scrim=null;open.focus();}
  }
  if(open) open.addEventListener('click',function(){setNav(!nav.classList.contains('open'))});
  if(close) close.addEventListener('click',function(){setNav(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav&&nav.classList.contains('open'))setNav(false)});
  // desktop dropdown buttons (click/keyboard)
  document.querySelectorAll('.nav button.drop').forEach(function(b){
    b.addEventListener('click',function(){var li=b.parentNode,on=!li.classList.contains('open');document.querySelectorAll('.nav li.open').forEach(function(x){x.classList.remove('open')});li.classList.toggle('open',on);b.setAttribute('aria-expanded',on)});
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.nav li'))document.querySelectorAll('.nav li.open').forEach(function(x){x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded',false)})});
  // catalog filter
  document.querySelectorAll('[data-filter]').forEach(function(inp){
    var items=document.querySelectorAll(inp.dataset.filter);
    inp.addEventListener('input',function(){var q=inp.value.trim().toLowerCase();items.forEach(function(li){li.style.display=!q||li.dataset.k.indexOf(q)>-1||li.textContent.toLowerCase().indexOf(q)>-1?'':'none'})});
  });
  // lightbox
  var dlg=document.querySelector('dialog.lightbox');
  if(dlg&&dlg.showModal){
    var links=[].slice.call(document.querySelectorAll('[data-lightbox]')),idx=0,img=dlg.querySelector('img'),cap=dlg.querySelector('p');
    function show(i){idx=(i+links.length)%links.length;var a=links[idx];img.src=a.getAttribute('href');img.alt=a.dataset.caption;cap.textContent=a.dataset.caption+'  ('+(idx+1)+' / '+links.length+')';}
    links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();show(i);dlg.showModal();})});
    dlg.querySelector('[data-prev]').onclick=function(){show(idx-1)};
    dlg.querySelector('[data-next]').onclick=function(){show(idx+1)};
    dlg.querySelector('[data-close]').onclick=function(){dlg.close()};
    dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
    dlg.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
  }
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
})();
