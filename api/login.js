const { anon, admin, state, send } = require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='POST') return send(res,405,{error:'Méthode non autorisée.'});
  try {
    const {email,password}=req.body||{};
    const {data,error}=await anon().auth.signInWithPassword({email,password}); if(error||!data.session) return send(res,401,{error:'Adresse e-mail ou mot de passe incorrect.'});
    const {data:profile,error:profileError}=await admin().from('profiles').select('id,email,name,role,active').eq('id',data.user.id).single();
    if(profileError||!profile.active) return send(res,403,{error:'Ce compte n’est pas autorisé à accéder à l’application.'});
    const finance=await state();const userAgent=req.headers['user-agent']||'';const device=/mobile|android|iphone|ipad/i.test(userAgent)?'Téléphone / tablette':'Ordinateur';const time=new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Douala'}).format(new Date());finance.audit=[{text:`${profile.name} s’est connecté`,time,device,timestamp:new Date().toISOString()},...(finance.audit||[])].slice(0,100);const saved=await admin().from('app_state').upsert({id:1,document:finance,updated_at:new Date().toISOString(),updated_by:profile.id});if(saved.error)throw saved.error;return send(res,200,{token:data.session.access_token,user:profile,finance});
  } catch(error) { return send(res,500,{error:error.message||'Erreur serveur.'}); }
};
