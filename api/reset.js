const { admin, send, currentUser, emptyState } = require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return send(res,405,{error:'Méthode non autorisée.'});
  try{
    const user=await currentUser(req);if(!user||!['Promoteur','Directeur'].includes(user.role))return send(res,403,{error:'Seuls le Promoteur et le Directeur peuvent réinitialiser les données.'});
    const {error}=await admin().from('app_state').upsert({id:1,document:emptyState,updated_at:new Date().toISOString(),updated_by:user.id});if(error)throw error;
    return send(res,200,{finance:emptyState});
  }catch(error){return send(res,500,{error:error.message||'Réinitialisation impossible.'});}
};
