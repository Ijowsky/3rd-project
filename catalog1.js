// Переменные для фильтрации
let filteredWreaths = []

// DOM элементы
const searchInput = document.getElementById("searchInput")
const categoryFilter = document.getElementById("categoryFilter")
const priceFilter = document.getElementById("priceFilter")
const catalogGrid = document.getElementById("catalogGrid")
const resultsCount = document.getElementById("resultsCount")

// Инициализация каталога
document.addEventListener("DOMContentLoaded", () => {
  console.log("🛍️ Инициализация каталога...")

  // Ждем инициализации catalogManager
  setTimeout(() => {
    if (typeof wreaths !== "undefined") {
      filteredWreaths = [...wreaths]
      renderWreaths(filteredWreaths)
      updateResultsCount()
      console.log(`✅ Загружено ${wreaths.length} венков в каталог`)
    } else {
      console.error("❌ Данные венков не загружены")
      if (resultsCount) {
        resultsCount.textContent = "Ошибка загрузки данных"
      }
    }
  }, 200)

  // Добавляем обработчики событий
  if (searchInput) searchInput.addEventListener("input", filterWreaths)
  if (categoryFilter) categoryFilter.addEventListener("change", filterWreaths)
  if (priceFilter) priceFilter.addEventListener("change", filterWreaths)
})

// Функция фильтрации венков
function filterWreaths() {
  if (typeof wreaths === "undefined") return

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
  const selectedCategory = categoryFilter ? categoryFilter.value : "all"
  const selectedPriceRange = priceFilter ? priceFilter.value : "all"

  filteredWreaths = wreaths.filter((wreath) => {
    const matchesSearch =
      wreath.name.toLowerCase().includes(searchTerm) || wreath.description.toLowerCase().includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || wreath.category === selectedCategory

    let matchesPrice = true
    if (selectedPriceRange === "low") {
      matchesPrice = wreath.price < 3000
    } else if (selectedPriceRange === "medium") {
      matchesPrice = wreath.price >= 3000 && wreath.price < 5000
    } else if (selectedPriceRange === "high") {
      matchesPrice = wreath.price >= 5000
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  renderWreaths(filteredWreaths)
  updateResultsCount()

  console.log(`🔍 Фильтрация: найдено ${filteredWreaths.length} венков`)
}

// Функция рендеринга венков
function renderWreaths(wreathsToRender) {
  if (!catalogGrid) return

  if (wreathsToRender.length === 0) {
    catalogGrid.innerHTML = `
      <div class="no-results">
        <h3>По вашему запросу ничего не найдено</h3>
        <p>Попробуйте изменить параметры поиска или посмотрите все венки</p>
        <button class="btn btn-primary" onclick="resetFilters()">Сбросить фильтры</button>
      </div>
    `
    return
  }

  catalogGrid.innerHTML = wreathsToRender.map((wreath) => renderProductCard(wreath)).join("")

  // Повторно наблюдаем за новыми элементами для анимации
  const newCards = catalogGrid.querySelectorAll(".product-card")
  newCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"

    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 50)
  })
}

// Обновление счетчика результатов
function updateResultsCount() {
  if (!resultsCount) return

  const count = filteredWreaths.length
  let text = `Найдено ${count}`

  if (count === 1) {
    text += " венок"
  } else if (count >= 2 && count <= 4) {
    text += " венка"
  } else {
    text += " венков"
  }

  resultsCount.textContent = text
}

// Функция сброса фильтров
function resetFilters() {
  if (searchInput) searchInput.value = ""
  if (categoryFilter) categoryFilter.value = "all"
  if (priceFilter) priceFilter.value = "all"
  filterWreaths()
  console.log("🔄 Фильтры сброшены")
}

// Функция рендеринга карточки товара
function renderProductCard(wreath) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${wreath.image}" 
             alt="${wreath.name}" 
             loading="lazy" 
             onerror="this.onerror=null; this.src='/placeholder.svg?height=250&width=300';">
      </div>
      <div class="product-content">
        <span class="product-category">${wreath.category}</span>
        <h4 class="product-title">${wreath.name}</h4>
        <p class="product-description">${wreath.description}</p>
        <div class="product-rating">
          ${generateStars(wreath.rating)}
          <span>(${wreath.rating})</span>
        </div>
        <div class="product-price">${wreath.price} ₽</div>
      </div>
    </div>
  `
}

// Функция генерации звезд
function generateStars(rating) {
  let stars = ""
  for (let i = 0; i < rating; i++) {
    stars += '<i class="fas fa-star"></i>'
  }
  return stars
}
