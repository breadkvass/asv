import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const requestButtons = document.querySelectorAll('.main__button, .technics__button');
    const closeModalButton = document.querySelector('.modal__icon-close');
    const modalOverlay = document.querySelector('.overlay');
 
    // Функции модального окна
    const closeModal = () => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    };

    const openModal = () => {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // Отправка данных в Telegram
    document.getElementById('form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
    
        form.style.display = 'block';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            // Показываем загрузку
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
    
            // Собираем данные
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                tel: form.tel.value.trim(),
                comment: form.comment?.value.trim() || ''
            };
    
            // Отправка на сервер
            const response = await fetch(`${window.APP_CONFIG.API_URL}/requests.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || 'Ошибка сервера');
            }
    
            // Успех
            form.style.display = 'none';
            successMessage.style.display = 'block';
            form.reset();
        } catch (error) {
            console.error('Ошибка:', error);
            form.style.display = 'none';
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Инициализация
    requestButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
    modalOverlay.style.display = 'none';
});