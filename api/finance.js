const { admin, send, currentUser, state } = require('./_lib');
module.exports=async(req,res)=>{
  try {
    const user=await currentUser(req); if(!user) return send(res,401,{error:'Session expirée. Veuillez vous reconnecter.'});
    if(req.method==='GET'){const finance=await state();if(!['Promoteur','Directeur'].includes(user.role))delete finance.permanentStaff;return send(res,200,{finance,user});}
    if(req.method!=='PUT') return send(res,405,{error:'Méthode non autorisée.'});
    const finance=req.body&&req.body.finance;
    if(!finance || !Array.isArray(finance.incomes)||!Array.isArray(finance.expenses)||!Array.isArray(finance.planned)||!Array.isArray(finance.teachers)) return send(res,400,{error:'Données financières invalides.'});
    const existing=await state(); finance.permanentStaff=existing.permanentStaff||[]; finance.audit=(finance.audit||[]).slice(0,100);
    const {error}=await admin().from('app_state').upsert({id:1,document:finance,updated_at:new Date().toISOString(),updated_by:user.id}); if(error) throw error;
    return send(res,200,{finance});
  } catch(error) { return send(res,500,{error:error.message||'Erreur serveur.'}); }
};
