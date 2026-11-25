'use strict';
const root = document.documentElement;
function read(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch (error) { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, value); } catch (error) { /* Preferências continuam aplicadas durante esta visita. */ } }
root.dataset.theme = read('coreless-theme', 'dark') === 'light' ? 'light' : 'dark';
root.dataset.contrast = read('coreless-contrast', 'normal');
root.dataset.motion = read('coreless-motion', 'normal');
let scale = Number(read('coreless-font-scale', '1'));
if (!Number.isFinite(scale)) scale = 1;
scale = Math.min(1.2, Math.max(.9, scale));
root.style.setProperty('--font-scale', scale);
const status = document.getElementById('accessPageStatus');
function announce(message) { status.textContent = message; }
function updateButtons() {
  document.getElementById('pageThemeToggle').textContent = root.dataset.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
  const contrast = root.dataset.contrast === 'high';
  const motion = root.dataset.motion === 'reduced';
  const contrastButton = document.getElementById('pageContrastToggle');
  contrastButton.textContent = contrast ? 'Ativado' : 'Desativado';
  contrastButton.setAttribute('aria-pressed', String(contrast));
  const motionButton = document.getElementById('pageMotionToggle');
  motionButton.textContent = motion ? 'Ativado' : 'Desativado';
  motionButton.setAttribute('aria-pressed', String(motion));
}
function setScale(value) {
  scale = Math.min(1.2, Math.max(.9, Number(value.toFixed(2))));
  root.style.setProperty('--font-scale', scale);
  write('coreless-font-scale', String(scale));
  announce(`Tamanho do texto ajustado para ${Math.round(scale * 100)}%.`);
}
document.getElementById('pageThemeToggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  write('coreless-theme', root.dataset.theme);
  updateButtons(); announce(`Tema ${root.dataset.theme === 'light' ? 'claro' : 'escuro'} ativado.`);
});
document.getElementById('pageFontDown').addEventListener('click', () => setScale(scale - .05));
document.getElementById('pageFontUp').addEventListener('click', () => setScale(scale + .05));
document.getElementById('pageFontReset').addEventListener('click', () => setScale(1));
document.getElementById('pageContrastToggle').addEventListener('click', () => {
  root.dataset.contrast = root.dataset.contrast === 'high' ? 'normal' : 'high';
  write('coreless-contrast', root.dataset.contrast); updateButtons();
  announce(`Alto contraste ${root.dataset.contrast === 'high' ? 'ativado' : 'desativado'}.`);
});
document.getElementById('pageMotionToggle').addEventListener('click', () => {
  root.dataset.motion = root.dataset.motion === 'reduced' ? 'normal' : 'reduced';
  write('coreless-motion', root.dataset.motion); updateButtons();
  announce(`Movimento reduzido ${root.dataset.motion === 'reduced' ? 'ativado' : 'desativado'}.`);
});
updateButtons();
