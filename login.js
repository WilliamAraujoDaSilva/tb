'use strict';
const loginPageForm = document.getElementById('loginPageForm');
loginPageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!loginPageForm.checkValidity()) {
    loginPageForm.classList.add('was-validated');
    return;
  }
  const email = document.getElementById('pageEmail').value.trim();
  const displayName = email.split('@')[0] || 'visitante';
  try { localStorage.setItem('coreless-demo-user', displayName); } catch (error) { /* O formulário continua válido sem armazenamento local. */ }
  document.getElementById('loginPageStatus').textContent = `Demonstração iniciada para ${displayName}. Nenhuma senha foi salva ou enviada. Volte à página inicial para continuar.`;
  loginPageForm.reset();
  loginPageForm.classList.remove('was-validated');
});
