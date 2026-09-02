/* Réinitialisation contrôlée des données financières de test. */
const resetButton=document.querySelector('#resetData');
const canReset=()=>data.user&&['Promoteur','Directeur'].includes(data.user.role);
const renderWithReset=renderAll;renderAll=function(){renderWithReset();resetButton.classList.toggle('hidden',!canReset());};
resetButton.addEventListener('click',async()=>{
  if(!canReset())return;
  if(!window.confirm('Cette action supprimera toutes les entrées, sorties, demandes, échéances, formateurs et historiques. Continuer ?'))return;
  if(!window.confirm('Confirmation finale : souhaitez-vous vraiment réinitialiser toutes les données financières ?'))return;
  try{const result=await api('/api/reset',{method:'POST'});data={...normalizeFinance(result.finance),user:data.user};save();lastServerState=financialSnapshot();renderAll();toast('Données financières réinitialisées.');}catch(error){toast(error.message);}
});
