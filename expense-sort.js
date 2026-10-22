/* Tri local des sorties par date ou montant, sans modifier les données. */
(() => {
  const previousRenderTables=renderTables;
  renderTables=function(){
    const original=data.expenses;
    const order=document.querySelector('#expenseOrder')?.value||'date';
    data.expenses=original.slice().sort((a,b)=>order==='amount'?Number(b.amount||0)-Number(a.amount||0):String(b.date||'').localeCompare(String(a.date||'')));
    previousRenderTables();
    data.expenses=original;
  };
  document.addEventListener('change',event=>{if(event.target.id==='expenseOrder')renderTables();});
})();
