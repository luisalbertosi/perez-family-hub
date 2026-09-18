
window.PFHChores=(function(){
  let chores=[];
  let busyIds=new Set();
  const $=s=>document.querySelector(s);
  const {ymd,parse,PEOPLE,esc}=PFHCalendar;

  function fromGoogle(g){
    const x=g.extendedProperties?.shared||{};
    if(x.pfhType!=="chore") return null;
    return {
      id:String(g.id),
      title:g.summary||"Chore",
      person:x.pfhPerson||"FAMILY",
      done:x.pfhDone==="true",
      repeat:x.pfhRepeat||"none",
      date:g.start?.date||g.start?.dateTime?.slice(0,10),
      notes:g.description||""
    };
  }

  function loadFromItems(items){
    chores=(items||[]).map(fromGoogle).filter(Boolean);
    render();
  }

  async function sync(items=null){
    if(!PFHGoogle.isConnected()){chores=[];render();return;}
    const all=items||await PFHGoogle.list();
    loadFromItems(all);
  }

  function nextDate(dateStr,repeat){
    const d=parse(dateStr);
    if(repeat==="daily") d.setDate(d.getDate()+1);
    else if(repeat==="weekly") d.setDate(d.getDate()+7);
    else if(repeat==="monthly"){
      const originalDay=d.getDate();
      d.setDate(1);
      d.setMonth(d.getMonth()+1);
      const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
      d.setDate(Math.min(originalDay,last));
    } else return null;
    return ymd(d);
  }

  function render(){
    const open=chores.filter(c=>!c.done).length;
    const done=chores.filter(c=>c.done).length;
    $("#choreStats").innerHTML=`<div class="stat">${open} open</div><div class="stat">${done} done</div>`;

    const list=[...chores].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
    $("#choreList").innerHTML=list.length?list.map(c=>{
      const col=PEOPLE[c.person]||PEOPLE.FAMILY;
      const disabled=busyIds.has(c.id)?"disabled":"";
      return `<div class="chore ${c.done?"done":""}" style="border-left-color:${col}" data-chore-card="${esc(c.id)}">
        <div class="choreTop">
          <button class="check" data-check="${esc(c.id)}" ${disabled} aria-label="${c.done?"Reopen":"Complete"} ${esc(c.title)}">${c.done?"✓":""}</button>
          <div>
            <div class="choreName">${esc(c.title)}</div>
            <div class="meta">${c.person} · ${parse(c.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · ${c.repeat==="none"?"One time":c.repeat[0].toUpperCase()+c.repeat.slice(1)}</div>
            ${c.notes?`<div class="meta">${esc(c.notes)}</div>`:""}
          </div>
        </div>
        <div class="choreActions"><button data-edit="${esc(c.id)}" ${disabled}>Edit</button></div>
      </div>`;
    }).join(""):`<div class="empty">No chores yet. Add the first one.</div>`;
  }

  function openEditor(c=null){
    const form=$("#editorForm");
    $("#modalTitle").textContent=c?"Edit Chore":"Add Chore";
    form.innerHTML=`<div class="formGrid">
      <div class="field full"><label>Chore name</label><input name="title" required value="${esc(c?.title||"")}"></div>
      <div class="field"><label>Assigned to</label><select name="person">${Object.keys(PEOPLE).map(p=>`<option ${c?.person===p?"selected":""}>${p}</option>`).join("")}</select></div>
      <div class="field"><label>Due date</label><input type="date" name="date" required value="${c?.date||ymd(new Date())}"></div>
      <div class="field"><label>Repeat</label><select name="repeat">${[["none","One time"],["daily","Daily"],["weekly","Weekly"],["monthly","Monthly"]].map(([v,l])=>`<option value="${v}" ${c?.repeat===v?"selected":""}>${l}</option>`).join("")}</select></div>
      <div class="field full"><label>Notes</label><textarea name="notes">${esc(c?.notes||"")}</textarea></div>
      <div class="formActions">
        ${c?'<button type="button" id="deleteChore" class="danger">Delete</button>':""}
        <button type="button" id="cancelChore" class="ghost">Cancel</button>
        <button class="primary">Save Chore</button>
      </div>
    </div>`;

    $("#modal").classList.remove("hidden");
    $("#cancelChore").onclick=()=>$("#modal").classList.add("hidden");

    form.onsubmit=async e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const date=fd.get("date");
      const end=parse(date); end.setDate(end.getDate()+1);
      const body={
        summary:fd.get("title"),
        description:fd.get("notes")||"",
        transparency:"transparent",
        start:{date},
        end:{date:ymd(end)},
        extendedProperties:{shared:{
          pfhType:"chore",
          pfhPerson:fd.get("person"),
          pfhDone:String(c?.done||false),
          pfhRepeat:fd.get("repeat")
        }}
      };
      try{
        const path="/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events"+(c?"/"+encodeURIComponent(c.id):"");
        await PFHGoogle.api(path,{method:c?"PUT":"POST",body:JSON.stringify(body)});
        $("#modal").classList.add("hidden");
        await window.PFHApp.syncAll();
      }catch(x){alert(x.message);}
    };

    if(c) $("#deleteChore").onclick=async()=>{
      if(!confirm("Delete this chore?")) return;
      try{
        await PFHGoogle.api("/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events/"+encodeURIComponent(c.id),{method:"DELETE"});
        $("#modal").classList.add("hidden");
        await window.PFHApp.syncAll();
      }catch(x){alert(x.message);}
    };
  }

  async function toggle(clickedId){
    // Snapshot the exact clicked record before any await/sync can change local state.
    const c=chores.find(x=>x.id===String(clickedId));
    if(!c || busyIds.has(c.id)) return;

    const target={
      id:c.id,
      person:c.person,
      done:c.done,
      repeat:c.repeat,
      date:c.date
    };

    busyIds.add(target.id);
    render();

    try{
      const eventPath="/calendars/"+encodeURIComponent(PFHGoogle.CALENDAR_ID)+"/events/"+encodeURIComponent(target.id);

      if(!target.done && target.repeat!=="none"){
        const next=nextDate(target.date,target.repeat);
        if(!next) throw Error("Could not calculate next chore date.");
        const end=parse(next); end.setDate(end.getDate()+1);

        // PATCH ONLY the exact event that was clicked.
        await PFHGoogle.api(eventPath,{
          method:"PATCH",
          body:JSON.stringify({
            start:{date:next},
            end:{date:ymd(end)},
            extendedProperties:{shared:{
              pfhType:"chore",
              pfhPerson:target.person,
              pfhDone:"false",
              pfhRepeat:target.repeat
            }}
          })
        });
      }else{
        // One-time completion/reopen also PATCHes only the clicked event.
        await PFHGoogle.api(eventPath,{
          method:"PATCH",
          body:JSON.stringify({
            extendedProperties:{shared:{
              pfhType:"chore",
              pfhPerson:target.person,
              pfhDone:String(!target.done),
              pfhRepeat:target.repeat
            }}
          })
        });
      }
    }catch(x){
      alert(x.message);
    }finally{
      busyIds.delete(target.id);
      await window.PFHApp.syncAll();
    }
  }

  function init(){
    $("#addChoreBtn").onclick=()=>openEditor();
    $("#choreList").onclick=e=>{
      const check=e.target.closest("[data-check]");
      if(check){e.preventDefault();toggle(check.dataset.check);return;}
      const edit=e.target.closest("[data-edit]");
      if(edit){
        e.preventDefault();
        const c=chores.find(x=>x.id===String(edit.dataset.edit));
        if(c) openEditor(c);
      }
    };
    render();
  }

  return {init,sync,render,loadFromItems};
})();
