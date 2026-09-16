const form=document.getElementById('taskForm');
const tasksEl=document.getElementById('tasks');
const emptyEl=document.getElementById('empty');
const countEl=document.getElementById('count');
let tasks=JSON.parse(localStorage.getItem('studysnap_tasks')||'[]');

function save(){localStorage.setItem('studysnap_tasks',JSON.stringify(tasks));render()}
function daysUntil(date){
  const today=new Date(); today.setHours(0,0,0,0);
  const d=new Date(date+'T00:00:00');
  return Math.round((d-today)/86400000);
}
function render(){
  tasks.sort((a,b)=>a.date.localeCompare(b.date));
  tasksEl.innerHTML='';
  emptyEl.style.display=tasks.length?'none':'block';
  countEl.textContent=`${tasks.length} ${tasks.length===1?'assignment':'assignments'}`;
  tasks.forEach(t=>{
    const days=daysUntil(t.date);
    const due=days<0?`${Math.abs(days)} day${Math.abs(days)==1?'':'s'} overdue`:days===0?'Due today':days===1?'Due tomorrow':`Due in ${days} days`;
    const div=document.createElement('div');
    div.className='task '+(t.done?'done':'');
    div.innerHTML=`<div><div class="task-name">${escapeHtml(t.name)}</div><div class="meta">${t.difficulty} · ${t.date} · ${due}</div></div><button aria-label="Mark complete">${t.done?'Undo':'Complete'}</button>`;
    div.querySelector('button').onclick=()=>{t.done=!t.done;save()};
    tasksEl.appendChild(div);
  });
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
form.onsubmit=e=>{
  e.preventDefault();
  tasks.push({id:Date.now(),name:document.getElementById('name').value.trim(),date:document.getElementById('date').value,difficulty:document.getElementById('difficulty').value,done:false});
  form.reset(); document.getElementById('difficulty').value='Medium'; save();
};
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').classList.remove('hidden')});
document.getElementById('installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}};
render();
