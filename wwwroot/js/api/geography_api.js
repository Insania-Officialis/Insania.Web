//Объявление переменной ссылки на api работы с географией
const baseUrlGeographyRead = 'http://192.168.31.234:7086/';
const baseUrlGeographyCommit = 'http://192.168.31.234:7087/';

//Функция получения географических объектов
async function getGeographyObjectsList(has_coordinates = true, type_ids = [4,6,8]) {
    try {
        //Формирование строки запроса
        const url = new URL(baseUrlGeographyRead + 'geography_objects/list');
        url.searchParams.append('has_coordinates', has_coordinates);
        if (type_ids && type_ids.length) {
            type_ids.forEach(id => {
                url.searchParams.append('type_ids', id.toString());
            });
        }

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
        if (!data?.items?.length) throw new Error('Не указаны географические объекты');

        //Возврат ответа
        return data.items;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}

//Функция получения координат географических объектов
async function getGeographyObjectsCoordinatesList(geographyObjectId = null) {
    try {
        //Проверки
        if (geographyObjectId === null && geographyObjectId === undefined) throw new Error('Не указан идентификатор географического объекта');

        //Формирование строки запроса
        const url = new URL(baseUrlGeographyRead + 'geography_objects_coordinates/list');
        url.searchParams.append('geography_object_id', geographyObjectId);

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

        //Возврат ответа
        return data;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}

//Функция обновления координат географических объектов
async function upgradeGeographyObjectsCoordinates(geographyObjectId = null, coordinateId = null, coordinates = null, token = null) {
    try {
        //Проверки
        if (geographyObjectId === null || geographyObjectId === undefined) throw new Error('Не указан идентификатор географического объекта');
        if (coordinateId === null || coordinateId === undefined) throw new Error('Не указан идентификатор координаты');
        if (coordinates === null || coordinates === undefined) throw new Error('Не указаны координаты');

        //Формирование строки запроса
        const url = new URL(baseUrlGeographyCommit + 'geography_objects_coordinates/upgrade');

        //Формирование тела запроса
        const requestBody = {
            geography_object_id: geographyObjectId,
            coordinate_id: coordinateId,
            coordinates: coordinates
        };

        //Формирование заголовков запроса
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        //Отправка запроса
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        //Проверка статуса ответа
        if (!response.ok) throw new Error(`Некорректный статус ответа: ${response.status}`);

        //Преобразование ответа в json
        const data = await response.json();

        //Проверка структуры ответа
        if (!data?.success) throw new Error(`Неуспешный ответ: ${response.message}`);
        if (!data?.id) throw new Error('Не указан идентфиикатор координаты географического ответа');

        //Возврат ответа
        return data;
    } catch (error) {
        //Вывод ошибки
        console.error(`Ошибка: ${error}`);
    }
}