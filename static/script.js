// マウス軌跡エフェクト（ピクセルトレイル）
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100vw";  // 表示サイズ
canvas.style.height = "100vh"; // 表示サイズ
canvas.style.pointerEvents = "none";
canvas.style.zIndex = 9999;
resizeCanvas();

let dots = [];

window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("mousemove", (e) => {
  dots.push({ x: e.clientX, y: e.clientY, alpha: 1 });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach(dot => {
    ctx.fillStyle = `rgba(0,0,0,${dot.alpha})`;
    ctx.fillRect(dot.x, dot.y, 2, 2); // 小さなピクセル点
    dot.alpha -= 0.02;
  });
  dots = dots.filter(dot => dot.alpha > 0);
  requestAnimationFrame(animate);
}
animate();


const categoryList = document.getElementById('categoryList');

if (categoryList) {
  // カテゴリクリックでフィルター
  categoryList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const selected = e.target.getAttribute('data-category');
      document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
      e.target.classList.add('active');

      const galleryItems = document.querySelectorAll('.work-item');
      galleryItems.forEach(item => {
        const categoryAttr = item.getAttribute('data-category');
        const categories = categoryAttr ? categoryAttr.split(' ') : [];

        if (selected === 'all' || categories.includes(selected)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  });
}


// モーダル表示処理
// 画像クリックでモーダル表示
// 拡大モーダル

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.getElementById("image-modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // 拡大表示
  document.querySelectorAll(".work-images img").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  // 閉じる
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // モーダル外クリックで閉じる
  modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

});
