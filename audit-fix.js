/* Horodatage et contexte d'appareil dans l'historique. */
const auditTime=()=>new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short'}).format(new Date());
const previousAddAudit=addAudit;addAudit=function(text){data.audit.unshift({text,time:auditTime(),timestamp:new Date().toISOString()});save();};
renderAudit=function(){document.querySelector('#auditList').innerHTML=(data.audit||[]).map(item=>`<div class="audit-item">${escape(item.text)}${item.device?` <span class="audit-device">${escape(item.device)}</span>`:''}<small>${escape(item.time||auditTime())}</small></div>`).join('')||'<p class="muted">Aucune action enregistrée.</p>';};
