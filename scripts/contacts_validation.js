document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');
    
    // Если формы нет на странице - выходим
    if (!contactForm) return;

    // Элементы модального окна
    const modalCloseBtn = contactModal?.querySelector('.button--primary');
    const modalCloseIcon = contactModal?.querySelector('.close');

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Сбрасываем предыдущие ошибки
        clearErrors();

        let isValid = true;

        // Проверка имени (минимум 2 слова)
        const nameInput = document.getElementById('contactName');
        const nameValue = nameInput?.value.trim() || '';
        const nameWords = nameValue.split(' ').filter(word => word.length > 0);

        if (nameValue === '') {
            showError(nameInput, 'nameError', 'Введите ваше имя');
            isValid = false;
        } else if (nameWords.length < 2) {
            showError(nameInput, 'nameError', 'Введите фамилию и имя (минимум 2 слова)');
            isValid = false;
        }

        // Проверка Email
        const emailInput = document.getElementById('contactEmail');
        const emailValue = emailInput?.value.trim() || '';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            showError(emailInput, 'emailError', 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(emailInput, 'emailError', 'Введите корректный email адрес');
            isValid = false;
        }

        // Проверка темы (выбрана ли)
        const topicSelect = document.getElementById('contactTopic');
        const topicValue = topicSelect?.value || '';

        if (topicValue === '') {
            showError(topicSelect, 'topicError', 'Выберите тему обращения');
            isValid = false;
        }

        // Проверка сообщения (не пустое)
        const messageInput = document.getElementById('contactMessage');
        const messageValue = messageInput?.value.trim() || '';

        if (messageValue === '') {
            showError(messageInput, 'messageError', 'Введите текст сообщения');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError(messageInput, 'messageError', 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        // Проверка согласия на обработку данных
        const agreementInput = document.getElementById('contactAgreement');
        
        if (agreementInput && !agreementInput.checked) {
            showError(agreementInput, 'agreementError', 'Необходимо согласие на обработку персональных данных');
            isValid = false;
        }

        // Если все корректно
        if (isValid) {
            const formData = {
                name: nameValue,
                email: emailValue,
                topic: topicSelect?.options[topicSelect?.selectedIndex]?.text || topicValue,
                message: messageValue,
                agreement: agreementInput?.checked || false
            };

            // Вывод данных в консоль
            console.log('--- Форма обратной связи отправлена ---');
            console.log('Имя:', formData.name);
            console.log('Email:', formData.email);
            console.log('Тема:', formData.topic);
            console.log('Сообщение:', formData.message);
            console.log('Согласие на обработку:', formData.agreement);
            console.log('Время:', new Date().toLocaleString());

            // Показываем модальное окно
            showContactModal();
            
            // Очищаем форму
            contactForm.reset();
        }
    });

    // === ЛОГИКА МОДАЛЬНОГО ОКНА ===
    function showContactModal() {
        if (contactModal) {
            contactModal.style.display = 'flex';
            contactModal.classList.add('is-active');
        }
    }
    function hideContactModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
            contactModal.classList.remove('is-active');
        }
    }

    // Обработчики закрытия модального окна
    modalCloseBtn?.addEventListener('click', hideContactModal);
    modalCloseIcon?.addEventListener('click', hideContactModal);

    // Закрытие по клику вне области контента
    window.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            hideContactModal();
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
            // Для чекбокса
            if (input.type === 'checkbox') {
                input.addEventListener('change', function() {
                    this.classList.remove('input-error');
                    const parent = this.parentNode;
                    const errorSpan = parent.querySelector('.error-message');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                });
            }
        });
    });
});