// === МАСКА ДЛЯ ТЕЛЕФОНА ===
function initPhoneMask(input) {
    if (!input) return;

    const defaultPrefix = '+7 ';

    // Форматирование номера: +7 (XXX) XXX-XX-XX
    function formatPhone(value) {
        // Удаляем всё, кроме цифр
        let digits = value.replace(/\D/g, '');

        // Если пусто - возвращаем только префикс
        if (!digits) return defaultPrefix;

        // Если начинается с 8, заменяем на 7
        if (digits[0] === '8') {
            digits = '7' + digits.slice(1);
        }

        // Если не начинается с 7 - добавляем 7
        if (digits[0] !== '7') {
            digits = '7' + digits;
        }

        // Ограничиваем длину (11 цифр: 7 + 10 цифр номера)
        digits = digits.slice(0, 11);

        // Форматируем: +7 (XXX) XXX-XX-XX
        let formatted = defaultPrefix;
        if (digits.length > 1) {
            formatted += '(' + digits.slice(1, 4);
        }
        if (digits.length > 4) {
            formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length > 7) {
            formatted += '-' + digits.slice(7, 9);
        }
        if (digits.length > 9) {
            formatted += '-' + digits.slice(9, 11);
        }

        return formatted;
    }

    // Обработчик ввода
    input.addEventListener('input', function(e) {
        const oldValue = this.value;
        const formatted = formatPhone(this.value);
        
        // Если значение не изменилось - не обновляем (защита от зацикливания)
        if (oldValue === formatted) return;
        
        this.value = formatted;
        
        // Курсор всегда в конец при вводе
        this.setSelectionRange(formatted.length, formatted.length);
    });

    // Обработчик вставки (paste)
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        this.value = formatPhone(pasted);
        this.setSelectionRange(this.value.length, this.value.length);
    });

    // Обработчик удаления (Backspace/Delete)
    input.addEventListener('keydown', function(e) {
        // Если нажат Backspace или Delete
        if (e.key === 'Backspace' || e.key === 'Delete') {
            // Разрешаем удаление только если есть что удалять после префикса
            if (this.value.length > defaultPrefix.length) {
                // Удаляем последний символ
                this.value = this.value.slice(0, -1);
                
                // Переформатируем после удаления
                this.value = formatPhone(this.value);
                
                // Курсор в конец
                this.setSelectionRange(this.value.length, this.value.length);
            }
            // Если только префикс - не даeм удалить
            e.preventDefault();
        }
    });

    // Блокировка ввода нецифровых символов (дополнительная защита)
    input.addEventListener('keypress', function(e) {
        if (e.key >= '0' && e.key <= '9') return;
        if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        e.preventDefault();
    });

    // При фокусе - если пусто, показываем +7 
    input.addEventListener('focus', function() {
        if (!this.value || this.value === defaultPrefix.trim()) {
            this.value = defaultPrefix;
        }
    });

    // При потере фокуса - если только префикс, очищаем
    input.addEventListener('blur', function() {
        if (this.value === defaultPrefix || this.value.trim() === '') {
            this.value = '';
        }
    });

    // Инициализация: если поле пустое, ставим +7 
    if (!input.value) {
        input.value = defaultPrefix;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('adoptPhone');
    initPhoneMask(phoneInput);

    const form = document.getElementById('adoptForm');
    const modal = document.getElementById('applicationModal');

    const closeButtons = document.querySelectorAll('#applicationModal .close, #applicationModal .button--primary');

    // Если формы нет на странице — выходим
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Отменяем стандартную отправку

        // Сбрасываем предыдущие ошибки
        clearErrors();

        let isValid = true;

        // Проверка Имени (не пустое, минимум 2 слова)
        const nameInput = document.getElementById('adoptName');
        const nameValue = nameInput.value.trim();
        const nameWords = nameValue.split(' ').filter(word => word.length > 0);

        if (nameValue === '') {
            showError(nameInput, 'nameError', 'Введите имя');
            isValid = false;
        } else if (nameWords.length < 2) {
            showError(nameInput, 'nameError', 'Введите фамилию и имя (минимум 2 слова)');
            isValid = false;
        } else {
            // Проверяем, что каждое слово состоит минимум из 2 букв
            let hasShortWord = false;
            for (let word of nameWords) {
                if (word.length < 2) {
                    hasShortWord = true;
                    break;
                }
            }
            if (hasShortWord) {
                showError(nameInput, 'nameError', 'Каждое слово должно содержать минимум 2 буквы');
                isValid = false;
            }
        }

        // Проверка Телефона (ровно 10 цифр после +7)
        const phoneInput = document.getElementById('adoptPhone');
        const phoneValue = phoneInput.value.trim();
        // Извлекаем только цифры для проверки
        const phoneDigits = phoneValue.replace(/\D/g, '');

        if (phoneValue === '' || phoneDigits.length === 0) {
            showError(phoneInput, 'phoneError', 'Введите номер телефона');
            isValid = false;
        } else if (phoneDigits.length < 10) {
            showError(phoneInput, 'phoneError', 'Номер должен содержать 10 цифр');
            isValid = false;
        }

        // Проверка Email (не пустой, содержит @ и .)
        const emailInput = document.getElementById('adoptEmail');
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

        if (emailValue === '') {
            showError(emailInput, 'emailError', 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(emailInput, 'emailError', 'Введите корректный email адрес');
            isValid = false;
        }

        // Если всe корректно - отправляем событие
        if (isValid) {
            const formData = {
                fullname: nameValue,
                phone: phoneValue,
                email: emailValue,
                message: document.getElementById('adoptMessage').value.trim() || '(не заполнено)'
            };

            // Отправляем данные в консоль
            console.log('--- Форма отправлена ---');
            console.log('ФИО:', formData.fullname);
            console.log('Телефон:', formData.phone);
            console.log('Email:', formData.email);
            console.log('Сообщение:', formData.message);
            console.log('Время:', new Date().toLocaleString());

            showModal();
            
            // Oчистить форму
            form.reset(); 
        }
    });

    // === ЛОГИКА МОДАЛЬНОГО ОКНА ===
    function showModal() {
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('is-active');
        }
    }
    function hideModal() {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('is-active');
        }
    }
    // Навешиваем обработчики на кнопки закрытия
    closeButtons.forEach(button => {
        button.addEventListener('click', hideModal);
    });
    // Закрытие по клику вне области контента
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    // Функция показа ошибки
    function showError(input, errorId, message) {
        input.classList.add('input-error');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    // Функция сброса ошибок
    function clearErrors() {
        document.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    // Убираем ошибку при начале ввода
    document.querySelectorAll('#adoptForm input, #adoptForm textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            // Ищем соседний span с ошибкой и очищаем
            const nextSibling = this.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('error-message')) {
                nextSibling.textContent = '';
            }
        });
    });
});