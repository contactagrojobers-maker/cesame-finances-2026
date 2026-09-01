const { admin, send, currentUser } = require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='PATCH')return send(res,405,{error:'Méthode non autorisée.'});
  try {const actor=await currentUser(req);if(!actor||actor.role!=='Promoteur')return send(res,403,{error:'Seul le Promoteur peut administrer les comptes.'});const id=req.query.id;const {name,role,password,active}=req.body||{};const db=admin();
    if(password){const {error}=await db.auth.admin.updateUserById(id,{password});if(error)throw error;}
    const update={};if(name!==undefined)update.name=name;if(role!==undefined)update.role=role;if(active!==undefined)update.active=active;
    if(Object.keys(update).length){const {error}=await db.from('profiles').update(update).eq('id',id);if(error)throw error;}
    return send(res,200,{ok:true});
  }catch(error){return send(res,500,{error:error.message||'Erreur serveur.'});}
};
