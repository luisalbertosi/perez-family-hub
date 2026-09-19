
window.PFHApp=(function(){
 const $=s=>document.querySelector(s);
 function clock(){let d=new Date();$("#dateText").textContent=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});$("#timeText").textContent=d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
 function authUI(){$("#connectionBtn").textContent=PFHGoogle.isConnected()?"● Connected ↻":"Reconnect Google";$("#connectionBtn").style.color=PFHGoogle.isConnected()?"#239254":"#a35a2b"}
 async function syncAll(){authUI();if(!PFHGoogle.isConnected()){PFHCalendar.render();PFHChores.render();PFHMeals.render();return}try{
   const items=await PFHGoogle.list();
   PFHCalendar.loadFromItems(items);
   PFHChores.loadFromItems(items);
   PFHMeals.loadFromItems(items);
   authUI();
 }catch(e){authUI();console.error(e)}}
 function pages(){document.querySelectorAll(".bottomNav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".bottomNav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$("#"+b.dataset.page+"Page").classList.add("active")})}
 function boot(){clock();setInterval(clock,30000);PFHCalendar.init();PFHChores.init();PFHMeals.init();pages();PFHGoogle.init();authUI();$("#connectionBtn").onclick=()=>PFHGoogle.isConnected()?syncAll():PFHGoogle.connect();window.addEventListener("pfh-auth",()=>{authUI();syncAll()});setTimeout(()=>{PFHGoogle.init();authUI();if(PFHGoogle.isConnected())syncAll()},700)}
 document.addEventListener("DOMContentLoaded",boot);
 return {syncAll};
})();
