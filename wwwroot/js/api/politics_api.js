//Объявление переменной ссылки на api работы с политикиой
const baseUrlPoliticsRead = 'http://192.168.31.234:7083/';

//Константы для кэширования
const cachePoliticsName = 'politics-cache';
const cachePoliticsMaxAge = 86400000; // 24 часа

//Функция получения стран
async function getCountriesList(token, has_coordinates = true) {
    try {
        //Формирование строки запроса
        const url = new URL(baseUrlPoliticsRead + 'countries/list');

        //Добавление query-параметров
        url.searchParams.append('has_coordinates', has_coordinates);

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error(`Некорректный статус ответа: ${response.status}`);

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data?.success) throw new Error(`Неуспешный ответ: ${response.message}`);
        if (!data?.items?.length) throw new Error('Не указаны географические объекты');

        //Возврат ответа
        return data.items;
    } catch (error) {
        //Вывод ошибки
        console.error('Ошибка:', error);
    }
}

//Функция получения стран с координатами
async function getCountriesListWithCoordinates(token) {
    try {
        //Формирование строки запроса
        const url = new URL(baseUrlPoliticsRead + 'countries/list_with_coordinates');

        //Создание ключа кэша
        const cacheKey = url.toString();

        //Получение кэша
        const cache = await caches.open(cachePoliticsName);

        //Поиск данных в кэше
        const cachedResponse = await cache.match(cacheKey);

        //Если есть данные в кэше
        if (cachedResponse) {
            //Получение даты записи в кэш
            const dateValue = cachedResponse.headers.get('date');

            //Получение даты завершения времени жизни кэша
            const exp = Date.parse(dateValue ?? '') + cachePoliticsMaxAge;

            //Возврат данных при их наличии в кэше
            if (Date.now() < exp) {
                const data = await cachedResponse.json();
                return data;
            }
        }

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error(`Некорректный статус ответа: ${response.status}`);

        //Копирование ответа для избежания конфликта чтения одного потока
        const clone = response.clone();

        //Запись в кэш
        await cache.put(cacheKey, response);

        //Преобразование ответа в json
        const data = await clone.json();

        //Проверка структуры ответа
        if (!data?.success) throw new Error(`Неуспешный ответ: ${response.message}`);
        if (!data?.items?.length) throw new Error('Не указаны страны');

        //Возврат ответа
        return data.items;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}

//Функция получения координат стран
async function getCountriesCoordinatesList(token, countryId = null) {
    try {
        //Проверки
        if (countryId === null && countryId === undefined) throw new Error('Не указан идентификатор страны');

        //Формирование строки запроса
        const url = new URL(baseUrlPoliticsRead + 'countries_coordinates/list');

        //Добавление query-параметров
        url.searchParams.append('country_id', countryId);

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error(`Некорректный статус ответа: ${response.status}`);

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data?.success) throw new Error(`Неуспешный ответ: ${response.message}`);
        if (!data?.items?.length) throw new Error('Не указаны координаты географического объекта');

        //Возврат ответа
        return data;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}