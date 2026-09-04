/* Menu volontairement simplifie pour la Scolarite. */
const scolariteHiddenMenu=['#permanentStaffNav','#usersNav','[data-page="teachers"]','[data-page="forecasts"]','[data-page="audit"]','[data-page="account"]'];
const scolariteAllowedPages=['dashboard','incomes','expenses','requests','planned','reports'];
function applyScolariteMenu(){const isScolarite=data.user&&data.user.role==='Scolarité';scolariteHiddenMenu.forEach(selector=>document.querySelectorAll(selector).forEach(item=>item.classList.toggle('hidden',isScolarite)));}
const scolariteRenderAll=renderAll;renderAll=function(){scolariteRenderAll();applyScolariteMenu();};
const protectedSetPage=setPage;setPage=function(page){if(data.user&&data.user.role==='Scolarité'&&!scolariteAllowedPages.includes(page))return protectedSetPage('dashboard');return protectedSetPage(page);};
