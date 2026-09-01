const { createClient } = require('@supabase/supabase-js');
const NodeWebSocket = require('ws');
const emptyState = { incomes: [], expenses: [], planned: [], teachers: [], audit: [] };

function config() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Configuration Supabase incomplète.');
  return { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY };
}
function admin() { const c=config(); return createClient(c.SUPABASE_URL,c.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false},realtime:{transport:NodeWebSocket}}); }
function anon() { const c=config(); return createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY,{auth:{autoRefreshToken:false,persistSession:false},realtime:{transport:NodeWebSocket}}); }
function send(res,status,body) { res.status(status).json(body); }
async function currentUser(req) {
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,''); if(!token) return null;
  const {data:{user},error}=await anon().auth.getUser(token); if(error||!user) return null;
  const {data:profile}=await admin().from('profiles').select('id,email,name,role,active').eq('id',user.id).maybeSingle();
  return profile&&profile.active ? profile : null;
}
async function state() {
  const db=admin(); const found=await db.from('app_state').select('document').eq('id',1).maybeSingle();
  if(found.error) throw found.error;
  if(found.data) return found.data.document;
  const created=await db.from('app_state').insert({id:1,document:emptyState}).select('document').single(); if(created.error) throw created.error; return created.data.document;
}
module.exports={admin,anon,send,currentUser,state,emptyState};
