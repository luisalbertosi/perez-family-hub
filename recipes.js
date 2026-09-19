window.PFHRecipes=(function(){
let recipes=[]; const $=s=>document.querySelector(s),{ymd,esc}=PFHCalendar;
function parseData(s){try{const x=JSON.parse(s||"{}");return x&&typeof x==="object"?x:{}}catch{return{}}}
function fromGoogle(g){const x=g.extendedProperties?.shared||{};if(x.pfhType!=="recipe")return null;const d=parseData(g.description);return{id:String(g.id),title:g.summary||"Recipe",url:d.url||"",ingredients:Array.isArray(d.ingredients)?d.ingredients:[],instructions:d.instructions||"",minutes:+d.minutes||0,tags:Array.isArray(d.tags)?d.tags:[]}}
function loadFromItems(items){recipes=(items||[]).map(fromGoogle).filter(Boolean).sort((a,b)=>a.title.localeCompare(b.title));render();PFHMeals.render()}
function all(){return recipes.slice()} function get(id){return recipes.find(r=>r.id===id)||null}
function body(r){let d=new Date(),e=new Date(d);e.setDate(e.getDate()+1);return{summary:r.title,description:JSON.stringify({url:r.url||"",ingredients:r.ingredients||[],instructions:r.instructions||"",minutes:+r.minutes||0,tags:r.tags||[]}),transparency:"transparent",start:{date:ymd(d)},end:{date:ymd(e)},extendedProperties:{shared:{pfhType:"recipe"}}}}
async function save(r){const path="/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events"+(r.id?"/"+encodeURIComponent(r.id):"");await PFHGoogle.api(path,{method:r.id?"PUT":"POST",body:JSON.stringify(body(r))});await PFHApp.syncAll()}
function editor(r=null,prefill={}){const f=$("#editorForm");$("#modalTitle").textContent=r?"Edit Recipe":"Add Recipe";const v={...prefill,...(r||{})};f.innerHTML=`<div class="formGrid"><div class="field full"><label>Recipe name</label><input name="title" required value="${esc(v.title||"")}"></div><div class="field full"><label>Recipe link (optional)</label><input type="url" name="url" placeholder="https://…" value="${esc(v.url||"")}"></div><div class="field"><label>Prep + cook time (minutes)</label><input type="number" min="0" name="minutes" value="${v.minutes||""}"></div><div class="field"><label>Tags</label><input name="tags" placeholder="Quick, Mexican, Grill" value="${esc((v.tags||[]).join(", "))}"></div><div class="field full"><label>Ingredients — one per line</label><textarea name="ingredients" rows="8" placeholder="1 lb chicken\n2 cups rice\n1 onion">${esc((v.ingredients||[]).join("\n"))}</textarea></div><div class="field full"><label>Instructions</label><textarea name="instructions" rows="7" placeholder="Family recipe notes or directions…">${esc(v.instructions||"")}</textarea></div><div class="formActions">${r?'<button type="button" id="deleteRecipe" class="danger">Delete</button>':""}<button type="button" id="cancelRecipe" class="ghost">Cancel</button><button class="primary">Save Recipe</button></div></div>`;$("#modal").classList.remove("hidden");$("#cancelRecipe").onclick=()=>$("#modal").classList.add("hidden");f.onsubmit=async e=>{e.preventDefault();const fd=new FormData(f),x={id:r?.id,title:String(fd.get("title")).trim(),url:String(fd.get("url")||"").trim(),minutes:+fd.get("minutes")||0,tags:String(fd.get("tags")||"").split(",").map(s=>s.trim()).filter(Boolean),ingredients:String(fd.get("ingredients")||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean),instructions:String(fd.get("instructions")||"").trim()};try{await save(x);$("#modal").classList.add("hidden")}catch(err){alert(err.message)}};if(r)$("#deleteRecipe").onclick=async()=>{if(!confirm(`Delete recipe "${r.title}"?`))return;try{await PFHGoogle.api("/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events/"+encodeURIComponent(r.id),{method:"DELETE"});$("#modal").classList.add("hidden");await PFHApp.syncAll()}catch(err){alert(err.message)}}}
async function importRecipe(){
 const url=prompt("Paste a recipe website URL:"); if(!url)return;
 let pre={url};
 try{
  const res=await fetch(url);
  if(res.ok){
   const html=await res.text(),doc=new DOMParser().parseFromString(html,"text/html"),scripts=[...doc.querySelectorAll('script[type="application/ld+json"]')];
   let rec=null;
   for(const script of scripts){
    try{const j=JSON.parse(script.textContent),arr=Array.isArray(j)?j:(j['@graph']||[j]);rec=arr.find(x=>{const t=x?.['@type'];return t==="Recipe"||(Array.isArray(t)&&t.includes("Recipe"))});if(rec)break}catch{}
   }
   if(rec){
    pre.title=rec.name||"";pre.ingredients=rec.recipeIngredient||[];
    pre.instructions=Array.isArray(rec.recipeInstructions)?rec.recipeInstructions.map(x=>typeof x==="string"?x:x.text||"").filter(Boolean).join("\n"):rec.recipeInstructions||"";
    const mins=(rec.totalTime||rec.cookTime||"").match(/PT(?:(\d+)H)?(?:(\d+)M)?/);if(mins)pre.minutes=(+mins[1]||0)*60+(+mins[2]||0);
   }
  }
 }catch{}
 editor(null,pre);
 if(!pre.title)setTimeout(()=>alert("This website did not allow automatic importing from the browser. I opened the recipe form with the link saved so you can paste the ingredients/details."),50);
}
function render(){const box=$("#recipeGrid");if(!box)return;box.innerHTML=recipes.length?recipes.map(r=>`<button class="recipeCard" data-recipe="${esc(r.id)}"><div class="recipeIcon">🍴</div><div><strong>${esc(r.title)}</strong><small>${r.minutes?`${r.minutes} min · `:""}${r.ingredients.length} ingredients${r.tags.length?` · ${esc(r.tags.slice(0,2).join(" · "))}`:""}</small></div></button>`).join(""):`<div class="recipeEmpty"><b>No saved recipes yet.</b><span>Add a family favorite or import a recipe link.</span></div>`}
function init(){$("#addRecipeBtn").onclick=()=>editor();$("#importRecipeBtn").onclick=importRecipe;$("#recipeGrid").onclick=e=>{let b=e.target.closest("[data-recipe]");if(b){let r=get(b.dataset.recipe);if(r)editor(r)}};render()}
return{init,loadFromItems,render,all,get,editor};})();
