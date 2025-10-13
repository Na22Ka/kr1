// Управление темами и состояниями
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeSwitcher();
        this.addGoodsCardInteractions();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Анимация переключения
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    createThemeSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <button class="theme-toggle" title="Переключить тему">
                ${this.currentTheme === 'light' ? '🌙' : '☀️'}
            </button>
        `;

        document.body.appendChild(switcher);

        switcher.querySelector('.theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
            this.updateThemeButton();
        });
    }

    updateThemeButton() {
        const button = document.querySelector('.theme-toggle');
        if (button) {
            button.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    addGoodsCardInteractions() {
        document.addEventListener('click', (e) => {
            // Обработка кнопок "В корзину"
            if (e.target.classList.contains('goods-button')) {
                this.handleGoodsButtonClick(e.target);
            }

            // Обработка клика по карточке товара
            const goodsCard = e.target.closest('.goods-card');
            if (goodsCard && !e.target.classList.contains('goods-button')) {
                this.toggleGoodsCardSelection(goodsCard);
            }
        });
    }

    handleGoodsButtonClick(button) {
        const card = button.closest('.goods-card');
        const productName = card.querySelector('.goods-name').textContent;
        
        // Добавляем анимацию
        button.classList.add('goods-button--added');
        button.textContent = '✓ Добавлено';
        
        // Восстанавливаем исходное состояние через 2 секунды
        setTimeout(() => {
            button.classList.remove('goods-button--added');
            button.textContent = 'В корзину';
        }, 2000);

        // Показываем уведомление
        this.showNotification(`Товар "${productName}" добавлен в корзину`);
    }

    toggleGoodsCardSelection(card) {
        card.classList.toggle('goods-card--selected');
        
        if (card.classList.contains('goods-card--selected')) {
            this.showNotification('Товар добавлен в избранное');
        }
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    
    // Добавляем анимацию появления элементов
    const animatedElements = document.querySelectorAll('.profile-card, .goods-card, .news-card, .project-card');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('fade-in');
    });
});