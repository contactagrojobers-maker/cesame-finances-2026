const { admin, send, currentUser } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'PATCH') return send(res, 405, { error: 'Méthode non autorisée.' });
  try {
    const user = await currentUser(req);
    if (!user) return send(res, 401, { error: 'Votre session a expiré. Veuillez vous reconnecter.' });
    const { password } = req.body || {};
    if (!password || String(password).length < 8) return send(res, 400, { error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    const { error } = await admin().auth.admin.updateUserById(user.id, { password: String(password) });
    if (error) throw error;
    return send(res, 200, { ok: true });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Modification du mot de passe impossible.' });
  }
};
