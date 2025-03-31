import './index.css';

// Конфигурация приложения
const APP_CONFIG = {
  API_URL: window.location.hostname === 'asv-rc.ru' 
    ? 'https://asv-rc.ru' 
    : 'http://localhost:8000'
};

document.addEventListener('DOMContentLoaded', function() {
  // DOM элементы
  const form = document.getElementById('form');
  const inputs = form.querySelectorAll('input, textarea');
  const submitBtn = form.querySelector('button[type="submit"]');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  const closeBtn = document.querySelector('.modal__icon-close');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const phoneInput = document.querySelector('input[name="tel"]');
  const body = document.body;
  
  // Состояние кнопки
  submitBtn.disabled = true;
  let isMouseDownOnOverlay = false;

  // Форматирование телефона
  function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      value = value.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      value = '8 (' + (value[2] || '') + 
              (value[3] ? ') ' + value[3] : '') + 
              (value[4] ? '-' + value[4] : '') + 
              (value[5] ? '-' + value[5] : '');
    }
    
    input.value = value;
    validateField(input);
    checkFormValidity();
  }

  // Валидация поля
  function validateField(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (field.validity.valid) {
      errorElement.style.display = 'none';
      field.classList.remove('invalid');
    } else {
      showError(field, errorElement);
      field.classList.add('invalid');
    }
  }

  // Показать ошибку
  function showError(field, errorElement) {
    const errorTypes = {
      valueMissing: 'Это поле обязательно для заполнения',
      typeMismatch: 'Пожалуйста, введите корректные данные',
      patternMismatch: getPatternMismatchMessage(field.name),
      tooShort: `Минимальная длина: ${field.minLength} символа`,
      tooLong: `Максимальная длина: ${field.maxLength} символов`
    };

    for (const [type, message] of Object.entries(errorTypes)) {
      if (field.validity[type]) {
        errorElement.textContent = message;
        break;
      }
    }
    
    errorElement.style.display = 'block';
  }

  // Сообщения для patternMismatch
  function getPatternMismatchMessage(fieldName) {
    const messages = {
      tel: 'Введите телефон в формате: 8 (999) 123-45-67',
      email: 'Введите корректный email (например: example@mail.ru)',
      name: 'Можно использовать только буквы и дефисы'
    };
    return messages[fieldName] || 'Неверный формат данных';
  }

  // Проверка валидности формы
  function checkFormValidity() {
    submitBtn.disabled = !form.checkValidity();
  }

  // Блокировка прокрутки
  function lockScroll() {
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
  }

  // Разблокировка прокрутки
  function unlockScroll() {
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
  }

  // Открытие формы
  function openForm() {
    overlay.style.display = 'flex';
    form.style.display = 'flex';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    form.reset();
    
    document.querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
    
    inputs[0].focus();
    checkFormValidity();
    lockScroll();
  }

  // Закрытие формы
  function closeForm() {
    overlay.style.display = 'none';
    unlockScroll();
  }

  // Отправка формы
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      const firstError = form.querySelector('.invalid');
      if (firstError) firstError.focus();
      return;
    }
    
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        tel: form.tel.value.trim(),
        comment: form.comment.value.trim()
      };
      
      const response = await fetch(`${APP_CONFIG.API_URL}/requests.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Ошибка сервера');
      
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
  }

  // Назначение обработчиков событий
  function setupEventListeners() {
    phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
    
    document.querySelectorAll('[id^="open-form-button"]').forEach(btn => {
      btn.addEventListener('click', openForm);
    });
    
    closeBtn.addEventListener('click', closeForm);
    
    // Улучшенное закрытие по клику на оверлей
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) {
        isMouseDownOnOverlay = true;
      }
    });
    
    overlay.addEventListener('mouseup', (e) => {
      if (e.target === overlay && isMouseDownOnOverlay) {
        closeForm();
      }
      isMouseDownOnOverlay = false;
    });
    
    // Отмена закрытия при перемещении курсора
    overlay.addEventListener('mousemove', () => {
      isMouseDownOnOverlay = false;
    });
    
    modal.addEventListener('click', (e) => e.stopPropagation());
    
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
        checkFormValidity();
      });
      input.addEventListener('blur', () => {
        validateField(input);
        checkFormValidity();
      });
    });
    
    form.addEventListener('submit', handleSubmit);
  }

  // Инициализация
  setupEventListeners();
});