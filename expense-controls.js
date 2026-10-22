/* Catégories personnalisées pour les sorties. */
(() => {
  const baseFields=fields;
  fields=function(type){
    const html=baseFields(type);
    if(type!=='expense')return html;
    return html.replace('</div>','<label class="wide">Nouvelle catégorie (facultatif)<input name="customCategory" placeholder="Ex. Communication, Transport, Sécurité…" /></label></div>');
  };
  document.querySelector('#operationForm').addEventListener('submit',event=>{
    if(currentType!=='expense')return;
    const custom=event.currentTarget.querySelector('[name="customCategory"]')?.value.trim();
    if(!custom)return;
    const select=event.currentTarget.querySelector('[name="category"]');
    select.insertAdjacentHTML('beforeend',`<option value="${escape(custom)}">${escape(custom)}</option>`);
    select.value=custom;
  },true);
})();
