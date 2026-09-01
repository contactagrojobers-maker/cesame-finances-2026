/* Tables fiables, filtres stables et suppression traçable des opérations. */
const operationClass=status=>status==='payée'||status==='validée'?'validée':status==='rejetée'||status==='en retard'?'rejetée':'prévue';
const rowEmpty=(columns,message='Aucune opération.')=>`<tr><td colspan="${columns}" class="muted">${message}</td></tr>`;
renderTables=function(){
  const incomeSearch=document.querySelector('#incomeSearch').value.trim().toLowerCase();
  const expenseSearch=document.querySelector('#expenseSearch').value.trim().toLowerCase();
  const incomeSelect=document.querySelector('#incomeFilter'); const previousCategory=incomeSelect.value||'all';
  const incomeCategories=[...new Set(data.incomes.map(item=>item.category))].sort();
  incomeSelect.innerHTML='<option value="all">Toutes les catégories</option>'+incomeCategories.map(category=>`<option value="${escape(category)}">${escape(category)}</option>`).join('');
  incomeSelect.value=incomeCategories.includes(previousCategory)?previousCategory:'all';
  const incomeCategory=incomeSelect.value;
  const incomes=data.incomes.filter(item=>(item.label+' '+item.category).toLowerCase().includes(incomeSearch)&&(incomeCategory==='all'||item.category===incomeCategory));
  document.querySelector('#incomeTable').innerHTML=incomes.map(item=>`<tr><td>${escape(item.id)}</td><td>${escape(item.label)}</td><td>${escape(item.category)}</td><td>${date(item.date)}</td><td>${escape(item.mode||'—')}</td><td class="right amount-income">+ ${money(item.amount)}</td><td>${can()?`<button class="action-mini" data-delete-entry="${escape(item.id)}">Supprimer</button>`:''}</td></tr>`).join('')||rowEmpty(7);
  const expenseSelect=document.querySelector('#expenseStatus'); const expenseStatus=expenseSelect.value||'all';
  const expenses=data.expenses.filter(item=>(item.label+' '+item.category).toLowerCase().includes(expenseSearch)&&(expenseStatus==='all'||item.status===expenseStatus));
  document.querySelector('#expenseTable').innerHTML=expenses.map(item=>`<tr><td>${escape(item.label)}</td><td>${escape(item.category)}</td><td>${date(item.date)}</td><td><span class="status ${operationClass(item.status)}">${escape(item.status)}</span></td><td>${escape(item.validator||'—')}</td><td class="right amount-expense">− ${money(item.amount)}</td><td>${item.status==='à valider'&&can()?`<button class="action-mini" data-validate="${escape(item.id)}">Valider</button> `:''}${can()?`<button class="action-mini" data-delete-expense="${escape(item.id)}">Supprimer</button>`:''}</td></tr>`).join('')||rowEmpty(7);
};
filterTable=function(){renderTables();};
document.addEventListener('click',event=>{
  const entry=event.target.closest('[data-delete-entry]');const expense=event.target.closest('[data-delete-expense]'); if(!entry&&!expense)return;
  const collection=entry?data.incomes:data.expenses;const id=(entry||expense).dataset[entry?'deleteEntry':'deleteExpense'];const index=collection.findIndex(item=>item.id===id);if(index<0)return;
  const item=collection[index];if(!window.confirm(`Supprimer définitivement « ${item.label} » ?`))return;
  collection.splice(index,1);addAudit(`${data.user.name} a supprimé ${entry?'l’entrée':'la sortie'} « ${item.label} »`);save();renderAll();setTimeout(syncNow,0);toast('Opération supprimée.');
});
