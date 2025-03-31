import './index.css';
// Конфигурация приложения
window.APP_CONFIG = {
    API_URL: window.location.hostname === 'asv-rc.ru' 
      ? 'https://asv-rc.ru' 
      : 'http://localhost:8000'
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const form = document.getElementById('form');
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.modal__icon-close');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const phoneInput = document.querySelector('input[name="tel"]');

    phoneInput.addEventListener('input', function(e) {
        // Удаляем все нецифровые символы
        let value = this.value.replace(/\D/g, '');
        
        // Форматируем номер
        if (value.length > 0) {
            value = value.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            value = '8 (' + (value[2] ? value[2] : '') + 
                    (value[3] ? ') ' + value[3] : '') + 
                    (value[4] ? '-' + value[4] : '') + 
                    (value[5] ? '-' + value[5] : '');
        }
        
        // Устанавливаем отформатированное значение
        this.value = value;
        
        // Вызываем валидацию
        validateField(this);
    });
  
    // Открытие формы по клику на кнопки
    document.querySelectorAll('[id^="open-form-button"]').forEach(btn => {
      btn.addEventListener('click', openForm);
    });
  
    // Функция открытия формы
    function openForm() {
      overlay.style.display = 'flex';
      form.style.display = 'flex';
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      form.reset();
      
      // Сбрасываем ошибки
      document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
      });
      
      // Фокус на первое поле
      inputs[0].focus();
    }
  
    // Функция закрытия формы
    function closeForm() {
      overlay.style.display = 'none';
    }
  
    // Обработчики закрытия
    closeBtn.addEventListener('click', closeForm);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeForm();
    });
    modal.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  
    // Валидация полей в реальном времени
    inputs.forEach(input => {
      input.addEventListener('input', () => validateField(input));
      input.addEventListener('blur', () => validateField(input));
    });
  
    // Функция валидации поля
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
  
    // Показать ошибку валидации
    function showError(field, errorElement) {
      if (field.validity.valueMissing) {
        errorElement.textContent = 'Это поле обязательно для заполнения';
      } else if (field.validity.typeMismatch) {
        errorElement.textContent = 'Пожалуйста, введите корректные данные';
      } else if (field.validity.patternMismatch) {
        if (field.name === 'tel' && field.validity.patternMismatch) {
            errorElement.textContent = 'Введите телефон в формате: 8 (999) 123-45-67';
          
        } else if (field.name === 'email') {
          errorElement.textContent = 'Введите корректный email (например: example@mail.ru)';
        } else if (field.name === 'name') {
          errorElement.textContent = 'Можно использовать только буквы и дефисы';
        }
      } else if (field.validity.tooShort) {
        errorElement.textContent = `Минимальная длина: ${field.minLength} символов`;
      } else if (field.validity.tooLong) {
        errorElement.textContent = `Максимальная длина: ${field.maxLength} символов`;
      }
      
      errorElement.style.display = 'block';
    }


  
    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Проверяем все поля перед отправкой
      let isValid = true;
      inputs.forEach(input => {
        validateField(input);
        if (!input.validity.valid) isValid = false;
      });
      
      if (!isValid) {
        const firstError = form.querySelector('.invalid');
        if (firstError) firstError.focus();
        return;
      }
      
      const originalText = submitBtn.textContent;
      
      // Подготовка к отправке
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
          comment: form.comment.value.trim()
        };
        
        // Отправка на сервер
        const response = await fetch(`${window.APP_CONFIG.API_URL}/send-to-telegram.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || 'Ошибка сервера');
        
        // Успешная отправка
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
  });