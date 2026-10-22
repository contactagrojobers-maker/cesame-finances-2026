/* Lecture rapide des postes de dépenses : aucune donnée financière n'est modifiée. */
(() => {
  function renderExpenseAnalytics(){
    const target=document.querySelector('#expenseAnalytics');
    if(!target)return;
    const paid=(data.expenses||[]).filter(item=>['payée','validée'].includes(item.status));
    const total=paid.reduce((sum,item)=>sum+Number(item.amount||0),0);
    const groups={};
    paid.forEach(item=>{const category=item.category||'Autre';groups[category]=(groups[category]||0)+Number(item.amount||0);});
    const ordered=Object.entries(groups).sort((a,b)=>b[1]-a[1]);
    const [topCategory,topAmount]=ordered[0]||['—',0];
    const share=total?Math.round(topAmount/total*100):0;
    const advice=!total?'Enregistrez des sorties payées pour obtenir une analyse.'
      :share>=50?`Le poste « ${topCategory} » représente ${share}% des sorties. Vérifiez les devis, fournisseurs et dépenses non indispensables avant tout nouvel engagement.`
      :`Les dépenses sont réparties entre plusieurs postes. Suivez chaque catégorie et fixez un plafond mensuel pour les catégories les plus élevées.`;
    const maximum=Math.max(...ordered.map(([,amount])=>amount),1);
    target.innerHTML=`<div class="expense-analytics"><article class="panel"><div class="expense-kpis"><div><span>Total des sorties payées</span><strong class="amount-expense">${money(total)}</strong></div><div><span>Poste le plus coûteux</span><strong>${escape(topCategory)}</strong><small>${money(topAmount)} · ${share}%</small></div><div><span>Nombre de sorties</span><strong>${paid.length}</strong></div></div></article><article class="panel"><h3>Répartition et piste de maîtrise</h3>${ordered.length?`<div class="breakdown">${ordered.map(([category,amount])=>`<div class="break-row"><span>${escape(category)} · ${total?Math.round(amount/total*100):0}%</span><div class="progress"><i style="width:${amount/maximum*100}%"></i></div><strong>${money(amount)}</strong></div>`).join('')}</div>`:'<p class="muted">Aucune sortie payée pour le moment.</p>'}<p class="expense-advice">${advice}</p></article></div>`;
  }
  const previousRenderAll=renderAll;
  renderAll=function(){previousRenderAll();renderExpenseAnalytics();};
})();
