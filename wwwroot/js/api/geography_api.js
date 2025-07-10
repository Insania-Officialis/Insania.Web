//Объявление переменной ссылки на api работы с географией
const baseUrl = 'http://192.168.31.234:7086/';

//Функция получения географических объектов
async function getGeographyObjectsList() {
    try {
        //Формирование строки запроса
        const url = new URL(baseUrl + 'geography_objects/list');

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error('Некорректный статус ответа: ${response.status}');

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data.success) throw new Error('Неуспешный ответ: ${response.message}');

        //Возврат ответа
        return data;
    } catch (error) {
        //Вывод ошибки
        console.error('Ошибка:', error);
    }
}

//Функция получения координат географических объектов
async function getGeographyObjectsCoordinatesList(geographyObjectId = null) {
    try {
        //Проверки
        if (geographyObjectId === null && geographyObjectId === undefined) throw new Error('Не указан идентификатор географического объекта');

        //Формирование строки запроса
        const url = new URL(baseUrl + 'geography_objects_coordinates/list');
        url.searchParams.append('geography_object_id', geographyObjectId);

        //Отправка запроса
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error('Некорректный статус ответа: ${response.status}');

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data.success) throw new Error('Неуспешный ответ: ${response.message}');

        //Возврат ответа
        return data;
    } catch (error) {
        //Вывод ошибки
        console.error('Ошибка:', error);
    }
}