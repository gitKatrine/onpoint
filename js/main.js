// Перемещения/навигация
const $main = document.querySelector(".main");
const $btnNext = document.querySelector(".btn.next-page");
const $btnHomepage = document.querySelector(".homepage");
const $btnCloseModal = document.querySelector(".benefits-modal .close-btn");

//анимируемый элемент
const $bgSperm = document.querySelector(".page-2__bg-sperm");
//определение количества страниц на сайте
const numOfPages = $main.children.length;
$main.style.setProperty("--n", numOfPages);

let x0 = null; //координата начала свайпа
let i = 0; //текущая страница
let w = 1024; //размер экрана
//фукнции для перелистывания страниц
function unify(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}
function move(e) {
  if (!isOpenModal) {
    let dx = unify(e).clientX - x0,
      s = Math.sign(dx),
      f = +((s * dx) / w).toFixed(2);
    if ((i > 0 || s < 0) && (i < numOfPages - 1 || s > 0) && f > 0.2) {
      if (x0 || x0 === 0) {
        (dx = unify(e).clientX - x0), (s = Math.sign(dx));
        if ((i > 0 || s < 0) && (i < numOfPages - 1 || s > 0)) {
          $main.style.setProperty("--i", (i -= s));
        }
        if (i == 1) {
          $bgSperm.classList.add("animated");
        }
        x0 = null;
      }
    }
  }
}
function lock(e) {
  x0 = unify(e).clientX;
}
//навигация по страницам
$main.addEventListener("touchstart", lock, false);
$main.addEventListener("touchend", move, false);
$btnNext.onclick = function () {
  $main.style.setProperty("--i", ++i);
};
$btnHomepage.onclick = function () {
  if (!isOpenModal) {
    $main.style.setProperty("--i", (i = 0));
  }
};

// Модальное окно
const $modal = document.querySelector(".benefits-modal");
const $btnShowMore = document.querySelector(".btn.show-more");
const $modalTitle = document.querySelector(".page-3 .title");
const $benefitsList = document.querySelector(".benefits-list");
const $arrowNext = document.querySelector(".arrow-next");
const $arrowPrev = document.querySelector(".arrow-prev");
const $dots = document.querySelectorAll(".dot");
const modalTitle = "преимущества";
const pageTitle = document.querySelector(".page-3 .title").innerHTML;
let isOpenModal = false; //флаг открытия модального окна
let listWidth;
let numOfColumns;
//эвент на открытие модального окна
$btnShowMore.onclick = function () {
  $modal.style.display = "block";
  $modalTitle.innerHTML = modalTitle;
  setTimeout(() => {
    $modal.style.opacity = "1";
  }, 0);
  isOpenModal = true;
  //инициализируем размеры содежимого
  listWidth = $benefitsList.scrollWidth;
  numOfColumns = listWidth / 500;
};
//эвент на закрытие модального окна
$btnCloseModal.onclick = function (event) {
  $modalTitle.innerHTML = pageTitle;
  $modal.style.display = "none";
  $modal.style.opacity = "0";
  isOpenModal = false;
};
let currentColumn = 1;
$arrowNext.onclick = function () {
  if (currentColumn < numOfColumns) {
    $benefitsList.style.opacity = "0";
    setTimeout(() => {
      $benefitsList.style.opacity = "1";
      $benefitsList.style.transform = `translateX(${
        -500 * (currentColumn - 1)
      }px)`;
    }, 300);
    $dots[currentColumn - 1].classList.remove("dot-active");
    $dots[currentColumn].classList.add("dot-active");
    currentColumn++;
  }
};
$arrowPrev.onclick = function () {
  if (currentColumn > 1) {
    $benefitsList.style.opacity = "0";
    setTimeout(() => {
      $benefitsList.style.opacity = "1";
      $benefitsList.style.transform = `translateX(${
        listWidth - 500 * (currentColumn + 1)
      }px)`;
    }, 300);
    $dots[currentColumn - 1].classList.remove("dot-active");
    $dots[currentColumn - 2].classList.add("dot-active");
    currentColumn--;
  }
};

// Скорллбар
const $thumb = document.querySelector(".thumb");
const $scrollbar = document.querySelector(".scrollbar");
const $textBlock = document.querySelector(".text-block");
const $scrollableText = document.querySelector(".text-block__scrollable-part");
const scrollbarBottomEdge = $scrollbar.offsetHeight - $thumb.offsetHeight;
const textBlockBottomEdge =
  $scrollableText.offsetHeight - $textBlock.offsetHeight + 60;
let dragging = false;
let startY = 0;
let percent = 0;
$thumb.addEventListener("touchstart", (e) => {
  dragging = true;

  const style = window.getComputedStyle($thumb);
  const translateY = parseInt(style.getPropertyValue("--y"));
  startY = Math.ceil(e.touches[0].pageY - translateY);
});

document.body.addEventListener("touchend", () => {
  dragging = false;
});

document.body.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  if (
    e.touches[0].pageY - startY >= 0 &&
    e.touches[0].pageY - startY <= scrollbarBottomEdge
  ) {
    percent = (e.touches[0].pageY - startY) / scrollbarBottomEdge;
    $thumb.style.setProperty("--y", `${e.touches[0].pageY - startY}px`);
    $scrollableText.style.setProperty(
      "--y",
      `${-textBlockBottomEdge * percent}px`
    );
  }
});
