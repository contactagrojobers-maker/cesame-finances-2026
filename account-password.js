/* Modification du mot de passe du compte connecté. */
document.querySelector('#passwordForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.currentTarget));
  if (form.password !== form.confirmPassword) {
    toast('Les deux mots de passe ne correspondent pas.');
    return;
  }
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api('/api/account-password', { method: 'PATCH', body: JSON.stringify({ password: form.password }) });
    event.currentTarget.reset();
    toast('Votre mot de passe a été modifié.');
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
  }
});
