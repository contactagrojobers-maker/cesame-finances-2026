/* Empêche le formulaire d'administration d'être traité comme une opération financière. */
const cesameForm=document.querySelector('#operationForm');
document.addEventListener('click',event=>{
  if(event.target.closest('#createUser')||event.target.closest('[data-user-id]'))cesameForm.dataset.admin='true';
  if(event.target.closest('.create')||event.target.closest('#quickAdd')||event.target.closest('.close')){delete cesameForm.dataset.admin;cesameForm.onsubmit=null;}
},true);
cesameForm.addEventListener('submit',event=>{
  if(cesameForm.dataset.admin!=='true')return;
  event.preventDefault();event.stopImmediatePropagation();
  if(typeof cesameForm.onsubmit==='function')cesameForm.onsubmit.call(cesameForm,event);
},true);
