// Mobile drawer
const openBtn=document.querySelector("[data-open-drawer]");
const closeBtn=document.querySelector("[data-close-drawer]");
const drawer=document.querySelector("[data-drawer]");
const backdrop=document.querySelector("[data-backdrop]");

if(openBtn){
  openBtn.onclick=()=>{
    drawer.classList.add("open");
    backdrop.classList.add("show");
    document.body.style.overflow="hidden";
  };
}
[closeBtn,backdrop].forEach(el=>{
  if(!el)return;
  el.onclick=()=>{
    drawer.classList.remove("open");
    backdrop.classList.remove("show");
    document.body.style.overflow="";
  };
});
