// ==================================
// public/script.js - ФРОНТЕНД (выполняется в браузере)
// ==================================

(function () {
    // ========== 1. СОЗДАНИЕ КАРТОЧЕК ТОРТОВ ==========
    const cakeCatalog = [
        {
            name: "Медовый нежный",
            desc: "Тонкие медовые коржи, сметанный крем, грецкие орехи.",
            price: "2100 ₽",
            img: "cakes/medovik.jpg"
        },
        {
            name: "Красный бархат",
            desc: "Американская классика с творожным сыром и ягодным конфи.",
            price: "2600 ₽",
            img: "cakes/barhat.avif"
        },
        {
            name: "Фисташка-малина",
            desc: "Пряный фисташковый бисквит, малиновое конфи, белый ганаш.",
            price: "2950 ₽",
            img: "cakes/fist.avif"
        },
        {
            name: "Три шоколада",
            desc: "Муссовый торт на темном, молочном и белом шоколаде.",
            price: "2800 ₽",
            img: "cakes/choco.avif"
        }
    ];

    const container = document.getElementById('cakeContainer');
    if (container) {
        container.innerHTML = '';

        cakeCatalog.forEach(cake => {
            const card = document.createElement('div');
            card.className = 'cake-card';
            card.innerHTML = `
                <img class="cake-img" src="${cake.img}" alt="${cake.name}" loading="lazy">
                <h3>${cake.name}</h3>
                <p class="cake-desc">${cake.desc}</p>
                <div class="price">${cake.price}</div>
                <button class="btn-small quick-order">
                    <i class="fas fa-shopping-bag" style="margin-right: 8px;"></i>Быстрый заказ
                </button>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.quick-order').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const cakeName = this.closest('.cake-card').querySelector('h3').innerText;
                const cakeSelect = document.getElementById('cakeSelect');
                if (cakeSelect) {
                    for (let option of cakeSelect.options) {
                        if (option.text.includes(cakeName.substring(0, 10))) {
                            cakeSelect.value = option.value;
                            break;
                        }
                    }
                }
                alert(`✨ Вы выбрали: "${cakeName}". Заполните форму ниже!`);
                document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // ========== 2. ФУНКЦИИ ВАЛИДАЦИИ ==========

    // Валидация имени (только буквы, пробелы и дефисы)
    function validateName(name) {
        const nameRegex = /^[А-Яа-яA-Za-z\s\-]+$/;
        return nameRegex.test(name) && name.trim().length >= 2;
    }

    // Валидация телефона по паттерну +7(999)999-99-99
    function validatePhone(phone) {
        const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }

    // Валидация email
    function validateEmail(email) {
        // Простая проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Функция для отображения ошибки
    function showError(inputElement, message) {
        // Удаляем существующую ошибку
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Создаем новую ошибку
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#b45f4f';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.marginLeft = '15px';
        errorDiv.textContent = message;

        inputElement.style.borderColor = '#b45f4f';
        inputElement.parentNode.appendChild(errorDiv);
    }

    function clearError(inputElement) {
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        inputElement.style.borderColor = '#f0cfc2';
    }

    // ========== 3. ФОРМАТТЕР ДЛЯ ТЕЛЕФОНА ==========
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

        if (value.length > 0) {
            // Если номер начинается с 7 или 8, заменяем на +7
            if (value[0] === '8') {
                value = '7' + value.substring(1);
            }

            // Форматируем: +7(999)999-99-99
            let formatted = '+7';

            if (value.length > 1) {
                formatted += '(' + value.substring(1, 4);
            }
            if (value.length >= 4) {
                formatted += ')' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.substring(9, 11);
            }

            input.value = formatted;
        }
    }

    // ========== 4. ОБРАБОТКА ФОРМЫ ==========
    const form = document.getElementById('cakeOrderForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    // Добавляем поле email, если его нет в HTML
    if (!emailInput) {
        const phoneGroup = phoneInput.parentNode;
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        emailGroup.innerHTML = `
            <input type="email" id="email" placeholder="Email" required>
        `;
        phoneGroup.parentNode.insertBefore(emailGroup, phoneGroup.nextSibling);
    }

    // Добавляем маску для телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            formatPhoneNumber(this);
            clearError(this);
        });
    }

    // Очистка ошибок при вводе
    if (nameInput) {
        nameInput.addEventListener('input', () => clearError(nameInput));
    }

    const emailInputElement = document.getElementById('email');
    if (emailInputElement) {
        emailInputElement.addEventListener('input', () => clearError(emailInputElement));
    }

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Получаем значения
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const cake = document.getElementById('cakeSelect').value;
            const message = document.getElementById('message').value.trim();

            // Валидация
            let isValid = true;

            // Проверка имени
            if (!validateName(name)) {
                showError(document.getElementById('name'), 'Имя должно содержать только буквы (минимум 2 символа)');
                isValid = false;
            }

            // Проверка телефона
            if (!validatePhone(phone)) {
                showError(document.getElementById('phone'), 'Телефон должен быть в формате +7(999)999-99-99');
                isValid = false;
            }

            // Проверка email
            if (!validateEmail(email)) {
                showError(document.getElementById('email'), 'Введите корректный email (например: name@domain.ru)');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Отправка формы
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        cake: cake,
                        message: message
                    })
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    alert('✅ Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
                    form.reset();

                    // Очищаем все ошибки и границы
                    document.querySelectorAll('input, select, textarea').forEach(input => {
                        input.style.borderColor = '#f0cfc2';
                    });
                } else {
                    alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка'));
                }
            } catch (error) {
                alert('❌ Не удалось отправить заказ. Проверьте, запущен ли сервер (node server.js)');
                console.error('Ошибка отправки:', error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========== 5. ПЛАВНЫЙ СКРОЛЛ ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('✅ script.js загружен с валидацией!');
})();