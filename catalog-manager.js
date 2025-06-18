// Менеджер каталога с загрузкой фотографий через интерфейс
class CatalogManager {
  constructor() {
    this.wreaths = JSON.parse(localStorage.getItem("wreaths")) || this.getDefaultWreaths()
    this.nextId = this.getNextId()
    this.init()
  }

  init() {
    this.loadWreathsList()
    this.setupEventListeners()
    console.log("🚀 Менеджер каталога инициализирован")
  }

  getDefaultWreaths() {
    return [
      {
        id: 1,
        name: "Венок-сердце с белыми розами",
        price: 4500,
        image: "/placeholder.svg?height=250&width=300",
        category: "Элитные",
        rating: 5,
        description: "Изысканный венок в форме сердца из белых роз с зеленой атласной лентой",
      },
      {
        id: 2,
        name: "Венок с серебряной лентой",
        price: 3800,
        image: "/placeholder.svg?height=250&width=300",
        category: "Классические",
        rating: 5,
        description: "Торжественный венок с красными розами, белыми цветами и серебряной лентой",
      },
      {
        id: 3,
        name: "Венок с ирисами и розами",
        price: 4200,
        image: "/placeholder.svg?height=250&width=300",
        category: "Элитные",
        rating: 5,
        description: "Элегантный венок с белыми розами и фиолетовыми ирисами в серебряном обрамлении",
      },
      {
        id: 4,
        name: "Венок с синими гвоздиками",
        price: 2800,
        image: "/placeholder.svg?height=250&width=300",
        category: "Традиционные",
        rating: 4,
        description: "Классический венок с синими гвоздиками и белой лентой",
      },
      {
        id: 5,
        name: "Венок с красными розами и хризантемами",
        price: 3600,
        image: "/placeholder.svg?height=250&width=300",
        category: "Классические",
        rating: 5,
        description: "Яркий венок с красными розами, белыми хризантемами и красной лентой",
      },
      {
        id: 6,
        name: "Венок с желтыми цветами",
        price: 3400,
        image: "/placeholder.svg?height=250&width=300",
        category: "Сезонные",
        rating: 4,
        description: "Солнечный венок с желтыми и красными цветами в красном обрамлении",
      },
    ]
  }

  getNextId() {
    return Math.max(...this.wreaths.map((w) => w.id), 0) + 1
  }

  setupEventListeners() {
    const form = document.getElementById("addWreathForm")
    if (form) {
      form.addEventListener("submit", (e) => this.handleAddWreath(e))
    }
  }

  // Предпросмотр изображения
  previewImage(input) {
    const file = input.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = document.getElementById("imagePreview")
        const placeholder = document.getElementById("uploadPlaceholder")

        preview.src = e.target.result
        preview.style.display = "block"
        placeholder.style.display = "none"
      }
      reader.readAsDataURL(file)
    }
  }

  // Добавление нового венка
  async handleAddWreath(e) {
    e.preventDefault()

    const formData = {
      name: document.getElementById("wreathName").value,
      price: Number.parseInt(document.getElementById("wreathPrice").value),
      category: document.getElementById("wreathCategory").value,
      rating: Number.parseInt(document.getElementById("wreathRating").value),
      description: document.getElementById("wreathDescription").value,
    }

    // Обработка изображения
    const imageFile = document.getElementById("wreathImage").files[0]
    let imageData = "/placeholder.svg?height=250&width=300"

    if (imageFile) {
      imageData = await this.convertImageToBase64(imageFile)
    }

    const newWreath = {
      id: this.nextId++,
      ...formData,
      image: imageData,
    }

    this.wreaths.push(newWreath)
    this.saveWreaths()
    this.resetForm()
    this.loadWreathsList()
    this.refreshCatalog()

    this.showNotification("✅ Венок успешно добавлен!", "success")
    console.log("✅ Добавлен новый венок:", newWreath.name)
  }

  // Конвертация изображения в Base64
  convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Удаление венка
  deleteWreath(id) {
    if (confirm("Вы уверены, что хотите удалить этот венок?")) {
      this.wreaths = this.wreaths.filter((w) => w.id !== id)
      this.saveWreaths()
      this.loadWreathsList()
      this.refreshCatalog()
      this.showNotification("🗑️ Венок удален", "warning")
    }
  }

  // Редактирование венка
  editWreath(id) {
    const wreath = this.wreaths.find((w) => w.id === id)
    if (!wreath) return

    // Заполняем форму данными венка
    document.getElementById("wreathName").value = wreath.name
    document.getElementById("wreathPrice").value = wreath.price
    document.getElementById("wreathCategory").value = wreath.category
    document.getElementById("wreathRating").value = wreath.rating
    document.getElementById("wreathDescription").value = wreath.description

    // Показываем изображение
    if (wreath.image && !wreath.image.includes("placeholder")) {
      const preview = document.getElementById("imagePreview")
      const placeholder = document.getElementById("uploadPlaceholder")
      preview.src = wreath.image
      preview.style.display = "block"
      placeholder.style.display = "none"
    }

    // Удаляем старый венок
    this.deleteWreath(id)

    // Прокручиваем к форме
    document.getElementById("addWreathForm").scrollIntoView({ behavior: "smooth" })
  }

  // Загрузка списка венков для редактирования
  loadWreathsList() {
    const container = document.getElementById("wreathsList")
    if (!container) return

    if (this.wreaths.length === 0) {
      container.innerHTML = '<p class="no-wreaths">Венки не найдены. Добавьте первый венок!</p>'
      return
    }

    container.innerHTML = this.wreaths
      .map(
        (wreath) => `
      <div class="wreath-item">
        <div class="wreath-image">
          <img src="${wreath.image}" alt="${wreath.name}">
        </div>
        <div class="wreath-info">
          <h4>${wreath.name}</h4>
          <p class="wreath-category">${wreath.category}</p>
          <p class="wreath-price">${wreath.price} ₽</p>
          <p class="wreath-description">${wreath.description.substring(0, 100)}...</p>
        </div>
        <div class="wreath-actions">
          <button class="btn btn-outline btn-sm" onclick="catalogManager.editWreath(${wreath.id})">
            <i class="fas fa-edit"></i> Редактировать
          </button>
          <button class="btn btn-danger btn-sm" onclick="catalogManager.deleteWreath(${wreath.id})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }

  // Сброс формы
  resetForm() {
    document.getElementById("addWreathForm").reset()
    const preview = document.getElementById("imagePreview")
    const placeholder = document.getElementById("uploadPlaceholder")
    preview.style.display = "none"
    placeholder.style.display = "block"
  }

  // Сохранение в localStorage
  saveWreaths() {
    localStorage.setItem("wreaths", JSON.stringify(this.wreaths))
  }

  // Обновление каталога
  refreshCatalog() {
    // Обновляем глобальную переменную wreaths
    window.wreaths = this.wreaths

    // Обновляем отображение каталога
    if (typeof filterWreaths === "function") {
      filterWreaths()
    }
  }

  // Показать уведомление
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }

  // Экспорт данных
  exportData() {
    const dataStr = JSON.stringify(this.wreaths, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "wreaths-catalog.json"
    link.click()
    URL.revokeObjectURL(url)
    this.showNotification("📥 Каталог экспортирован", "success")
  }

  // Импорт данных
  importData(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedWreaths = JSON.parse(e.target.result)
        this.wreaths = importedWreaths
        this.nextId = this.getNextId()
        this.saveWreaths()
        this.loadWreathsList()
        this.refreshCatalog()
        this.showNotification("📤 Каталог импортирован", "success")
      } catch (error) {
        this.showNotification("❌ Ошибка импорта файла", "error")
      }
    }
    reader.readAsText(file)
  }
}

// Глобальные функции
function toggleAdminPanel() {
  const panel = document.getElementById("adminPanel")
  const toggle = document.getElementById("adminToggle")

  if (panel.style.display === "none") {
    panel.style.display = "block"
    toggle.style.display = "none"
  } else {
    panel.style.display = "none"
    toggle.style.display = "block"
  }
}

function previewImage(input) {
  catalogManager.previewImage(input)
}

// Инициализация менеджера каталога
let catalogManager
document.addEventListener("DOMContentLoaded", () => {
  catalogManager = new CatalogManager()

  // Обновляем глобальную переменную wreaths
  window.wreaths = catalogManager.wreaths

  // Скрываем админ панель по умолчанию
  const adminPanel = document.getElementById("adminPanel")
  if (adminPanel) {
    adminPanel.style.display = "none"
  }
})
