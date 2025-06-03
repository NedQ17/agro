document.addEventListener('DOMContentLoaded', function() {
    const messageTextarea = document.querySelector('#contact textarea[placeholder="Ваше сообщение"]');
    const addToMessageButtons = document.querySelectorAll('.add-to-message-btn');

    addToMessageButtons.forEach(button => {
    button.addEventListener('click', function () {
        const itemName = this.dataset.item;
        const greeting = "Здравствуйте! Меня интересует:";
        if (messageTextarea) {
            const lines = messageTextarea.value.split("\n").map(l => l.trim()).filter(l => l);
            const baseLineExists = lines.length > 0 && lines[0].startsWith(greeting);
            const alreadyAdded = lines.includes(itemName);

            if (!baseLineExists) {
                lines.unshift(greeting);
            }

            if (!alreadyAdded) {
                lines.push(itemName);
            }

            messageTextarea.value = lines.join("\n");

            // Показываем кнопку "Связаться", если она ещё не показана
            const floatBtn = document.getElementById('contact-float-btn');
            if (floatBtn && !floatBtn.classList.contains('show')) {
                floatBtn.classList.add('show');
            }


            // Прокрутка к секции "Контакты"
            // const contactSection = document.getElementById('contact');
            // if (contactSection) {
            //     const headerHeight = 63;
            //     const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
            //     window.scrollTo({
            //         top: elementPosition - headerHeight,
            //         behavior: 'smooth'
            //     });
            // }

            const floatContactBtn = document.getElementById('contact-float-btn');
if (floatContactBtn) {
    floatContactBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 63;
            const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
        }
    });
}

        }
    });
});

});



// Вспомогательная функция throttle для оптимизации обработчиков событий
// Она ограничивает частоту выполнения функции
function throttle(func, delay) {
    let timeoutId;
    let lastArgs;
    let lastThis;

    return function(...args) {
        lastArgs = args;
        lastThis = this;

        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                func.apply(lastThis, lastArgs);
                timeoutId = null;
                lastArgs = null;
                lastThis = null;
            }, delay);
        }
    };
}

// Получаем элемент хедера. Убедитесь, что у вашего хедера есть тег <header>
// или уникальный ID/класс, чтобы его можно было найти.
const header = document.querySelector('header');

// Определяем высоту хедера в сжатом состоянии.
// Если 63px - это высота хедера ПОСЛЕ того, как он уменьшился, используйте это значение.
// Если она может меняться, вам нужно будет измерить ее в CSS для класса .scrolled.
const SHRUNKEN_HEADER_HEIGHT = 63; 

// Оптимизированный обработчик скролла для стилизации хедера
// Например, добавление класса 'scrolled' при прокрутке страницы более чем на 50px
window.addEventListener('scroll', throttle(() => {
    if (header) { // Проверяем, что хедер существует
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
}, 150));


// Плавный скролл с учётом высоты фиксированного хедера для ВСЕХ якорных ссылок
// Выбираем все элементы <a>, у которых атрибут href начинается с '#'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Отменяем стандартное поведение перехода по ссылке

        const targetId = this.getAttribute('href'); // Получаем ID целевой секции (например, "#about")
        
        // Игнорируем ссылки, которые просто указывают на '#' (обычно это ссылки на верх страницы,
        // если не указан конкретный ID)
        if (targetId === '#') {
            // Прокрутка в самый верх страницы
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const targetElement = document.querySelector(targetId); // Находим целевой элемент на странице

        if (targetElement) {
            // Для расчета смещения всегда используем высоту хедера в сжатом состоянии,
            // так как после прокрутки на 50+px хедер будет именно такой высоты.
            // Добавляем небольшой дополнительный отступ (например, 10px) для лучшего визуального позиционирования.
            const offset = SHRUNKEN_HEADER_HEIGHT + 0; 

            // Вычисляем позицию целевого элемента относительно верхней части документа
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth' // Для плавной прокрутки
            });
        }
    });
});

// --- Логика для карусели отзывов ---
document.addEventListener('DOMContentLoaded', () => {
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (reviewsCarousel && prevButton && nextButton) {
        // Функция для прокрутки карусели
        const scrollCarousel = (direction) => {
            // Количество прокрутки должно быть равно видимой ширине карусели.
            // Это обеспечит прокрутку ровно на один "блок" (одну карточку отзыва).
            // clientWidth возвращает внутреннюю ширину элемента (без границ и полос прокрутки).
            const scrollAmount = reviewsCarousel.clientWidth;

            if (direction === 'next') {
                reviewsCarousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else if (direction === 'prev') {
                reviewsCarousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        };

        // Обработчики кликов для кнопок
        prevButton.addEventListener('click', () => scrollCarousel('prev'));
        nextButton.addEventListener('click', () => scrollCarousel('next'));

        // Опционально: Добавление логики для скрытия/отображения кнопок навигации
        // в зависимости от того, есть ли еще контент для прокрутки.
        // Это более сложная логика, которая требует отслеживания reviewsCarousel.scrollLeft,
        // reviewsCarousel.scrollWidth и reviewsCarousel.clientWidth.
        // Для начала, можно оставить кнопки всегда видимыми.
    }
});


// // Throttle функция
// function throttle(fn, wait) {
//     let time = Date.now();
//     return function() {
//         if ((time + wait - Date.now()) < 0) {
//             fn();
//             time = Date.now();
//         }
//     }
// }

// const header = document.querySelector('header');
// const headerHeight = 63;

// // Оптимизированный обработчик скролла
// window.addEventListener('scroll', throttle(() => {
//     header.classList.toggle('scrolled', window.scrollY > 50);
// }, 150));

// // Плавный скролл с учётом высоты хедера
// document.querySelectorAll('nav ul li a').forEach(anchor => {
//     anchor.addEventListener('click', function(e) {
//         e.preventDefault();

//         const targetId = this.getAttribute('href');
//         if(targetId === '#') return;

//         const targetElement = document.querySelector(targetId);
//         if(targetElement) {
//             const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
//             window.scrollTo({
//                 top: elementPosition - headerHeight,
//                 behavior: 'smooth'
//             });
//         }
//     });
// });

//  переключение отзывов 
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');

dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        this.classList.add('active');
    });
});

let currentTestimonial = 0;
function rotateTestimonials() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

setInterval(rotateTestimonials, 5000);


const floatContactBtn = document.getElementById('contact-float-btn');
if (floatContactBtn) {
    floatContactBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 63;
            const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
        }
    });
}
