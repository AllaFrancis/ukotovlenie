document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.booking-form');
    const bookingModal = document.getElementById('bookingModal');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    // Если формы нет на странице - выходим
    if (!bookingForm) return;

    const modalCloseBtn = bookingModal?.querySelector('.button--primary');
    const modalCloseIcon = bookingModal?.querySelector('.close');

    // === ОГРАНИЧЕНИЯ ДАТЫ И ВРЕМЕНИ ===
    if (dateInput) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        dateInput.min = todayStr; // Нельзя выбрать прошедшие даты
        
        // Обработчик изменения даты
        dateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            const isToday = selectedDate === todayStr;
            
            if (!timeInput) return;
            
            if (isToday) {
                // Если выбрано "сегодня" - ограничиваем время
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                // Минимальное время: 10:00 или текущее (если позже)
                const minHour = Math.max(10, currentHour);
                const minTime = `${String(minHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
                
                timeInput.min = minTime;
                timeInput.max = '20:00';
                
                // Если уже после 20:00 - блокируем выбор
                if (currentHour >= 20) {
                    timeInput.disabled = true;
                } else {
                    timeInput.disabled = false;
                }
            } else {
                // Для будущих дат - стандартный диапазон
                timeInput.min = '10:00';
                timeInput.max = '20:00';
                timeInput.disabled = false;
            }
        });
    }

    // === ОТПРАВКА ФОРМЫ И МОДАЛЬНОЕ ОКНО ===
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Показываем модальное окно
        if (bookingModal) {
            bookingModal.style.display = 'flex';
        }
    });

    // === ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ===
    function closeBookingModal() {
        if (bookingModal) {
            bookingModal.style.display = 'none';
        }
        // Очищаем форму после закрытия модального окна
        bookingForm.reset();
        
        // Сбрасываем ограничения времени, если дата "сегодня"
        if (dateInput && timeInput) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (dateInput.value === todayStr) {
                const now = new Date();
                if (now.getHours() < 20) {
                    timeInput.disabled = false;
                    timeInput.placeholder = '10:00 - 20:00';
                }
            }
        }
    }

    // Обработчики закрытия
    modalCloseBtn?.addEventListener('click', closeBookingModal);
    modalCloseIcon?.addEventListener('click', closeBookingModal);

    // Закрытие по клику вне контента модального окна
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
});