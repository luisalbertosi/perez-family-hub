
window.PFHGoogle=(function(){
 const CLIENT_ID="625809892764-9urcd7nrlodv7oqlb8vevsl3mt43ip7e.apps.googleusercontent.com", CALENDAR_ID="099a364523e965651bacb6235722c386f215f4d202d53f790e89cdb4ef1ea843@group.calendar.google.com", SCOPE="https://www.googleapis.com/auth/calendar.events";
 let accessToken=null, tokenClient=null;
 function restore(){const t=PFHStorage.getToken();if(t&&t.accessToken&&t.expiresAt>Date.now())accessToken=t.accessToken;}
 function init(){restore(); if(window.google?.accounts?.oauth2) tokenClient=google.accounts.oauth2.initTokenClient({client_id:CLIENT_ID,scope:SCOPE,callback:r=>{if(r.error)return;accessToken=r.access_token;PFHStorage.setToken(r.access_token,r.expires_in);window.dispatchEvent(new Event("pfh-auth"));}});}
 function connect(){if(!tokenClient){init();if(!tokenClient)return setTimeout(connect,300)}tokenClient.requestAccessToken({prompt:accessToken?"":"consent"})}
 async function api(path,opt={}){if(!accessToken)throw Error("Google is not connected");const r=await fetch("https://www.googleapis.com/calendar/v3"+path,{...opt,headers:{Authorization:"Bearer "+accessToken,"Content-Type":"application/json",...(opt.headers||{})}});if(r.status===401){accessToken=null;PFHStorage.clearToken();window.dispatchEvent(new Event("pfh-auth"));throw Error("Google session expired. Reconnect Google.")}if(!r.ok){let t=await r.text();throw Error("Google Calendar error "+r.status+": "+t)}return r.status===204?null:r.json()}
 async function list(){let a=new Date();a.setMonth(a.getMonth()-3);let b=new Date();b.setMonth(b.getMonth()+15);let q=`?singleEvents=true&showDeleted=false&maxResults=2500&timeMin=${encodeURIComponent(a.toISOString())}&timeMax=${encodeURIComponent(b.toISOString())}&orderBy=startTime`;return (await api("/calendars/"+encodeURIComponent(CALENDAR_ID)+"/events"+q)).items||[]}
 function isConnected(){return !!accessToken}
 return {init,connect,api,list,isConnected,CALENDAR_ID};
})();
