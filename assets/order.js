/* Order builder — client-side only. Prices come from pricing-config.js (window.MS_PRICING). */
(function(){
  var P=window.MS_PRICING, f=document.getElementById('order'); if(!P||!f) return;
  var root=document.body.dataset.root||'', SHOP='info@metrosportsnh.com';
  var steps=[].slice.call(f.querySelectorAll('.step')), cur=0, stepper=f.querySelector('.stepper');
  var $=function(id){return document.getElementById(id)}, money=function(n){return '$'+n.toFixed(2)};
  // populate selects/grids
  Object.keys(P.garments).forEach(function(k){var o=document.createElement('option');o.textContent=k;$('g-cat').appendChild(o)});
  P.colors.forEach(function(k){var o=document.createElement('option');o.textContent=k;$('g-color').appendChild(o)});
  P.sizes.forEach(function(s){var l=document.createElement('label');l.innerHTML=s+'<input type="number" min="0" step="1" inputmode="numeric" value="0" data-size="'+s+'" aria-label="Quantity '+s+'">';$('sizes').appendChild(l)});
  P.locations.forEach(function(L,i){var d=document.createElement('div');d.className='loc';
    d.innerHTML='<label><input type="checkbox" data-loc="'+L+'"'+(i===0?' checked':'')+'> '+L+'</label><select data-colors="'+L+'" aria-label="Number of colors, '+L+'">'+[1,2,3,4,5,6].map(function(n){return '<option value="'+n+'">'+n+' color'+(n>1?'s':'')+'</option>'}).join('')+'</select>';
    $('locs').appendChild(d)});
  document.querySelectorAll('[data-size="M"],[data-size="L"]').forEach(function(i){i.value=6});
  $('sample-label').textContent=P.sample?P.sampleLabel:''; if(!P.sample)$('sample-label').hidden=true;
  // stepper
  steps.forEach(function(s,i){var li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+s.dataset.title;b.onclick=function(){if(i<=cur||validUpTo(i))go(i)};li.appendChild(b);stepper.appendChild(li)});
  function go(i){cur=i;steps.forEach(function(s,k){s.hidden=k!==i});
    [].forEach.call(stepper.querySelectorAll('button'),function(b,k){b.toggleAttribute('aria-current',k===i);if(k===i)b.setAttribute('aria-current','step');b.classList.toggle('done',k<i)});
    $('back').style.visibility=i?'visible':'hidden';$('next').style.display=i===steps.length-1?'none':'';
    var lg=steps[i].querySelector('legend');lg.tabIndex=-1;lg.focus({preventScroll:true});
    if(window.scrollY>f.offsetTop)window.scrollTo({top:f.offsetTop-100,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  function valid(i){var t=steps[i].dataset.title,ok=true;
    if(t==='Sizes'){ok=qty()>0;$('size-err').hidden=ok}
    if(t==='Decoration'){ok=locs().length>0;$('loc-err').hidden=ok}
    if(t==='Details'){ok=$('cname').value.trim()&&/\S+@\S+\.\S+/.test($('cemail').value);$('det-err').hidden=!!ok}
    return !!ok}
  function validUpTo(i){for(var k=0;k<i;k++)if(!valid(k)){go(k);return false}return true}
  $('next').onclick=function(){if(valid(cur))go(cur+1)};$('back').onclick=function(){go(cur-1)};
  // data
  function service(){return f.querySelector('[name=service]:checked').value}
  function sizes(){var o={};document.querySelectorAll('[data-size]').forEach(function(i){var n=Math.max(0,parseInt(i.value,10)||0);if(n)o[i.dataset.size]=n});return o}
  function qty(){var s=sizes(),t=0;for(var k in s)t+=s[k];return t}
  function locs(){var a=[];document.querySelectorAll('[data-loc]').forEach(function(c){if(c.checked)a.push({name:c.dataset.loc,colors:+document.querySelector('[data-colors="'+c.dataset.loc+'"]').value})});return a}
  function calc(){
    var S=P.services[service()],q=qty(),sz=sizes(),L=locs(),g=P.garments[$('g-cat').value]||{base:0};
    var disc=0;P.quantityBreaks.forEach(function(b){if(q>=b.min)disc=b.discount});
    var blanks=g.base*q,up=0;for(var k in sz)up+=(P.sizeUpcharge[k]||0)*sz[k];
    var setup=0,decoPer=0;
    L.forEach(function(l){ if(S.usesColors){setup+=S.setupPerColor*l.colors;decoPer+=S.perPiecePerColor*l.colors+(S.perPiecePerLocation||0)} else {setup+=S.setupPerLocation||0;decoPer+=S.perPiecePerLocation} });
    var deco=decoPer*q*(1-disc),total=blanks+up+setup+deco;
    return {q:q,blanks:blanks,up:up,setup:setup,deco:deco,disc:disc,total:total,deposit:total*P.depositPercent/100,per:q?total/q:0}}
  function sampleTag(){return P.sample?' <span class="sample">Sample</span>':''}
  function update(){
    var S=P.services[service()];document.querySelectorAll('[data-colors]').forEach(function(s){var on=document.querySelector('[data-loc="'+s.dataset.colors+'"]').checked;s.disabled=!S.usesColors||!on});
    $('loc-help').textContent=S.usesColors?'Choose where it goes and how many ink colors in each spot.':'Choose where it goes.';
    var c=calc(),sz=sizes();$('qty-total').textContent='Total: '+c.q+' pcs';
    var dl=[['Service',service()],['Garment',$('g-cat').value],['Brand',$('g-brand').value||'Recommend'],['Color',$('g-color').value],['Quantity',c.q+' pcs'],['Sizes',Object.keys(sz).map(function(k){return k+'×'+sz[k]}).join(', ')||'—'],['Locations',locs().map(function(l){return l.name+(P.services[service()].usesColors?' ('+l.colors+'c)':'')}).join(', ')||'—'],['Needed by',$('due').value||'—']];
    $('sum').innerHTML=dl.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'}).join('');
    $('lines').innerHTML=[['Blank garments',c.blanks],['Larger-size upcharge',c.up],['Setup',c.setup],['Decoration'+(c.disc?' (−'+Math.round(c.disc*100)+'% qty break)':''),c.deco]].map(function(r){return '<div><span>'+r[0]+'</span><span>'+money(r[1])+sampleTag()+'</span></div>'}).join('')+
      '<div><span>Per piece</span><span>'+money(c.per)+sampleTag()+'</span></div><div><span>Deposit ('+P.depositPercent+'%)</span><span>'+money(c.deposit)+sampleTag()+'</span></div>';
    $('total').innerHTML=money(c.total)+sampleTag();
    $('print-summary').textContent=text();}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function text(){var c=calc(),sz=sizes();
    return ['ORDER REQUEST — Metro Sports','','Name: '+$('cname').value,'Email: '+$('cemail').value,'Phone: '+$('cphone').value,'Team/Org: '+$('org').value,'',
      'Service: '+service(),'Garment: '+$('g-cat').value+(($('g-style').value)?' — '+$('g-style').value:''),'Brand: '+($('g-brand').value||'No preference'),'Color: '+$('g-color').value,
      'Sizes: '+(Object.keys(sz).map(function(k){return k+' x'+sz[k]}).join(', ')||'-')+'  (total '+c.q+')',
      'Locations: '+locs().map(function(l){return l.name+(P.services[service()].usesColors?' ('+l.colors+' colors)':'')}).join(', '),
      'Artwork: '+(files.length?files.join(', ')+' (attached to this email)':'none uploaded'),'Design description: '+$('desc').value,'Needed by: '+$('due').value,'Notes: '+$('notes').value,'',
      'Website estimate: '+money(c.total)+(P.sample?' — '+P.sampleLabel:''),'Deposit ('+P.depositPercent+'%): '+money(c.deposit)].join('\n')}
  f.addEventListener('input',update);f.addEventListener('change',update);
  // artwork preview (local only)
  var files=[];
  $('art').addEventListener('change',function(){var box=$('previews');box.innerHTML='';files=[];
    [].forEach.call(this.files,function(file){files.push(file.name);var fig=document.createElement('figure');
      if(/^image\//.test(file.type)){var img=document.createElement('img');img.alt='Preview of '+file.name;img.src=URL.createObjectURL(file);fig.appendChild(img)}
      else{var d=document.createElement('div');d.className='file';d.textContent=(file.name.split('.').pop()||'FILE').toUpperCase();fig.appendChild(d)}
      var cap=document.createElement('figcaption');cap.textContent=file.name;fig.appendChild(cap);box.appendChild(fig)});update()});
  // actions
  $('send').addEventListener('click',function(e){if(!validUpTo(steps.length-1)){e.preventDefault();return}
    this.href='mailto:'+SHOP+'?subject='+encodeURIComponent('Order request – '+service()+' – '+qty()+' pcs – '+$('cname').value)+'&body='+encodeURIComponent(text())});
  $('print').onclick=function(){update();window.print()};
  function pay(kind){if(!validUpTo(steps.length-1))return;var c=calc();
    var ref='MS-'+Date.now().toString(36).toUpperCase().slice(-6);
    sessionStorage.setItem('ms_order',JSON.stringify({ref:ref,kind:kind,amount:kind==='deposit'?c.deposit:c.total,total:c.total,email:$('cemail').value,name:$('cname').value,summary:text()}));
    location.href=root+'checkout/'}
  $('pay-dep').onclick=function(){pay('deposit')};$('pay-full').onclick=function(){pay('full')};
  go(0);update();
})();
