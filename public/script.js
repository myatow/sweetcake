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
        container.innerHTML = ''; // Очищаем контейнер

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

        // Добавляем обработчики на кнопки "Быстрый заказ"
        document.querySelectorAll('.quick-order').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const cakeName = this.closest('.cake-card').querySelector('h3').innerText;

                // Находим выпадающий список в форме и выбираем этот торт
                const cakeSelect = document.getElementById('cakeSelect');
                if (cakeSelect) {
                    // Пытаемся найти соответствующий пункт
                    for (let option of cakeSelect.options) {
                        if (option.text.includes(cakeName.substring(0, 10))) {
                            cakeSelect.value = option.value;
                            break;
                        }
                    }
                }

                // Показываем сообщение и плавно прокручиваем к форме
                alert(`✨ Вы выбрали: "${cakeName}". Заполните форму ниже!`);
                document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // ========== 2. ОТПРАВКА ФОРМЫ ЗАКАЗА НА СЕРВЕР ==========
    const form = document.getElementById('cakeOrderForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Останавливаем обычную отправку формы

            // Получаем значения полей
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const cake = document.getElementById('cakeSelect').value;
            const message = document.getElementById('message').value.trim();

            // Простая валидация
            if (!name) {
                alert('Пожалуйста, введите ваше имя');
                document.getElementById('name').focus();
                return;
            }

            if (!phone) {
                alert('Пожалуйста, введите номер телефона для связи');
                document.getElementById('phone').focus();
                return;
            }

            // Показываем, что началась отправка
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            try {
                // Отправляем данные на сервер (ОТНОСИТЕЛЬНЫЙ ПУТЬ!)
                const response = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        cake: cake,
                        message: message
                    })
                });

                // Парсим ответ от сервера
                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Успех!
                    alert('✅ Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
                    form.reset(); // Очищаем форму
                } else {
                    // Ошибка от сервера
                    alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка'));
                }
            } catch (error) {
                // Ошибка сети или сервер не отвечает
                alert('❌ Не удалось отправить заказ. Проверьте, запущен ли сервер (node server.js)');
                console.error('Ошибка отправки:', error);
            } finally {
                // Возвращаем кнопку в исходное состояние
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========== 3. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ВСЕХ ССЫЛОК ==========
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

    // ========== 4. НЕБОЛЬШАЯ ПРОВЕРКА ==========
    console.log('✅ script.js загружен и работает!');
    console.log('📝 Форма найдена?', form ? 'Да' : 'Нет');
    console.log('🍰 Карточек тортов создано:', cakeCatalog.length);
})();