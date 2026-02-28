// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Проверка наличия переменных окружения
if (!process.env.TELEGRAM_TOKEN || !process.env.CHAT_ID) {
    console.error('❌ Ошибка: TELEGRAM_TOKEN или CHAT_ID не найдены!');
    console.log('Создайте файл .env с:');
    console.log('TELEGRAM_TOKEN=ваш_токен_бота');
    console.log('CHAT_ID=ваш_chat_id');
    process.exit(1);
}

console.log('✅ Токен загружен');
console.log('✅ Chat ID загружен');

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздаем статические файлы из папки Public
app.use(express.static(path.join(__dirname, 'Public')));

// Обработка заказов
app.post('/api/order', async (req, res) => {
    try {
        const { name, phone, cake, message } = req.body;

        console.log('📦 Получен заказ:', { name, phone, cake, message });

        // Формируем сообщение для Telegram
        const telegramMessage = `
🍰 <b>Новый заказ!</b>
👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
🎂 <b>Торт:</b> ${cake}
📝 <b>Комментарий:</b> ${message || 'Нет'}
        `;

        // Отправка в Telegram
        const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

        const response = await axios.post(telegramUrl, {
            chat_id: process.env.CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
        });

        console.log('✅ Сообщение отправлено в Telegram');

        res.json({
            status: 'success',
            message: 'Заказ успешно отправлен!'
        });
    } catch (error) {
        console.error('❌ Ошибка при отправке в Telegram:', error.response?.data || error.message);
        res.status(500).json({
            status: 'error',
            message: 'Ошибка при отправке заказа'
        });
    }
});

// Все остальные запросы отдаем index.html из папки Public
app.use((req, res, next) => {
    // Если запрос не к API и не к статическому файлу
    if (!req.path.startsWith('/api/') && !req.path.includes('.')) {
        res.sendFile(path.join(__dirname, 'Public', 'index.html'));
    } else {
        next();
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📁 Статические файлы из папки: ${path.join(__dirname, 'Public')}`);
});