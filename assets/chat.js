/* Metro Sports guided chat — vanilla JS, no backend, no third-party calls.
 * Knowledge lives in chat-kb.js (window.MS_CHAT_KB). Swap point for a live service: MSChat.ask().
 */
(function(){
  var KB=window.MS_CHAT_KB; if(!KB) return;
  var S=KB.shop, root=document.body.dataset.root||'';
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css=document.createElement('style');
  css.textContent='\
.chat-launcher{position:fixed;right:20px;bottom:20px;z-index:70;display:flex;align-items:center;gap:8px;background:var(--ink);color:#fff;border:0;border-radius:999px;padding:14px 18px;font:700 1rem var(--font);box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer}\
.chat-launcher:hover{background:var(--blue)}\
.chat-launcher svg{width:22px;height:22px}\
.chat-panel{position:fixed;right:20px;bottom:88px;z-index:71;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 140px));background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line)}\
.chat-panel[hidden]{display:none}\
.chat-head{background:var(--ink);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}\
.chat-head b{display:block;font-size:1rem}.chat-head small{color:#9aa3af}\
.chat-head button{margin-left:auto;background:transparent;border:0;color:#fff;font-size:1.3rem;cursor:pointer;width:36px;height:36px;border-radius:8px}\
.chat-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:var(--paper)}\
.msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:.95rem;line-height:1.45}\
.msg.bot{background:#fff;border:1px solid var(--line);align-self:flex-start;border-bottom-left-radius:4px}\
.msg.me{background:var(--blue);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}\
.msg .acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}\
.msg .acts a,.chips button{display:inline-block;border:1px solid var(--blue);color:var(--blue);background:#fff;border-radius:999px;padding:5px 11px;font:600 .85rem var(--font);text-decoration:none;cursor:pointer}\
.msg .acts a.primary{background:var(--red);border-color:var(--red);color:#fff}\
.chips{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-top:1px solid var(--line);background:#fff}\
.chat-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--line)}\
.chat-form input{flex:1;padding:10px 12px;border:1px solid var(--line);border-radius:999px;font:inherit;min-width:0}\
.chat-form button{background:var(--ink);color:#fff;border:0;border-radius:999px;padding:0 16px;font:700 .95rem var(--font);cursor:pointer}\
.chat-note{font-size:.72rem;color:var(--muted);padding:0 14px 8px;background:#fff}\
@media (max-width:960px){.chat-launcher{bottom:84px;right:12px;padding:12px 14px}.chat-launcher .lbl{display:none}.chat-panel{right:12px;bottom:146px;height:min(540px,calc(100vh - 220px))}body.no-bar .chat-launcher{bottom:16px}body.no-bar .chat-panel{bottom:78px;height:min(540px,calc(100vh - 150px))}}\
@media (prefers-reduced-motion:no-preference){.chat-panel{animation:chatIn .18s ease-out}@keyframes chatIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}';
  document.head.appendChild(css);

  var btn=el('button',{class:'chat-launcher','aria-label':'Open chat with Metro Sports','aria-expanded':'false','aria-controls':'ms-chat'});
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01z"/></svg><span class="lbl">Questions? Chat</span>';
  var panel=el('div',{class:'chat-panel',id:'ms-chat',role:'dialog','aria-modal':'false','aria-labelledby':'ms-chat-title',hidden:''});
  panel.innerHTML='<div class="chat-head"><div><b id="ms-chat-title">Metro Sports helper</b><small>Automated assistant · answers from our website</small></div><button type="button" aria-label="Close chat">✕</button></div>'+
    '<div class="chat-log" role="log" aria-live="polite" aria-relevant="additions"></div>'+
    '<div class="chips" role="group" aria-label="Quick questions"></div>'+
    '<form class="chat-form"><label class="sr-only" for="ms-chat-in">Type your question</label><input id="ms-chat-in" autocomplete="off" placeholder="Type a question…"><button type="submit">Send</button></form>'+
    '<div class="chat-note">Nothing you type here is stored or sent anywhere. Quote requests open in your own email app.</div>';
  document.body.appendChild(panel); document.body.appendChild(btn);
  var log=panel.querySelector('.chat-log'),chips=panel.querySelector('.chips'),form=panel.querySelector('form'),input=form.querySelector('input'),started=false,flow=null;

  KB.chips.forEach(function(c){var b=el('button',{type:'button'});b.textContent=c.label;b.onclick=function(){say(c.label,'me');handle(c.intent)};chips.appendChild(b)});
  btn.onclick=function(){toggle(panel.hidden)};
  panel.querySelector('.chat-head button').onclick=function(){toggle(false)};
  panel.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
  form.onsubmit=function(e){e.preventDefault();var t=input.value.trim();if(!t)return;input.value='';say(t,'me');
    if(flow) return flowAnswer(t);
    MSChat.ask(t).then(function(r){render(r)});};

  function toggle(on){panel.hidden=!on;btn.setAttribute('aria-expanded',on);
    if(on){if(!started){started=true;say(KB.greeting,'bot')}setTimeout(function(){input.focus()},reduce?0:50)} else btn.focus();}
  function el(t,a){var e=document.createElement(t);for(var k in (a||{}))e.setAttribute(k,a[k]);return e}
  function url(h){if(h==='MAPS')return S.mapsUrl;if(h==='FACEBOOK')return S.facebook;return /^(https?:|mailto:|tel:)/.test(h)?h:root+h}
  function say(text,who,acts){var m=el('div',{class:'msg '+who});m.textContent=text;
    if(acts&&acts.length){var a=el('div',{class:'acts'});acts.forEach(function(x){var l=el('a',{href:url(x[1])});if(x[2])l.className=x[2];if(/^https?:/.test(x[1])){l.target='_blank';l.rel='noopener'}l.textContent=x[0];if(x[3])l.onclick=x[3];a.appendChild(l)});m.appendChild(a)}
    log.appendChild(m);log.scrollTop=log.scrollHeight;return m}
  function contactActs(r){var a=[];
    if(r.quote)a.push(['Request a quote','#','primary',function(e){e.preventDefault();say('Request a quote','me');handle('quote')}]);
    if(r.contact){a.push(['Call '+S.phone,S.tel]);a.push(['Email us','mailto:'+S.email])}
    return a}
  function render(r){say(r.text,'bot',(r.links||[]).concat(contactActs(r)))}
  function handle(intent){ if(intent==='quote') return startQuote(); render(KB.answers[intent]||KB.answers.fallback) }

  // keyword matcher (local provider)
  function match(t){t=' '+t.toLowerCase()+' ';var best=null,score=0;
    for(var k in KB.keywords){var s=0;KB.keywords[k].forEach(function(w){if(t.indexOf(w)>-1)s+=w.length});if(s>score){score=s;best=k}}
    return best}
  window.MSChat={
    // Replace this to plug in a live service (LLM endpoint, Crisp, Tidio…). Must resolve to {text, links?, contact?, quote?}.
    ask:function(text){var i=match(text);if(i==='quote'){startQuote();return new Promise(function(){})}
      return Promise.resolve(KB.answers[i]||KB.answers.fallback)},
    open:function(){toggle(true)}
  };

  // quote flow
  function startQuote(){flow={i:0,data:{}};askStep()}
  function askStep(){var st=KB.quoteFlow[flow.i];var m=say(st.ask+(st.required?'':' (optional — type "skip")'),'bot');
    if(st.options){var a=el('div',{class:'acts'});st.options.forEach(function(o){var b=el('a',{href:'#'});b.textContent=o;b.onclick=function(e){e.preventDefault();say(o,'me');flowAnswer(o)};a.appendChild(b)});m.appendChild(a)}
    input.focus()}
  function flowAnswer(t){var st=KB.quoteFlow[flow.i];if(/^skip$/i.test(t)&&!st.required)t='';
    if(st.required&&!t){say('This one is needed so we can get back to you.','bot');return}
    flow.data[st.key]=t;flow.i++;
    if(flow.i<KB.quoteFlow.length) return askStep();
    var d=flow.data;flow=null;
    var body='Hi Metro Sports,\n\nI\'d like a quote.\n\nName: '+d.name+'\nContact: '+d.contact+'\nItem(s): '+d.item+'\nQuantity: '+d.quantity+'\nDecoration: '+(d.decoration||'')+'\nNeeded by: '+(d.due||'')+'\n\n(Sent from the website chat. I can attach artwork if needed.)';
    var href='mailto:'+S.email+'?subject='+encodeURIComponent('Quote request – '+d.item+' ('+d.quantity+')')+'&body='+encodeURIComponent(body);
    say('Thanks, '+d.name+'! Tap below to open a pre-filled email to '+S.email+' — review it and hit send. Nothing has been sent yet.','bot',[['Open quote email',href,'primary'],['Or build a full order','order/'],['Call '+S.phone,S.tel]]);
  }
})();
