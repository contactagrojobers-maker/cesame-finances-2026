/* Navigation latérale utilisable sur téléphone. */
const mobileMenu=document.querySelector('#mobileMenu');
const mobileSidebar=document.querySelector('.sidebar');
const menuBackdrop=document.querySelector('#menuBackdrop');
const closeMobileMenu=()=>{mobileSidebar.classList.remove('mobile-open');menuBackdrop.classList.add('hidden');mobileMenu.setAttribute('aria-expanded','false');};
const openMobileMenu=()=>{mobileSidebar.classList.add('mobile-open');menuBackdrop.classList.remove('hidden');mobileMenu.setAttribute('aria-expanded','true');};
mobileMenu.addEventListener('click',()=>mobileSidebar.classList.contains('mobile-open')?closeMobileMenu():openMobileMenu());
menuBackdrop.addEventListener('click',closeMobileMenu);
document.querySelector('#nav').addEventListener('click',()=>{if(window.innerWidth<=700)closeMobileMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>700)closeMobileMenu();});
