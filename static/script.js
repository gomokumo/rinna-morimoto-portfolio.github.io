document.addEventListener("DOMContentLoaded", () => {

  // 🖱️ マウス軌跡
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 9999;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let dots = [];
  let lastPos = null;
  let trailPaused = false; // ← animateより前に宣言

  window.addEventListener("mousemove", (e) => {
    if (lastPos) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const step = 3;
      for (let i=0; i<dist; i+=step) {
        const x = lastPos.x + (dx*i)/dist;
        const y = lastPos.y + (dy*i)/dist;
        dots.push({x, y, alpha:1});
      }
    }
    lastPos = {x:e.clientX, y:e.clientY};
  });

  function animate() {
    if (!trailPaused) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      dots.forEach(dot=>{
        ctx.fillStyle = `rgba(150,150,150,${dot.alpha})`;
        ctx.fillRect(dot.x,dot.y,2,2);
        dot.alpha -= 0.04;
      });
      dots = dots.filter(dot=>dot.alpha>0);
    }
    requestAnimationFrame(animate);
  }
  animate();

  // 📁 モーダル
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.getElementById("image-modal-close");
  const modalPrev = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");
  const images = Array.from(document.querySelectorAll(".work-images img, .work-images-2 img, .work-images-3 img"));

  let currentIndex = -1;

  images.forEach((img,index)=>{
    img.addEventListener("click",()=>{
      modal.style.display="flex";
      modalImg.src = img.src;
      currentIndex = index;
      //trailPaused = true;  モーダル開いたら停止
    });
  });

  if(closeBtn) closeBtn.addEventListener("click", ()=>{
    modal.style.display="none";
    trailPaused=false; // モーダル閉じたら再開
  });

  modal.addEventListener("click",(e)=>{
    if(e.target===modal){
      modal.style.display="none";
      trailPaused=false;
    }
  });

  function showImage(index){
    if(index<0) index=images.length-1;
    if(index>=images.length) index=0;
    currentIndex=index;
    modalImg.src=images[currentIndex].src;
  }

  if(modalPrev) modalPrev.addEventListener("click",(e)=>{ e.stopPropagation(); showImage(currentIndex-1); });
  if(modalNext) modalNext.addEventListener("click",(e)=>{ e.stopPropagation(); showImage(currentIndex+1); });

  // 🗂️ カテゴリ
  const categoryList = document.querySelectorAll("#categoryList li");
  const categorySelect = document.getElementById("categorySelect");
  const workItems = document.querySelectorAll(".work-item");

  function filterWorks(category){
    workItems.forEach(item=>{
      const categories = item.dataset.category ? item.dataset.category.split(" ") : [];
      item.style.display = category==="all" || categories.includes(category) ? "block" : "none";
    });
  }

  categoryList.forEach(li=>{
    li.addEventListener("click",()=>{
      document.querySelector("#categoryList li.active")?.classList.remove("active");
      li.classList.add("active");
      filterWorks(li.dataset.category);
    });
  });

  if(categorySelect) categorySelect.addEventListener("change",(e)=> filterWorks(e.target.value));

});