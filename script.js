const chapters = {
  sports: {
    folder: "Sports",
    label: "खेल और हौसला",
    files: [
      "20260612093456_003.jpg.jpeg",
      "IMG-20250518-WA0008.jpg",
      "IMG-20250518-WA0019.jpg",
      "IMG-20250518-WA0020.jpg",
    ],
  },
  school: {
    folder: "School",
    label: "शिक्षा और बच्चे",
    files: [
      "Aqua_Power_HD_20161108_111808.jpg",
      "Aqua_Power_HD_20161108_111853.jpg",
      "IMG-20181202-WA0022.jpg",
      "IMG_20180825_084958.jpg",
      "IMG_20180825_100024.jpg",
      "IMG_20180825_104159.jpg",
      "IMG_20180830_110909.jpg",
      "IMG_20181016_122853.jpg",
      "IMG_20181224_110604.jpg",
      "IMG_20190126_092756.jpg",
      "IMG_20191126_164648.jpg",
      "IMG_20200104_090012.jpg",
      "IMG_20200104_093230.jpg",
      "IMG_20250220_173041840_HDR_AE.jpg",
      "IMG_20250220_173043608_HDR_AE.jpg",
      "IMG_20250220_173104531_HDR_AE.jpg",
      "IMG_20250220_173133996_HDR_AE.jpg",
    ],
  },
  awwa: {
    folder: "fwc",
    label: "AWWA और फौजी परिवार",
    files: [
      "20220730_171104.jpg",
      "20230808_173958.jpg",
      "20230808_174003.jpg",
      "Aqua_Power_HD_20170830_164429.jpg",
      "Aqua_Power_HD_20170830_164452.jpg",
      "Aqua_Power_HD_20180512_172322.jpg",
      "Aqua_Power_HD_20180512_173435.jpg",
      "DSC01274.JPG",
      "DSC01275.JPG",
      "DSC01278.JPG",
      "DSC01309.JPG",
      "DSC_0020.JPG",
      "DSC_0068.JPG",
      "DSC_0125.JPG",
      "DSC_0229.JPG",
      "IMG-20231019-WA0057.jpg",
      "IMG-20240114-WA0016.jpg",
      "IMG-20240114-WA0022.jpg",
      "IMG-20241006-WA0046.jpg",
      "IMG-20241006-WA0050.jpg",
      "IMG-20241126-WA0003.jpg",
      "IMG-20241126-WA0006.jpg",
      "IMG_20180920_151537.jpg",
      "IMG_20191128_095532.jpg",
    ],
  },
  achievement: {
    folder: "certificate",
    label: "मेहनत की पहचान",
    files: [
      "20260604131637_001.jpg",
      "20260604131637_002.jpg",
      "20260604131637_003.jpg",
      "20260604131637_004.jpg",
      "20260604131637_005.jpg",
      "20260604131637_006.jpg",
      "20260604131637_007.jpg",
      "20260604131637_008.jpg",
      "20260604131637_009.jpg",
      "20260604131637_010.jpg",
      "20260604131637_011.jpg",
      "20260604131637_012.jpg",
      "20260604131637_013.jpg",
      "20260604131637_014.jpg",
      "20260604131637_015.jpg",
      "20260604131637_017.jpg",
      "20260604131637_019.jpg",
      "IMG-20260328-WA0010.jpg",
    ],
  },
  father: {
    folder: "Papa Cancer",
    label: "पापा की यादें",
    files: [
      "IMG_20191202_104431.jpg",
      "IMG_20241112_223104341_AE.jpg",
      "IMG_20241112_223350303_AE.jpg",
    ],
  },
};

const photos = Object.entries(chapters).flatMap(([category, chapter]) =>
  chapter.files.map((file) => ({
    category,
    label: chapter.label,
    src: encodeURI(`assets/${chapter.folder}/${file}`),
  })),
);

const grid = document.querySelector("#photo-grid");
const loadMore = document.querySelector("#load-more");
const filters = [...document.querySelectorAll(".filter")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxViewport = document.querySelector(".lightbox-viewport");
const lightboxTrack = document.querySelector(".lightbox-track");
const lightboxSlides = [...document.querySelectorAll(".lightbox-slide")];

let activeFilter = "all";
let visibleCount = 18;
let visiblePhotos = [];
let lightboxIndex = 0;
let pageScrollPosition = 0;
let lightboxAnimating = false;
let swipePointerId = null;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeOffset = 0;
let swipeHorizontal = false;

function renderGallery() {
  const filtered =
    activeFilter === "all"
      ? photos
      : photos.filter((photo) => photo.category === activeFilter);

  visiblePhotos = filtered.slice(0, visibleCount);
  grid.replaceChildren(
    ...visiblePhotos.map((photo, index) => {
      const button = document.createElement("button");
      const image = document.createElement("img");

      button.type = "button";
      button.className = "gallery-item";
      button.dataset.label = photo.label;
      button.setAttribute("aria-label", `${photo.label} की तस्वीर खोलें`);
      button.addEventListener("click", () => openLightbox(index));

      image.src = photo.src;
      image.alt = photo.label;
      image.loading = index < 8 ? "eager" : "lazy";
      image.decoding = "async";

      button.append(image);
      return button;
    }),
  );

  loadMore.hidden = visibleCount >= filtered.length;
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  pageScrollPosition = window.scrollY;
  document.body.style.top = `-${pageScrollPosition}px`;
  document.body.classList.add("lightbox-open");
  lightbox.showModal();
  lightbox.scrollTop = 0;
}

function updateLightbox() {
  const indexes = [
    (lightboxIndex - 1 + visiblePhotos.length) % visiblePhotos.length,
    lightboxIndex,
    (lightboxIndex + 1) % visiblePhotos.length,
  ];

  lightboxSlides.forEach((slide, slideIndex) => {
    const photo = visiblePhotos[indexes[slideIndex]];
    const image = slide.querySelector("img");
    const caption = slide.querySelector("figcaption");

    image.src = photo.src;
    image.alt = slideIndex === 1 ? photo.label : "";
    caption.textContent = photo.label;
  });

  lightboxImage.alt = visiblePhotos[lightboxIndex].label;
  lightboxCaption.textContent = visiblePhotos[lightboxIndex].label;
}

function moveLightbox(direction) {
  if (lightboxAnimating || visiblePhotos.length < 2) return;

  lightboxAnimating = true;
  lightboxTrack.classList.add("is-animating");
  lightboxTrack.style.transform =
    direction > 0
      ? "translate3d(-66.666667%, 0, 0)"
      : "translate3d(0, 0, 0)";

  lightboxTrack.addEventListener(
    "transitionend",
    () => {
      lightboxIndex =
        (lightboxIndex + direction + visiblePhotos.length) %
        visiblePhotos.length;
      lightboxTrack.classList.remove("is-animating");
      lightboxTrack.style.transform = "translate3d(-33.333333%, 0, 0)";
      updateLightbox();
      lightboxAnimating = false;
    },
    { once: true },
  );
}

lightboxViewport.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" || lightboxAnimating) return;
  swipePointerId = event.pointerId;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swipeOffset = 0;
  swipeHorizontal = false;
  lightboxViewport.setPointerCapture(event.pointerId);
});

lightboxViewport.addEventListener("pointermove", (event) => {
  if (event.pointerId !== swipePointerId) return;

  const distanceX = event.clientX - swipeStartX;
  const distanceY = event.clientY - swipeStartY;
  if (!swipeHorizontal && Math.abs(distanceX) < 8) return;
  if (!swipeHorizontal && Math.abs(distanceY) > Math.abs(distanceX)) return;

  swipeHorizontal = true;
  swipeOffset = distanceX;
  lightboxViewport.classList.add("is-dragging");
  lightboxTrack.style.transform = `translate3d(calc(-33.333333% + ${distanceX}px), 0, 0)`;
});

function finishSwipe(event) {
  if (event.pointerId !== swipePointerId) return;

  lightboxViewport.classList.remove("is-dragging");
  swipePointerId = null;

  const threshold = Math.min(lightboxViewport.clientWidth * 0.18, 90);
  if (swipeHorizontal && Math.abs(swipeOffset) >= threshold) {
    moveLightbox(swipeOffset < 0 ? 1 : -1);
    return;
  }

  lightboxTrack.classList.add("is-animating");
  lightboxTrack.style.transform = "translate3d(-33.333333%, 0, 0)";
  lightboxTrack.addEventListener(
    "transitionend",
    () => lightboxTrack.classList.remove("is-animating"),
    { once: true },
  );
}

lightboxViewport.addEventListener("pointerup", finishSwipe);
lightboxViewport.addEventListener("pointercancel", finishSwipe);

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");
    activeFilter = filter.dataset.filter;
    visibleCount = 18;
    renderGallery();
  });
});

loadMore.addEventListener("click", () => {
  visibleCount += 18;
  renderGallery();
});

document
  .querySelector(".lightbox-close")
  .addEventListener("click", () => lightbox.close());
document
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => moveLightbox(-1));
document
  .querySelector(".lightbox-next")
  .addEventListener("click", () => moveLightbox(1));

lightbox.addEventListener("close", () => {
  lightboxAnimating = false;
  swipePointerId = null;
  lightboxViewport.classList.remove("is-dragging");
  lightboxTrack.classList.remove("is-animating");
  lightboxTrack.style.transform = "translate3d(-33.333333%, 0, 0)";
  document.body.classList.remove("lightbox-open");
  document.body.style.top = "";
  window.scrollTo(0, pageScrollPosition);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

renderGallery();
