//Объявление переменной ссылки на api работы с географией
const baseUrlUsers = 'http://192.168.31.234:7080/';

//Функция аутентификации
async function login(login = 'guest', password = '1') {
    try {
        //Формирование строки запроса
        const url = new URL(baseUrlUsers + 'authentication/login');
        url.searchParams.append('login', login);
        url.searchParams.append('password', password);

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error(`Некорректный статус ответа: ${response.status}`);

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data?.success) throw new Error(`Неуспешный ответ: ${response.message}`);
        if (!data?.token) throw new Error('Не указан токен');

        //Возврат ответа
        return data.token;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}