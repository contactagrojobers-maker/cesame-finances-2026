const { admin, send, currentUser } = require('./_lib');
module.exports=async(req,res)=>{
  try {
    const actor=await currentUser(req); if(!actor||actor.role!=='Promoteur') return send(res,403,{error:'Seul le Promoteur peut administrer les comptes.'});
    const db=admin();
    if(req.method==='GET'){const {data,error}=await db.from('profiles').select('id,email,name,role,active,created_at').order('created_at');if(error)throw error;return send(res,200,{users:data});}
    if(req.method==='POST'){
      const {email,password,name,role}=req.body||{};if(!name||/[<>]/.test(String(name))||!email||!password||String(password).length<8||!['Promoteur','Directeur','Scolarité'].includes(role))return send(res,400,{error:'Veuillez compléter correctement tous les champs (mot de passe : 8 caractères minimum).'});
      const {data,error}=await db.auth.admin.createUser({email,password,email_confirm:true});if(error)return send(res,400,{error:error.message});
      const {error:profileError}=await db.from('profiles').insert({id:data.user.id,email:String(email).toLowerCase(),name,role,active:true});if(profileError)throw profileError;
      return send(res,201,{user:{id:data.user.id,email:String(email).toLowerCase(),name,role,active:true}});
    }
    return send(res,405,{error:'Méthode non autorisée.'});
  } catch(error) { return send(res,500,{error:error.message||'Erreur serveur.'}); }
};
