/* Sauvegarde et actualisation sans recharger la page. */
const financialSnapshot=()=>JSON.stringify({incomes:data.incomes,expenses:data.expenses,planned:data.planned,teachers:data.teachers,audit:data.audit});
async function syncNow(){
  if(!accessToken||syncing)return;
  const snapshot=financialSnapshot(); if(snapshot===lastServerState)return;
  syncing=true;
  try{
    const result=await api('/api/finance',{method:'PUT',body:JSON.stringify({finance:{incomes:data.incomes,expenses:data.expenses,planned:data.planned,teachers:data.teachers,audit:data.audit}})});
    data={...result.finance,user:data.user}; save(); lastServerState=financialSnapshot(); renderAll();
  }catch(error){toast(`Sauvegarde impossible : ${error.message}`)}finally{syncing=false;}
}
document.querySelector('#operationForm').addEventListener('submit',event=>{if(event.currentTarget.dataset.admin!=='true')setTimeout(syncNow,0);});
document.addEventListener('click',event=>{if(event.target.closest('[data-validate],[data-pay],[data-payteacher],[data-delete-entry],[data-delete-expense]'))setTimeout(syncNow,0);});
setInterval(async()=>{
  if(!accessToken||syncing||document.querySelector('#appView').classList.contains('hidden')||financialSnapshot()!==lastServerState)return;
  try{const result=await api('/api/finance');const remote=JSON.stringify({incomes:result.finance.incomes,expenses:result.finance.expenses,planned:result.finance.planned,teachers:result.finance.teachers,audit:result.finance.audit});if(remote!==lastServerState){data={...result.finance,user:data.user};save();lastServerState=remote;renderAll();toast('Données mises à jour.');}}catch{/* la sauvegarde locale reste disponible */}
},3000);
