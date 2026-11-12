
(function(){
  var st=document.getElementById('story'),b=document.getElementById('aloud');
  if(st&&b){var ps=[].slice.call(st.querySelectorAll('p')),i=-1,on=false;
    function stop(){on=false;if(window.speechSynthesis)speechSynthesis.cancel();ps.forEach(function(p){p.classList.remove('now')});b.textContent='▶ सुनिए'}
    function next(){i++;if(!on||i>=ps.length){stop();return}ps.forEach(function(p){p.classList.remove('now')});ps[i].classList.add('now');ps[i].scrollIntoView({block:'center',behavior:'smooth'});
      var u=new SpeechSynthesisUtterance(ps[i].textContent);u.lang='hi-IN';u.rate=.85;var v=speechSynthesis.getVoices().filter(function(x){return /^hi/i.test(x.lang)})[0];if(v)u.voice=v;
      else if(!next.w){next.w=1;SYG.toast('इस फ़ोन में हिंदी आवाज़ नहीं मिली')}u.onend=next;speechSynthesis.speak(u)}
    b.onclick=function(){if(!window.speechSynthesis){SYG.toast('यह ब्राउज़र पढ़कर नहीं सुना सकता');return}if(on){stop();return}on=true;i=-1;b.textContent='■ रोकिए';next()};
    window.addEventListener('pagehide',stop);
    var sz=+(localStorage.getItem('syg-kahani-size')||0);function ap(){st.style.fontSize=(1.14+sz*.12)+'rem'}ap();
    document.querySelectorAll('[data-size]').forEach(function(x){x.onclick=function(){sz=Math.max(-1,Math.min(4,sz+(+x.getAttribute('data-size'))));try{localStorage.setItem('syg-kahani-size',sz)}catch(e){}ap()}})}
  var ch=document.getElementById('flt');
  if(ch)ch.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;var v=t.getAttribute('data-t');
    ch.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===t)});
    document.querySelectorAll('.scard').forEach(function(c){c.hidden=v!=='all'&&c.getAttribute('data-type')!==v})});
})();
