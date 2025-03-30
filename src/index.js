import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM (с правильными классами из HTML)
    const requestButtons = document.querySelectorAll('.main__button, .technics__button');
    const closeModalButton = document.querySelector('.modal__icon-close');
    const modalOverlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    const form = document.getElementById('form');
    
    // Функции для управления модальным окном
    const closeModal = () => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    };

    const openModal = () => {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    };

    // Обработчики событий для модального окна
    const setupModalListeners = () => {
        // Открытие по кнопкам
        requestButtons.forEach(button => {
            button.addEventListener('click', openModal);
        });

        // Закрытие по крестику
        closeModalButton.addEventListener('click', closeModal);

        // Закрытие по клику вне модалки
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modalOverlay.style.display === 'flex') {
                closeModal();
            }
        });
    };

    // Обработка формы
    const handleFormSubmit = (e) => {
        e.preventDefault();

        fetch('https://asv-rc.ru/asv-requests.php', {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            alert('Форма успешно отправлена');
            form.reset(); // Очищаем форму после успешной отправки
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка: форма не отправлена');
        })
        .finally(() => {
            closeModal();
        });
    };

    // Инициализация
    const init = () => {
        setupModalListeners();
        
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        // Скрываем модальное окно при загрузке
        modalOverlay.style.display = 'none';
    };

    init();
});