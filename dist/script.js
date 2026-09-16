const menuURL='https://view.qrall.co/tr?tenantId=3a16e69d-7ecb-bc36-0c3f-3e7cbc0a5348&channelId=3a16e69d-854a-0b35-c52c-68af1455f6ba';
document.querySelectorAll('.menu-link').forEach(a=>a.href=menuURL);
document.getElementById('year').textContent=new Date().getFullYear();
function setLanguage(lang){
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-tr]').forEach(el=>{el.innerHTML=el.dataset[lang]});
 document.querySelectorAll('[data-alt-tr]').forEach(el=>{el.alt=el.getAttribute('data-alt-'+lang)});
 document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
 document.querySelector('nav').setAttribute('aria-label',lang==='tr'?'Ana menü':'Main navigation');
 document.title=lang==='tr'?'Egg Bistro — Zekeriyaköy, İstanbul':'Egg Bistro — Zekeriyaköy, Istanbul';
 document.querySelector('meta[name="description"]').content=lang==='tr'?'Zekeriyaköy’de taş fırın pizza, kokteyller ve sıcak bir atmosfer. Her gün 12.00–02.00. Rezervasyon: 0501 000 03 22.':'Stone-oven pizza, cocktails and a warm atmosphere in Zekeriyaköy, Istanbul. Open daily 12:00–02:00. Reservations: +90 501 000 03 22.';
 try{localStorage.setItem('egg-language',lang)}catch{}
}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
try{if(localStorage.getItem('egg-language')==='en')setLanguage('en')}catch{}
