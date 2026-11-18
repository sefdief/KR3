/* Общая навигация, подвал и кнопка возврата наверх */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const current = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["index.html","Главная"],["catalog.html","Растения"],["care.html","Уход"],["about.html","О проекте"]
  ];
  if (header) {
    header.innerHTML = `<header class="site-header"><div class="container header-inner">
      <a class="brand" href="index.html">Green<span>Room</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Меню ☰</button>
      <nav class="main-nav" id="main-nav" aria-label="Основная навигация">
        ${links.map(([href,label]) => `<a href="${href}" class="${current===href || (current==="plant.html" && href==="catalog.html") ? "active" : ""}">${label}</a>`).join("")}
        <a href="suggest.html" class="${current==="suggest.html"?"active":""}">Предложить растение</a>
      </nav>
      <button class="theme-toggle" type="button" aria-label="Включить тёмную тему" title="Переключить тему">
        <span class="theme-toggle__icon" aria-hidden="true">☾</span>
        <span class="theme-toggle__label">Тема</span>
      </button>
      </div></header>`;
      const toggle = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".main-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Закрыть ×" : "Меню ☰";
    });

    const themeButton = header.querySelector(".theme-toggle");
    const themeIcon = themeButton.querySelector(".theme-toggle__icon");
    const themeLabel = themeButton.querySelector(".theme-toggle__label");

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      const dark = theme === "dark";
      themeIcon.textContent = dark ? "☀" : "☾";
      themeLabel.textContent = dark ? "Светлая" : "Тёмная";
      themeButton.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
      themeButton.setAttribute("aria-pressed", String(dark));
    }

    let savedTheme = "light";
    try {
      savedTheme = localStorage.getItem("greenroom-theme") || "light";
    } catch (error) {
      // Если хранилище недоступно, переключение всё равно работает в текущей вкладке.
    }
    applyTheme(savedTheme === "dark" ? "dark" : "light");

    themeButton.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("greenroom-theme", nextTheme);
      } catch (error) {
        // Тема останется активной до перезагрузки страницы.
      }
    });
  }
  if (footer) {
    footer.innerHTML = `<footer class="site-footer"><div class="container">
      <div class="footer-main">
        <div class="footer-brand"><a class="brand brand--footer" href="index.html">Green<span>Room®</span></a><p class="footer-tagline">Зелёный уголок в вашем доме</p></div>
        <div><h2 class="footer-title">Разделы</h2><nav class="footer-links" aria-label="Навигация в подвале"><a href="catalog.html">Растения</a><a href="care.html">Уход</a><a href="about.html">О проекте</a><a href="suggest.html">Предложить растение</a></nav></div>
        <div class="footer-contact"><h2 class="footer-title">Связаться с нами</h2>
        <p>Телефон: <a href="tel:+79358074964">+7 (935) 807-49-64 24 часа</a></p>  
        <p>Почта: <a href="mailto:greenroom@gmail.com">greenroom@gmail.com</a></p>
          <div class="footer-socials">
              <a href="https://web.telegram.org/a/#-5438735199" target="_blank" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                      <path d="M22 2L2 9.5l7.2 2.7L12 21l4-5 4.5 3L22 2ZM9.8 11.7l9-6.1-6.9 7.5-.3 3.7-1.8-4.1Z"/>
                  </svg>
              </a>

              <a href="https://vk.ru/" target="_blank" aria-label="ВКонтакте">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                      <path d="M12.9 17.5c-5.5 0-8.6-3.8-8.7-10h2.8c.1 4.5 2.1 6.4 3.6 6.8V7.5h2.7v3.9c1.5-.2 3.2-2 3.7-3.9h2.7c-.4 2.2-2.2 4-3.4 4.8 1.2.7 3.2 2.3 4 5.2h-3c-.5-1.8-2.1-3.2-4-3.4v3.4h-.4Z"/>
                  </svg>
              </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom"><span>© 2026 GreenRoom. Все права защищены.</span><span>Растения делают пространство живым.</span></div>
    </div></footer>`;
  }
  const topButton = document.createElement("button");
  topButton.className = "back-to-top";
  topButton.type = "button";
  topButton.setAttribute("aria-label","Вернуться наверх");
  topButton.title = "Наверх";
  topButton.innerHTML = "🍃";
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle("is-visible", window.scrollY > 360);
  window.addEventListener("scroll", updateTopButton, {passive:true});
  updateTopButton();
  topButton.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  const featured = document.getElementById("featured-plants");
  if (featured && window.PLANTS) featured.innerHTML = window.PLANTS.slice(0,4).map(plantCard).join("");
  const catalog = document.getElementById("catalog-grid");
  if (catalog && window.PLANTS) setupCatalog(catalog);
  renderCatalogFavorites();
  updateFavoriteNav();
});

function plantCard(plant) {
  const saved = getFavoriteSlugs().includes(plant.slug);
  return `<article class="plant-card">
    <div class="plant-image">
      <img src="${plant.image}" alt="${plant.name}" loading="lazy" referrerpolicy="no-referrer">
      <button class="favorite-button ${saved ? "is-favorite" : ""}" type="button"
        data-favorite="${plant.slug}" aria-label="${saved ? "Убрать из избранного" : "Добавить в избранное"}"
        aria-pressed="${saved}" title="${saved ? "Убрать из избранного" : "Добавить в избранное"}">♥</button>
    </div>
    <div class="plant-card__body"><span class="plant-card__group">${plant.group}</span><h3>${plant.name}</h3><p>${plant.description}</p><a class="text-link" href="plant.html?slug=${encodeURIComponent(plant.slug)}">Подробнее →</a></div>
  </article>`;
}

function setupCatalog(container) {
  const search = document.getElementById("plant-search");
  const count = document.getElementById("results-count");
  const empty = document.getElementById("empty-state");
  const levelHead = document.getElementById("catalog-level-head");
  const allPanel = document.getElementById("catalog-all-panel");
  const favoritesPanel = document.getElementById("catalog-favorites-panel");
  const tabs = document.querySelectorAll("[data-catalog-tab]");
  let activeGroup = null;
  let activeTab = "all";

  function groupCard(group, plants) {
    const examples = plants.slice(0, 3).map(p => p.name).join(" · ");
    return `<button type="button" class="genus-card" data-open-group="${group}">
      <span class="genus-card__visual"><img src="${plants[0].image}" alt="${group}" loading="lazy" referrerpolicy="no-referrer"></span>
      <span class="genus-card__body"><span class="plant-card__group">РОД / ГРУППА</span>
      <strong>${group}</strong><small>${plants.length} ${plants.length === 1 ? "растение" : "растений"}</small>
      <span class="genus-card__examples">${examples}</span><span class="text-link">Выбрать виды →</span></span>
    </button>`;
  }

  function render() {
    if (activeTab !== "all") return;
    const query = search.value.trim().toLocaleLowerCase("ru");
    const allGroups = [...new Set(window.PLANTS.map(p => p.group))];
    if (activeGroup) {
      const groupPlants = window.PLANTS.filter(p => p.group === activeGroup);
      const result = groupPlants.filter(p =>
        [p.name, p.common, p.latin, p.description].join(" ").toLocaleLowerCase("ru").includes(query)
      );
      levelHead.innerHTML = `<button type="button" class="detail-back catalog-back" id="catalog-back">← Все роды растений</button><p class="results-count">${activeGroup}: ${result.length} из ${groupPlants.length}</p>`;
      container.innerHTML = result.map(plantCard).join("");
      count.textContent = "";
      empty.classList.toggle("d-none", result.length !== 0);
      container.classList.toggle("d-none", result.length === 0);
      return;
    }

    const groups = allGroups.map(group => ({
      group,
      plants: window.PLANTS.filter(p => p.group === group)
    })).filter(item => {
      if (!query) return true;
      return item.group.toLocaleLowerCase("ru").includes(query) ||
        item.plants.some(p => [p.name, p.common, p.latin].join(" ").toLocaleLowerCase("ru").includes(query));
    });

    levelHead.innerHTML = `<p class="results-count">Выберите род растения — внутри откроется список видов и разновидностей.</p>`;
    container.innerHTML = groups.map(item => groupCard(item.group, item.plants)).join("");
    count.textContent = "";
    empty.classList.toggle("d-none", groups.length !== 0);
    container.classList.toggle("d-none", groups.length === 0);
  }

  function switchTab(tabName) {
    activeTab = tabName;
    tabs.forEach(tab => {
      const selected = tab.dataset.catalogTab === tabName;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    allPanel.classList.toggle("d-none", tabName !== "all");
    favoritesPanel.classList.toggle("d-none", tabName !== "favorites");
    if (tabName === "favorites") {
      activeGroup = null;
      search.value = "";
      renderCatalogFavorites();
    } else {
      render();
    }
  }

  container.addEventListener("click", e => {
    const card = e.target.closest("[data-open-group]");
    if (card) {
      activeGroup = card.dataset.openGroup;
      search.value = "";
      render();
    }
  });
  levelHead.addEventListener("click", e => {
    if (e.target.closest("#catalog-back")) {
      activeGroup = null;
      search.value = "";
      render();
    }
  });
  search.addEventListener("input", () => {
    if (activeGroup) activeGroup = null;
    render();
  });
  document.querySelectorAll("[data-catalog-tab]").forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.catalogTab)));
  switchTab("all");
}

// Работа с избранным
function getFavoriteSlugs() {
  try {
    return JSON.parse(localStorage.getItem("greenroom-favorites")) || [];
  } catch (error) {
    return [];
  }
}

function saveFavoriteSlugs(slugs) {
  localStorage.setItem("greenroom-favorites", JSON.stringify(slugs));
}

// Обновление счётчика избранного
function updateFavoriteNav() {
  const tab = document.querySelector('[data-catalog-tab="favorites"]');

  if (!tab) return;

  const count = getFavoriteSlugs().length;
  tab.textContent = count > 0
    ? `Избранное (${count})`
    : "Избранное";
}

// Отображение избранных растений
function renderCatalogFavorites() {
  const grid = document.getElementById("catalog-favorites-grid");

  if (!grid || !window.PLANTS) return;

  const favorites = getFavoriteSlugs();

  const plants = window.PLANTS.filter(plant =>
    favorites.includes(plant.slug)
  );

  grid.innerHTML = plants.map(plantCard).join("");

  const empty = document.getElementById("favorites-empty");

  if (empty) {
    empty.classList.toggle("d-none", plants.length > 0);
  }

  grid.classList.toggle("d-none", plants.length === 0);

  updateFavoriteNav();
}

// Добавление и удаление растений
document.addEventListener("click", event => {
  const button = event.target.closest("[data-favorite]");

  if (!button) return;

  const slug = button.dataset.favorite;
  let favorites = getFavoriteSlugs();

  if (favorites.includes(slug)) {
    favorites = favorites.filter(item => item !== slug);
  } else {
    favorites.push(slug);
  }

  saveFavoriteSlugs(favorites);

  document.querySelectorAll(`[data-favorite="${slug}"]`).forEach(item => {
    const isFavorite = favorites.includes(slug);

    item.classList.toggle("is-favorite", isFavorite);
    item.setAttribute("aria-pressed", String(isFavorite));
    item.setAttribute(
      "aria-label",
      isFavorite ? "Убрать из избранного" : "Добавить в избранное"
    );
    item.title = isFavorite
      ? "Убрать из избранного"
      : "Добавить в избранное";
  });

  renderCatalogFavorites();
});


/* ========================================
   SCROLL REVEAL — АНИМАЦИЯ ПРИ ПРОКРУТКЕ
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Если браузер не поддерживает IntersectionObserver,
  // просто показываем все элементы.
  if (!("IntersectionObserver" in window)) return;

  const revealSelectors = [
    ".section-heading",
    ".feature-card",
    ".plant-card",
    ".genus-card",
    ".care-panel",
    ".advice-card",
    ".about-photo",
    ".about-layout > div",
    ".suggest-banner",
    ".metric",
    ".form-note",
    ".plant-detail__image"
  ];

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // Повторно не запускаем анимацию
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  function observeElements(root = document) {
    revealSelectors.forEach(selector => {
      root.querySelectorAll(selector).forEach(element => {
        if (element.classList.contains("scroll-reveal")) return;

        element.classList.add("scroll-reveal");
        observer.observe(element);
      });
    });

    // Если сам добавленный элемент подходит под анимацию
    if (
      root instanceof Element &&
      root.matches(revealSelectors.join(","))
    ) {
      if (!root.classList.contains("scroll-reveal")) {
        root.classList.add("scroll-reveal");
        observer.observe(root);
      }
    }
  }

  // Анимируем уже существующие элементы
  observeElements();

  // Следим за новыми карточками, которые создаёт JavaScript
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element) {
          observeElements(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
});
