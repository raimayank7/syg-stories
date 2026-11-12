
(function(){
  var root=document.documentElement;
  function speak(ps,b,label){var i=-1,on=false;
    function stop(){on=false;if(window.speechSynthesis)speechSynthesis.cancel();ps.forEach(function(p){p.classList.remove('now')});b.textContent=label}
    function next(){i++;if(!on||i>=ps.length){stop();return}ps.forEach(function(p){p.classList.remove('now')});ps[i].classList.add('now');
      var u=new SpeechSynthesisUtterance(ps[i].textContent);u.lang='en-IN';u.rate=.72;u.pitch=.95;u.volume=.9;u.onend=function(){setTimeout(next,700)};speechSynthesis.speak(u)}
    b.onclick=function(){if(!window.speechSynthesis){SYG.toast('This browser cannot read aloud');return}if(on){stop();return}on=true;i=-1;b.textContent='■ Stop';next()};
    window.addEventListener('pagehide',stop)}
  var st=document.getElementById('story'),b=document.getElementById('aloud');
  if(st&&b)speak([].slice.call(st.querySelectorAll('p')),b,'▶ Read aloud');
  var tgt=st||document.getElementById('made');
  if(tgt){var sz=+(localStorage.getItem('syg-bed-size')||0);var ap=function(){tgt.style.fontSize=(1.1+sz*.14)+'rem'};ap();
    document.querySelectorAll('[data-size]').forEach(function(x){x.onclick=function(){sz=Math.max(-1,Math.min(5,sz+(+x.getAttribute('data-size'))));try{localStorage.setItem('syg-bed-size',sz)}catch(e){}ap()}})}
  var n=document.getElementById('night');
  if(n){var was=root.getAttribute('data-theme');n.onclick=function(){var on=root.classList.toggle('night');if(on){was=root.getAttribute('data-theme');root.setAttribute('data-theme','dark')}else if(was)root.setAttribute('data-theme',was);else root.removeAttribute('data-theme');
    n.setAttribute('aria-pressed',on);n.textContent=on?'☀ Normal':'☾ Night'}}
  /* make your own story */
  var f=document.getElementById('mk');
  if(f){var out=document.getElementById('made');
    var T=["It was the end of the day, and {name} was getting ready for bed. Outside, the sky had turned dark blue, and one small star had come out to see who was still awake.",
      "{name} climbed into bed and pulled up the {thing}. It was soft and warm. It smelled of home.",
      "\"I wonder,\" thought {name}, \"what the {animal} is doing now.\"",
      "Far away, {place}, a little {animal} was getting ready for bed too. It had played all day. It had eaten its dinner. Now it yawned a big, slow yawn.",
      "The little {animal} looked up and saw the very same star. \"Goodnight, star,\" it said. Then it curled up, closed its eyes, and breathed in... and out... in... and out.",
      "{name} smiled. If the {animal} could go to sleep, then so could {name}.",
      "So {name} said goodnight to the window. Goodnight to the door. Goodnight to {who}, who was sitting close by.",
      "{name} breathed in... and out. In... and out. The {thing} went up and down, slowly, slowly, like a small boat on a quiet river.",
      "The star kept watch over the {animal}. The star kept watch over {name}.",
      "And {place}, and here in this room, everyone was fast asleep. Goodnight, {name}."];
    function val(id,d){var v=document.getElementById(id).value.trim();return SYG.esc(v||d)}
    function make(){var m={name:val('mname','Little One'),animal:val('manimal','rabbit').toLowerCase(),place:val('mplace','in a quiet forest'),thing:val('mthing','blanket').toLowerCase(),who:val('mwho','Mummy')};
      out.innerHTML=T.map(function(p){return '<p>'+p.replace(/\{(\w+)\}/g,function(_,k){return m[k]})+'</p>'}).join('');out.hidden=false;document.getElementById('mkacts').hidden=false;
      speak([].slice.call(out.querySelectorAll('p')),document.getElementById('aloud2'),'▶ Read aloud')}
    f.addEventListener('submit',function(e){e.preventDefault();make();out.scrollIntoView({behavior:'smooth',block:'start'})})}
})();
