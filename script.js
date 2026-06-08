const WHATSAPP_NUMBER = "5545991112774";
const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Miriã Biju e gostaria de saber mais sobre as peças e quiosques.";

const STORES = {
  "irani-alto-alegre": {
    name: "Irani Supermercado - Alto Alegre",
    city: "Cascavel-PR",
    address: "Avenida Tancredo Neves, 2270 - Alto Alegre, Cascavel-PR",
    query: "Avenida Tancredo Neves 2270 Alto Alegre Cascavel PR",
  },
  "allmayer-sao-cristovao": {
    name: "Allmayer Supermercado - São Cristóvão",
    city: "Cascavel-PR",
    address: "Avenida Barão do Rio Branco, 1110 - São Cristóvão, Cascavel-PR",
    query: "Avenida Barao do Rio Branco 1110 Sao Cristovao Cascavel PR",
  },
  "irani-floresta": {
    name: "Irani Supermercado - Floresta",
    city: "Cascavel-PR",
    address: "Avenida Papagaios, 2100 - Floresta, Cascavel-PR",
    query: "Avenida Papagaios 2100 Floresta Cascavel PR",
  },
  "max-toledo": {
    name: "Max Atacadista - Jardim Tocantins",
    city: "Toledo-PR",
    address: "Avenida Ministro Cirne Lima, 4022 - Jardim Tocantins, Toledo-PR",
    query: "Avenida Ministro Cirne Lima 4022 Jardim Tocantins Toledo PR",
  },
};

const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const revealElements = document.querySelectorAll(".reveal");
const carousels = document.querySelectorAll("[data-carousel]");
const storeTabs = document.querySelectorAll("[data-store-tab]");
const storeName = document.querySelector("[data-store-name]");
const storeCity = document.querySelector("[data-store-city]");
const storeAddress = document.querySelector("[data-store-address]");
const storeRoute = document.querySelector("[data-store-route]");
const storeMap = document.querySelector("[data-store-map]");
const copyAddressButton = document.querySelector("[data-copy-address]");
const whatsappButtons = document.querySelectorAll("[data-whatsapp]");

let selectedStore = "irani-alto-alegre";

function buildMapEmbed(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function buildRouteLink(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function buildWhatsAppUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle || !header) return;

  mobileMenu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
}

function toggleMobileMenu() {
  if (!mobileMenu || !menuToggle || !header) return;

  const willOpen = mobileMenu.hidden;
  mobileMenu.hidden = !willOpen;
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  header.classList.toggle("menu-active", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
}

function updateStore(storeId) {
  const store = STORES[storeId];
  if (!store) return;

  selectedStore = storeId;

  storeTabs.forEach((tab) => {
    const isActive = tab.dataset.storeTab === storeId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (storeName) storeName.textContent = store.name;
  if (storeCity) storeCity.textContent = store.city;
  if (storeAddress) storeAddress.textContent = store.address;
  if (storeRoute) storeRoute.href = buildRouteLink(store.query);
  if (storeMap) storeMap.src = buildMapEmbed(store.query);
}

async function copySelectedAddress() {
  const store = STORES[selectedStore];
  if (!store || !copyAddressButton) return;

  try {
    await navigator.clipboard.writeText(store.address);
    copyAddressButton.textContent = "Endereço copiado";
  } catch {
    copyAddressButton.textContent = "Copie pelo mapa";
  }

  window.setTimeout(() => {
    copyAddressButton.textContent = "Copiar endereço";
  }, 1800);
}

function setupStorePicker() {
  storeTabs.forEach((tab) => {
    tab.addEventListener("click", () => updateStore(tab.dataset.storeTab));
  });

  copyAddressButton?.addEventListener("click", copySelectedAddress);
  updateStore(selectedStore);
}

function setupCarousels() {
  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const cards = [...carousel.querySelectorAll(".accessory-card")];
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const current = carousel.querySelector("[data-carousel-current]");
    const total = carousel.querySelector("[data-carousel-total]");

    if (!track || !cards.length) return;

    if (total) {
      total.textContent = String(cards.length);
    }

    function getCardStep() {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function centerCard(index, behavior = "smooth") {
      const card = cards[index];
      if (!card) return;

      const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left, behavior });
    }

    function updateCurrentSlide() {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let activeIndex = 0;
      let activeDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(trackCenter - cardCenter);

        if (distance < activeDistance) {
          activeDistance = distance;
          activeIndex = index;
        }
      });

      if (current) {
        current.textContent = String(activeIndex + 1);
      }
    }

    prev?.addEventListener("click", () => {
      track.scrollBy({ left: -getCardStep(), behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      track.scrollBy({ left: getCardStep(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateCurrentSlide, { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        track.scrollBy({ left: -getCardStep(), behavior: "smooth" });
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        track.scrollBy({ left: getCardStep(), behavior: "smooth" });
      }
    });

    window.requestAnimationFrame(() => {
      if (window.innerWidth <= 760 && cards.length > 2) {
        centerCard(1, "auto");
      }

      updateCurrentSlide();
    });
  });
}

function setupRevealAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -42px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

menuToggle?.addEventListener("click", toggleMobileMenu);

mobileMenu?.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

whatsappButtons.forEach((button) => {
  button.addEventListener("click", () => openExternal(buildWhatsAppUrl()));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 860) {
    closeMobileMenu();
  }
});

setupStorePicker();
setupCarousels();
setupRevealAnimations();
updateHeaderState();
