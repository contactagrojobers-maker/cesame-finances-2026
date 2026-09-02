const { admin, send, currentUser, state } = require('./_lib');
const allowed = user => user && ['Promoteur', 'Directeur'].includes(user.role);
module.exports = async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!allowed(user)) return send(res, 403, { error: 'Cet espace est réservé au Promoteur et au Directeur.' });
    const finance = await state();
    if (req.method === 'GET') return send(res, 200, { staff: Array.isArray(finance.permanentStaff) ? finance.permanentStaff : [] });
    if (req.method !== 'PUT') return send(res, 405, { error: 'Méthode non autorisée.' });
    const staff = req.body && req.body.staff;
    if (!Array.isArray(staff)) return send(res, 400, { error: 'Données du personnel invalides.' });
    finance.permanentStaff = staff.slice(0, 50);
    finance.audit = [{ text: `${user.name} a mis à jour le suivi du personnel permanent`, time: new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Douala'}).format(new Date()), timestamp: new Date().toISOString() }, ...(finance.audit || [])].slice(0, 100);
    const { error } = await admin().from('app_state').upsert({ id: 1, document: finance, updated_at: new Date().toISOString(), updated_by: user.id });
    if (error) throw error;
    return send(res, 200, { staff: finance.permanentStaff });
  } catch (error) { return send(res, 500, { error: error.message || 'Enregistrement impossible.' }); }
};
