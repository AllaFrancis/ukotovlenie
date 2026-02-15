// Бургер меню
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links--active');
    burgerMenu.innerHTML = navLinks.classList.contains('nav-links--active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links__link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-links--active');
        burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Закрытие меню при клике на любое место экрана
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('nav-links--active')) {
        // Проверяем, что клик был НЕ на меню и НЕ на кнопке бургера
        if (!navLinks.contains(e.target) && !burgerMenu.contains(e.target)) {
            navLinks.classList.remove('nav-links--active');
            burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
});