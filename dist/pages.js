const sitePages={
product:{file:'product.html',sections:['product'],title:['Product · SSO UofA','المنتج · المنظمة']},
checkout:{file:'checkout.html',sections:['checkout'],title:['Checkout · SSO UofA','الحقيبة · منظمة الطلاب السودانيين']},
volunteer:{file:'volunteer.html',sections:['volunteer'],title:['Volunteer with SSO','تطوع مع المنظمة']},
contact:{file:'contact.html',sections:['contact'],title:['Contact · SSO UofA','تواصل · منظمة الطلاب السودانيين']},
guide:{file:'guide.html',sections:['guide'],title:['New to UAlberta · SSO','جديد في الجامعة · المنظمة']},
gallery:{file:'gallery.html',sections:['gallery'],title:['Community gallery · SSO','صور المجتمع · المنظمة']},
manage:{file:'manage.html',sections:['manage'],title:['Editor demo · SSO','تجربة التحرير · المنظمة']},
home:{file:'index.html',sections:['hero','about','join','newsletter','faq'],title:['SSO UofA · A little Sudan on campus','منظمة الطلاب السودانيين · جامعة ألبرتا']},
events:{file:'events.html',sections:['events','calendar'],title:['Events & calendar · SSO UofA','الفعاليات والتقويم · منظمة الطلاب السودانيين']},
merch:{file:'merch.html',sections:['merch'],title:['Merch collection · SSO UofA','المنتجات · منظمة الطلاب السودانيين']},
team:{file:'team.html',sections:['team'],title:['Our team · SSO UofA','فريقنا · منظمة الطلاب السودانيين']},
resources:{file:'resources.html',sections:['prayer','resources'],title:['Student resources · SSO UofA','موارد الطلاب · منظمة الطلاب السودانيين']}
};
const sectionPages={product:'product',checkout:'checkout',volunteer:'volunteer',contact:'contact',guide:'guide',gallery:'gallery',manage:'manage',main:'home',about:'home',join:'home',faq:'home',newsletter:'home',events:'events',calendar:'events',merch:'merch',team:'team',prayer:'resources',resources:'resources'};
function pageFromPath(path){const leaf=path.replace(/\/+$/,'').split('/').pop().replace(/\.html$/,'');return Object.hasOwn(sitePages,leaf)?leaf:'home'}
let currentSitePage=pageFromPath(location.pathname);
function sectionURL(id){const page=sectionPages[id]||'home';return (page==='home'?'/sso-uofa/':'/sso-uofa/'+sitePages[page].file)+'#'+id}
function routeLegacyHash(){const section=location.hash.slice(1),page=sectionPages[section];if(currentSitePage==='home'&&page&&page!=='home'){location.replace(sectionURL(section));return true}return false}
routeLegacyHash();
function applySitePage(){document.body.dataset.page=currentSitePage;document.title=sitePages[currentSitePage].title[lang==='ar'?1:0];const allowed=sitePages[currentSitePage].sections;document.querySelectorAll('main>section').forEach(s=>{const key=s.id||(s.classList.contains('hero')?'hero':'');s.hidden=!allowed.includes(key)});
document.querySelector('.ticker').hidden=currentSitePage!=='home';
if(currentSitePage!=='home'){const heading=document.querySelector('main>section:not([hidden]) h2');if(heading){const h=document.createElement('h1');h.innerHTML=heading.innerHTML;h.id=heading.id;h.className='page-heading';heading.replaceWith(h)}}
document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute('href').slice(1);if(sectionPages[id])a.href=sectionURL(id)});
document.querySelectorAll('.navlinks>a:not(.button)').forEach(a=>{const url=new URL(a.href),target=pageFromPath(url.pathname);a.href=target==='home'?'/sso-uofa/':'/sso-uofa/'+sitePages[target].file;if(target===currentSitePage)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
