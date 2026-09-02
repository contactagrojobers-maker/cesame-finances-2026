const { admin, send, currentUser, state } = require('./_lib');
const canEdit = user => user && ['Promoteur', 'Directeur'].includes(user.role);
module.exports = async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return send(res, 401, { error: 'Session expirée. Veuillez vous reconnecter.' });
    const finance = await state();
    if (req.method === 'GET') return send(res, 200, { forecasts: Array.isArray(finance.forecasts) ? finance.forecasts : [] });
    if (req.method !== 'PUT') return send(res, 405, { error: 'Méthode non autorisée.' });
    if (!canEdit(user)) return send(res, 403, { error: 'Seuls le Promoteur et le Directeur peuvent modifier les prévisions.' });
    const forecasts = req.body && req.body.forecasts;
    if (!Array.isArray(forecasts)) return send(res, 400, { error: 'Prévisions invalides.' });
    finance.forecasts = forecasts.slice(0, 300);
    finance.audit = [{ text: `${user.name} a mis à jour les prévisions financières`, time: new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Douala'}).format(new Date()), timestamp: new Date().toISOString() }, ...(finance.audit || [])].slice(0, 100);
    const { error } = await admin().from('app_state').upsert({ id: 1, document: finance, updated_at: new Date().toISOString(), updated_by: user.id });
    if (error) throw error;
    return send(res, 200, { forecasts: finance.forecasts });
  } catch (error) { return send(res, 500, { error: error.message || 'Enregistrement des prévisions impossible.' }); }
};
