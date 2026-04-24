// MODZ GARAGE Main Script
// Core logic: inventory, filters, modal, wishlist, recently viewed, configurator, 3D, UI/UX

// ========== CAR DATA ==========
const carData = [
  {
    name: "Audi RS5",
    brand: "Audi",
    price: 65000,
    img: "audi rs5.jpg",
    model: "m4 model.glb", // Placeholder, use same model for demo
    specs: ["450 HP", "AWD", "0-100km/h: 3.9s"]
  },
  {
    name: "BMW M4 Competition",
    brand: "BMW",
    price: 72000,
    img: "bmw m4 comp.jpg",
    model: "m4 model.glb",
    specs: ["510 HP", "RWD", "0-100km/h: 3.8s"]
  },
  {
    name: "Chevrolet Camaro",
    brand: "Chevrolet",
    price: 54000,
    img: "chevrolet camaro.webp",
    model: "m4 model.glb",
    specs: ["455 HP", "RWD", "0-100km/h: 4.0s"]
  },
  {
    name: "Ford Mustang",
    brand: "Ford",
    price: 57000,
    img: "ford mustang.jpg",
    model: "m4 model.glb",
    specs: ["450 HP", "RWD", "0-100km/h: 4.2s"]
  },
  {
    name: "Honda Civic",
    brand: "Honda",
    price: 32000,
    img: "honda civic.jpg",
    model: "m4 model.glb",
    specs: ["180 HP", "FWD", "0-100km/h: 7.8s"]
  },
  {
    name: "Mercedes C63",
    brand: "Mercedes",
    price: 69000,
    img: "mercedes c63.jpg",
    model: "m4 model.glb",
    specs: ["503 HP", "RWD", "0-100km/h: 3.9s"]
  },
  {
    name: "Nissan GTR",
    brand: "Nissan",
    price: 88000,
    img: "nissan gtr.webp",
    model: "m4 model.glb",
    specs: ["565 HP", "AWD", "0-100km/h: 2.9s"]
  },
  {
    name: "Toyota Supra",
    brand: "Toyota",
    price: 61000,
    img: "toyota supra.jpg",
    model: "m4 model.glb",
    specs: ["382 HP", "RWD", "0-100km/h: 4.1s"]
  }
];

// ========== GLOBAL STATE ==========
let filteredCars = [...carData];
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
let selectedCar = null;
let currentMods = {};
let modPrices = {};
let basePrice = 0;

// ========== DOM ELEMENTS ==========
const hero = document.getElementById("hero");
const browseBtn = document.getElementById("browseBtn");
const scrollIndicator = document.querySelector(".scroll-indicator");
const inventory = document.getElementById("inventory");
const carGrid = document.getElementById("carGrid");
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");

const carModal = document.getElementById("carModal");
const modalCarImg = document.getElementById("modalCarImg");
const modalCarName = document.getElementById("modalCarName");
const modalCarBrand = document.getElementById("modalCarBrand");
const modalCarPrice = document.getElementById("modalCarPrice");
const modalSpecs = document.getElementById("modalSpecs");
const wishlistBtn = document.getElementById("wishlistBtn");
const customizeBtn = document.getElementById("customizeBtn");

const configurator = document.getElementById("configurator");
const threeContainer = document.getElementById("threeContainer");
const modOptions = document.getElementById("modOptions");
const basePriceEl = document.getElementById("basePrice");
const modsPriceEl = document.getElementById("modsPrice");
const totalPriceEl = document.getElementById("totalPrice");
const resetBuildBtn = document.getElementById("resetBuild");
const randomBuildBtn = document.getElementById("randomBuild");
const shareBuildBtn = document.getElementById("shareBuild");
const checkoutBtn = document.getElementById("checkoutBtn");
const modRecommendations = document.getElementById("modRecommendations");

const wishlistSection = document.getElementById("wishlistSection");
const wishlistGrid = document.getElementById("wishlistGrid");
const recentSection = document.getElementById("recentSection");
const recentGrid = document.getElementById("recentGrid");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutSummary = document.getElementById("checkoutSummary");
const confirmOrder = document.getElementById("confirmOrder");

const confettiCanvas = document.getElementById("confettiCanvas");

// ========== INIT ==========
window.addEventListener("DOMContentLoaded", () => {
  setupHero();
  setupInventory();
  setupFilters();
  setupBrandFilter();
  setupModal();
  setupWishlist();
  setupRecentlyViewed();
  setupConfigurator();
  setupCheckout();
  animateHero();
});

// ========== HERO SECTION ==========
function setupHero() {
  browseBtn.addEventListener("click", () => {
    hero.classList.add("hidden");
    inventory.classList.remove("hidden");
    window.scrollTo({ top: inventory.offsetTop, behavior: "smooth" });
  });
  scrollIndicator.addEventListener("click", () => {
    browseBtn.click();
  });
}

// ========== INVENTORY ==========
function setupInventory() {
  renderCarGrid(filteredCars);
}

function renderCarGrid(cars) {
  carGrid.innerHTML = "";
  if (!cars.length) {
    carGrid.innerHTML = `<div style="color:var(--neon-magenta);font-size:1.2em;">No cars found.</div>`;
    return;
  }
  cars.forEach((car, idx) => {
    const card = document.createElement("div");
    card.className = "car-card glass";
    card.innerHTML = `
      <img src="${car.img}" alt="${car.name}" class="car-img" loading="lazy"/>
      <div class="car-info">
        <div class="car-name">${car.name}</div>
        <div class="car-price">$${car.price.toLocaleString()}</div>
        <button class="view-btn neon-cyan" data-idx="${idx}">View</button>
      </div>
    `;
    card.querySelector(".view-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openCarModal(car);
    });
    card.addEventListener("click", () => openCarModal(car));
    carGrid.appendChild(card);
  });
}

// ========== FILTERS & SORT ==========
function setupFilters() {
  searchInput.addEventListener("input", filterCars);
  brandFilter.addEventListener("change", filterCars);
  priceRange.addEventListener("input", () => {
    priceValue.textContent = "$" + Number(priceRange.value).toLocaleString();
    filterCars();
  });
  sortSelect.addEventListener("change", sortCars);

  // Set price range max
  const maxPrice = Math.max(...carData.map(c => c.price));
  priceRange.max = maxPrice;
  priceRange.value = maxPrice;
  priceValue.textContent = "$" + maxPrice.toLocaleString();
}

function setupBrandFilter() {
  const brands = Array.from(new Set(carData.map(c => c.brand)));
  brands.forEach(brand => {
    const opt = document.createElement("option");
    opt.value = brand;
    opt.textContent = brand;
    brandFilter.appendChild(opt);
  });
}

function filterCars() {
  const search = searchInput.value.toLowerCase();
  const brand = brandFilter.value;
  const price = Number(priceRange.value);

  filteredCars = carData.filter(car => {
    return (
      (car.name.toLowerCase().includes(search) || car.brand.toLowerCase().includes(search)) &&
      (!brand || car.brand === brand) &&
      car.price <= price
    );
  });
  renderCarGrid(filteredCars);
}

function sortCars() {
  const sort = sortSelect.value;
  if (sort === "low-high") {
    filteredCars.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredCars.sort((a, b) => b.price - a.price);
  }
  renderCarGrid(filteredCars);
}

// ========== CAR MODAL ==========
function setupModal() {
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });
  wishlistBtn.addEventListener("click", addToWishlist);
  customizeBtn.addEventListener("click", openConfigurator);
}

function openCarModal(car) {
  selectedCar = car;
  modalCarImg.src = car.img;
  modalCarName.textContent = car.name;
  modalCarBrand.textContent = car.brand;
  modalCarPrice.textContent = "$" + car.price.toLocaleString();
  modalSpecs.innerHTML = car.specs.map(s => `<div>${s}</div>`).join("");
  carModal.classList.remove("hidden");
  addRecentlyViewed(car);
}

function closeModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

// ========== WISHLIST ==========
function setupWishlist() {
  renderWishlist();
}

function addToWishlist() {
  if (!selectedCar) return;
  if (!wishlist.find(c => c.name === selectedCar.name)) {
    wishlist.push(selectedCar);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
    showWishlistSection();
  }
}

function renderWishlist() {
  wishlistGrid.innerHTML = "";
  if (!wishlist.length) {
    wishlistGrid.innerHTML = `<div style="color:var(--neon-magenta);font-size:1em;">No cars in wishlist.</div>`;
    return;
  }
  wishlist.forEach(car => {
    const card = document.createElement("div");
    card.className = "mini-card";
    card.innerHTML = `
      <img src="${car.img}" alt="${car.name}"/>
      <div class="mini-name">${car.name}</div>
      <div class="mini-price">$${car.price.toLocaleString()}</div>
    `;
    card.addEventListener("click", () => openCarModal(car));
    wishlistGrid.appendChild(card);
  });
}

function showWishlistSection() {
  wishlistSection.classList.remove("hidden");
}

// ========== RECENTLY VIEWED ==========
function setupRecentlyViewed() {
  renderRecentlyViewed();
}

function addRecentlyViewed(car) {
  recentlyViewed = recentlyViewed.filter(c => c.name !== car.name);
  recentlyViewed.unshift(car);
  if (recentlyViewed.length > 3) recentlyViewed.pop();
  localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  renderRecentlyViewed();
  showRecentSection();
}

function renderRecentlyViewed() {
  recentGrid.innerHTML = "";
  if (!recentlyViewed.length) {
    recentGrid.innerHTML = `<div style="color:var(--neon-cyan);font-size:1em;">No recently viewed cars.</div>`;
    return;
  }
  recentlyViewed.forEach(car => {
    const card = document.createElement("div");
    card.className = "mini-card";
    card.innerHTML = `
      <img src="${car.img}" alt="${car.name}"/>
      <div class="mini-name">${car.name}</div>
      <div class="mini-price">$${car.price.toLocaleString()}</div>
    `;
    card.addEventListener("click", () => openCarModal(car));
    recentGrid.appendChild(card);
  });
}

function showRecentSection() {
  recentSection.classList.remove("hidden");
}

// ========== CONFIGURATOR ==========
function setupConfigurator() {
  // Placeholder: Hide until car selected
  configurator.classList.add("hidden");
  resetBuildBtn.addEventListener("click", resetBuild);
  randomBuildBtn.addEventListener("click", randomBuild);
  shareBuildBtn.addEventListener("click", shareBuild);
  checkoutBtn.addEventListener("click", openCheckout);
}

function openConfigurator() {
  if (!selectedCar) return;
  carModal.classList.add("hidden");
  configurator.classList.remove("hidden");
  basePrice = selectedCar.price;
  currentMods = {};
  renderModOptions();
  updatePrice();
  // TODO: Load 3D model in Three.js
  load3DCar(selectedCar.model);
}

function renderModOptions() {
  // Mod types and options
  const mods = [
    {
      label: "Rims",
      key: "rims",
      options: [
        { name: "Stock", price: 0 },
        { name: "Forged Black", price: 1200 },
        { name: "Chrome", price: 1500 },
        { name: "Neon Blue", price: 1800 }
      ]
    },
    {
      label: "Spoiler",
      key: "spoiler",
      options: [
        { name: "None", price: 0 },
        { name: "Ducktail", price: 900 },
        { name: "GT Wing", price: 1800 }
      ]
    },
    {
      label: "Headlights",
      key: "headlights",
      options: [
        { name: "White", price: 0 },
        { name: "Blue Glow", price: 600 },
        { name: "Magenta Glow", price: 700 }
      ]
    },
    {
      label: "Wrap Color",
      key: "wrap",
      options: [
        { name: "Stock", price: 0 },
        { name: "Cyan", price: 1200 },
        { name: "Magenta", price: 1200 },
        { name: "Matte Black", price: 1500 }
      ]
    },
    {
      label: "Body Kit",
      key: "bodykit",
      options: [
        { name: "Street", price: 0 },
        { name: "Racing", price: 2500 }
      ]
    },
    {
      label: "Bonnet Style",
      key: "bonnet",
      options: [
        { name: "Stock", price: 0 },
        { name: "Carbon", price: 1100 }
      ]
    }
  ];
  modOptions.innerHTML = "";
  mods.forEach(mod => {
    const group = document.createElement("div");
    group.className = "mod-group";
    group.innerHTML = `<div class="mod-label">${mod.label}</div>`;
    const opts = document.createElement("div");
    opts.className = "mod-options";
    mod.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "mod-btn";
      btn.textContent = `${opt.name} ${opt.price ? `+$${opt.price}` : ""}`;
      if (currentMods[mod.key] === opt.name || (!currentMods[mod.key] && opt.price === 0)) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        currentMods[mod.key] = opt.name;
        modPrices[mod.key] = opt.price;
        renderModOptions();
        updatePrice();
        update3DMod(mod.key, opt.name);
        showModRecommendation(mod.key, opt.name);
        if (opt.price > 2000) triggerConfetti();
      });
      opts.appendChild(btn);
    });
    group.appendChild(opts);
    modOptions.appendChild(group);
  });
}

function updatePrice() {
  let modsTotal = Object.values(modPrices).reduce((a, b) => a + b, 0);
  modsPriceEl.textContent = "$" + modsTotal.toLocaleString();
  totalPriceEl.textContent = "$" + (basePrice + modsTotal).toLocaleString();
  basePriceEl.textContent = "$" + basePrice.toLocaleString();
  // Animate price (GSAP)
  gsap.fromTo(totalPriceEl, { scale: 1.2 }, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
}

function resetBuild() {
  currentMods = {};
  modPrices = {};
  renderModOptions();
  updatePrice();
}

function randomBuild() {
  // Randomly select one option for each mod
  const groups = modOptions.querySelectorAll(".mod-group");
  groups.forEach((group, i) => {
    const btns = group.querySelectorAll(".mod-btn");
    const idx = Math.floor(Math.random() * btns.length);
    btns[idx].click();
  });
}

function shareBuild() {
  // Generate URL with selected mods
  const params = new URLSearchParams();
  params.set("car", selectedCar.name);
  Object.entries(currentMods).forEach(([k, v]) => params.set(k, v));
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(url);
  shareBuildBtn.textContent = "Copied!";
  setTimeout(() => (shareBuildBtn.textContent = "Share Build"), 1200);
}

function showModRecommendation(modKey, optName) {
  // Fun AI-like suggestion
  const recs = {
    rims: {
      "Forged Black": "Pairs well with Racing body kit!",
      "Neon Blue": "Try Magenta wrap for a cyber look."
    },
    spoiler: {
      "GT Wing": "Perfect for track days!"
    },
    headlights: {
      "Magenta Glow": "Neon city vibes!"
    },
    wrap: {
      "Cyan": "Combine with Neon Blue rims for max glow."
    },
    bodykit: {
      "Racing": "Add GT Wing for ultimate downforce."
    },
    bonnet: {
      "Carbon": "Lightweight and stylish!"
    }
  };
  modRecommendations.textContent = recs[modKey]?.[optName] || "";
}

// ========== 3D CAR VIEWER (Three.js) ==========
let threeScene, threeRenderer, threeCamera, threeModel, controls;
function load3DCar(modelPath) {
  // Clear previous
  if (threeRenderer) {
    threeRenderer.dispose();
    threeContainer.innerHTML = "";
  }
  // Setup Three.js scene
  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(45, threeContainer.offsetWidth / threeContainer.offsetHeight, 0.1, 1000);
  threeCamera.position.set(0, 1.2, 4);
  threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  threeRenderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight);
  threeRenderer.setClearColor(0x0f0f0f, 0);
  threeContainer.appendChild(threeRenderer.domElement);

  // Neon lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  threeScene.add(ambient);
  const neonLight = new THREE.PointLight(0x00fff7, 1.2, 10);
  neonLight.position.set(2, 4, 2);
  threeScene.add(neonLight);

  // Load model (GLTFLoader)
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, gltf => {
    threeModel = gltf.scene;
    threeModel.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    threeScene.add(threeModel);
    animate3D();
  });

  // Controls
  let isDragging = false, lastX = 0;
  threeRenderer.domElement.addEventListener("mousedown", e => {
    isDragging = true;
    lastX = e.clientX;
  });
  window.addEventListener("mouseup", () => (isDragging = false));
  window.addEventListener("mousemove", e => {
    if (isDragging && threeModel) {
      const delta = (e.clientX - lastX) * 0.01;
      threeModel.rotation.y += delta;
      lastX = e.clientX;
    }
  });
  // Zoom
  threeRenderer.domElement.addEventListener("wheel", e => {
    e.preventDefault();
    threeCamera.position.z += e.deltaY * 0.003;
    threeCamera.position.z = Math.max(2.2, Math.min(8, threeCamera.position.z));
  });

  // Auto-rotate
  function animate3D() {
    requestAnimationFrame(animate3D);
    if (threeModel) threeModel.rotation.y += 0.003;
    threeRenderer.render(threeScene, threeCamera);
  }
}

function update3DMod(modKey, optName) {
  // Placeholder: Animate color/material changes
  if (!threeModel) return;
  // Example: change color for wrap
  if (modKey === "wrap") {
    let color = 0xffffff;
    if (optName === "Cyan") color = 0x00fff7;
    if (optName === "Magenta") color = 0xff00ea;
    if (optName === "Matte Black") color = 0x222222;
    threeModel.traverse(obj => {
      if (obj.isMesh) obj.material.color.setHex(color);
    });
  }
  // TODO: Animate other mods (rims, spoiler, etc.)
}

// ========== CHECKOUT ==========
function setupCheckout() {
  confirmOrder.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
    resetBuild();
    configurator.classList.add("hidden");
    hero.classList.remove("hidden");
    triggerConfetti();
  });
}

function openCheckout() {
  checkoutModal.classList.remove("hidden");
  let mods = Object.entries(currentMods)
    .map(([k, v]) => `<div>${k.charAt(0).toUpperCase() + k.slice(1)}: <b>${v}</b></div>`)
    .join("");
  let modsTotal = Object.values(modPrices).reduce((a, b) => a + b, 0);
  checkoutSummary.innerHTML = `
    <div><b>Car:</b> ${selectedCar.name}</div>
    <div><b>Base Price:</b> $${basePrice.toLocaleString()}</div>
    <div><b>Mods:</b> ${mods || "None"}</div>
    <div><b>Final Price:</b> <span style="color:var(--neon-magenta);font-size:1.2em;">$${(basePrice + modsTotal).toLocaleString()}</span></div>
  `;
}

// ========== ANIMATIONS & MICRO-INTERACTIONS ==========
function animateHero() {
  gsap.from(".hero-title", { opacity: 0, y: -40, duration: 1, ease: "power2.out" });
  gsap.from(".hero-subtitle", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "power2.out" });
  gsap.from(".cta", { scale: 0.8, opacity: 0, duration: 0.7, delay: 0.7, ease: "back.out(1.7)" });
  gsap.to(".hero-bg", { backgroundPosition: "100% 50%", duration: 12, repeat: -1, yoyo: true, ease: "power1.inOut" });
}

function triggerConfetti() {
  // Simple confetti animation (canvas)
  confettiCanvas.classList.remove("hidden");
  const ctx = confettiCanvas.getContext("2d");
  const W = window.innerWidth, H = window.innerHeight;
  confettiCanvas.width = W; confettiCanvas.height = H;
  let confs = Array.from({length: 80}, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.5,
    r: Math.random() * 8 + 4,
    c: Math.random() > 0.5 ? "#00fff7" : "#ff00ea",
    v: Math.random() * 2 + 1
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,W,H);
    confs.forEach(conf => {
      ctx.beginPath();
      ctx.arc(conf.x, conf.y, conf.r, 0, 2 * Math.PI);
      ctx.fillStyle = conf.c;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      conf.y += conf.v + Math.sin(frame/10 + conf.x/100)*2;
      if (conf.y > H) conf.y = -10;
    });
    frame++;
    if (frame < 90) requestAnimationFrame(draw);
    else confettiCanvas.classList.add("hidden");
  }
  draw();
}

// ========== SOUND EFFECTS ==========
function playSound(type) {
  // Button click/hover sound (optional)
  // For demo, use short beep
  if (type === "click") {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 340;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.08);
  }
}
document.body.addEventListener("click", e => {
  if (e.target.classList.contains("cta") || e.target.classList.contains("mod-btn") || e.target.classList.contains("view-btn")) {
    playSound("click");
  }
});

// ========== LAZY LOADING IMAGES ==========
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img[loading='lazy']").forEach(img => {
    img.addEventListener("error", () => {
      img.src = "logo.jpeg";
    });
  });
});

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ========== THREE.JS LOADER PATCH ==========
if (typeof THREE !== "undefined" && !THREE.GLTFLoader) {
  // Dynamically load GLTFLoader if not present
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
  document.head.appendChild(script);
}