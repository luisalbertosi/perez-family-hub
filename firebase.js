window.PFHFirebase=(function(){
 const CONFIG={apiKey:"AIzaSyCmyayR7_veaP62Y38Z46FcvzqyQBi297w",authDomain:"perez-family-hub-509018.firebaseapp.com",projectId:"perez-family-hub-509018",storageBucket:"perez-family-hub-509018.firebasestorage.app",messagingSenderId:"625809892764",appId:"1:625809892764:web:52ce6ff926a7737aff1459"};
 let db=null,auth=null;
 function init(){if(!window.firebase)throw Error("Firebase SDK did not load");if(!firebase.apps.length)firebase.initializeApp(CONFIG);db=firebase.firestore();auth=firebase.auth();auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});}
 async function ensureAuth(){if(!auth)init();if(auth.currentUser)return auth.currentUser;const token=PFHGoogle.getAccessToken();if(!token)throw Error("Connect Google first.");const credential=firebase.auth.GoogleAuthProvider.credential(null,token);const r=await auth.signInWithCredential(credential);return r.user;}
 async function all(collection){await ensureAuth();const snap=await db.collection(collection).get();return snap.docs.map(d=>({id:d.id,...d.data()}));}
 async function set(collection,id,data){await ensureAuth();const ref=id?db.collection(collection).doc(String(id)):db.collection(collection).doc();await ref.set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:false});return ref.id;}
 async function remove(collection,id){await ensureAuth();await db.collection(collection).doc(String(id)).delete();}
 async function migrateLegacy(items){
   const legacy=(items||[]).filter(g=>["meal","list","recipe"].includes(g.extendedProperties?.shared?.pfhType));
   if(!legacy.length||localStorage.getItem("pfh-firestore-migration-v012")==="done")return false;
   if(!confirm(`Perez Family Hub found ${legacy.length} meal/list/recipe storage record${legacy.length===1?"":"s"} in Google Calendar.\n\nMove them to Firestore now and remove those storage records from Google Calendar? Your actual calendar events and chores will not be changed.`))return false;
   await ensureAuth();
   for(const g of legacy){
     const x=g.extendedProperties?.shared||{},type=x.pfhType;
     if(type==="meal")await set("meals",g.id,{title:g.summary||"Meal",date:g.start?.date||g.start?.dateTime?.slice(0,10)||"",type:x.pfhMealType||"Dinner",notes:g.description||"",recipe:x.pfhRecipe||"",recipeId:x.pfhRecipeId||""});
     if(type==="list"){let a=[];try{a=JSON.parse(g.description||"[]");if(!Array.isArray(a))a=[]}catch{}await set("lists",g.id,{title:g.summary||"List",items:a});}
     if(type==="recipe"){let d={};try{d=JSON.parse(g.description||"{}")}catch{}await set("recipes",g.id,{title:g.summary||"Recipe",url:d.url||"",ingredients:Array.isArray(d.ingredients)?d.ingredients:[],instructions:d.instructions||"",minutes:+d.minutes||30,tags:Array.isArray(d.tags)?d.tags:[]});}
   }
   for(const g of legacy)await PFHGoogle.api("/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events/"+encodeURIComponent(g.id),{method:"DELETE"});
   localStorage.setItem("pfh-firestore-migration-v012","done");return true;
 }
 return{init,ensureAuth,all,set,remove,migrateLegacy};
})();
