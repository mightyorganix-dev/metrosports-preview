/* Checkout — DEMO by default. Switch modes in payments-config.js (see PAYMENTS-README.md). */
(function(){
  var C=window.MS_PAYMENTS||{mode:'demo'},P=window.MS_PRICING||{},$=function(i){return document.getElementById(i)};
  var root=document.body.dataset.root||'';
  var o=null;try{o=JSON.parse(sessionStorage.getItem('ms_order'))}catch(e){}
  var tag=P.sample?' <span class="sample">'+(P.sampleLabel||'Sample pricing')+'</span>':'';
  if(!o){$('osum-body').innerHTML='<p>No order in progress. <a href="'+root+'order/">Start an order</a> to see a real summary here.</p><p>Showing a demo amount.</p>';o={ref:'DEMO',kind:'full',amount:100,total:100,summary:'',email:''}}
  else{$('osum-body').innerHTML='<pre>'+o.summary.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})+'</pre><div class="amt"><span>'+(o.kind==='deposit'?'Deposit due':'Amount due')+'</span><span>$'+o.amount.toFixed(2)+tag+'</span></div>'}
  $('ref').textContent=o.ref;
  document.querySelectorAll('.amt-inline').forEach(function(s){s.textContent='$'+o.amount.toFixed(2)+' (demo)'});
  document.querySelectorAll('.methods button').forEach(function(b){b.onclick=function(){
    document.querySelectorAll('.methods button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    document.querySelectorAll('.pm').forEach(function(p){p.hidden=p.dataset.pm!==b.dataset.m})}});
  function link(provider){var c=C[provider]||{};return o.kind==='deposit'?c.depositLink:c.payNowLink}
  document.querySelectorAll('[data-pay]').forEach(function(b){b.onclick=function(){
    if(C.mode==='stripe-payment-link'&&link('stripe')){var u=new URL(link('stripe'));u.searchParams.set('client_reference_id',o.ref);if(o.email)u.searchParams.set('prefilled_email',o.email);location.href=u;return}
    if(C.mode==='square-payment-link'&&link('square')){location.href=link('square');return}
    if(C.mode==='stripe-checkout-session'&&C.stripe&&C.stripe.checkoutSessionEndpoint){
      fetch(C.stripe.checkoutSessionEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref:o.ref,kind:o.kind,amountCents:Math.round(o.amount*100),email:o.email,summary:o.summary})})
        .then(function(r){return r.json()}).then(function(j){location.href=j.url}).catch(function(){alert('Payment could not start. Please call the shop.')});return}
    // demo
    $('co').hidden=true;var d=$('done');d.hidden=false;
    $('done-msg').textContent='This was a demonstration for order '+o.ref+'. No card was charged and no payment information was collected or sent. ('+(o.kind==='deposit'?'Deposit':'Payment')+' amount shown: $'+o.amount.toFixed(2)+(P.sample?' — sample pricing':'')+'.)';
    $('done-mail').href='mailto:'+(C.shopEmail||'info@metrosportsnh.com')+'?subject='+encodeURIComponent('Order request '+o.ref)+'&body='+encodeURIComponent(o.summary||'');
    d.focus();window.scrollTo(0,0)}});
})();
