/* Les sorties comptables sont enregistrées immédiatement comme payées. */
document.querySelector('#operationForm').addEventListener('submit',event=>{
  const form=event.currentTarget;if(currentType!=='expense'||form.dataset.admin||form.dataset.request)return;
  event.preventDefault();event.stopImmediatePropagation();const values=Object.fromEntries(new FormData(form));const amount=Number(values.amount);
  data.expenses.unshift({id:'SOR-'+Date.now().toString().slice(-6),label:values.label,category:values.category,date:values.date,amount,status:'payée',validator:data.user.name});
  addAudit(`${data.user.name} a enregistré une sortie de ${money(amount)}`);save();form.closest('#modal').classList.add('hidden');renderAll();syncNow();toast('Sortie enregistrée et comptabilisée.');
},true);
