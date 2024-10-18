ymaps.ready(init);

let myMap, firstPoint = null, secondPoint = null, rectangle, randomPoint;

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Координаты центра карты (Москва)
        zoom: 10
    });

    // Обработчик нажатия мыши для выбора точек прямоугольника
    myMap.events.add('click', function (e) {
        const coords = e.get('coords');

        // Если первая точка еще не выбрана
        if (!firstPoint) {
            firstPoint = coords;
            alert("Первая точка выбрана. Выберите вторую точку.");
        }
        // Если выбрана первая точка, то после второго клика фиксируем вторую точку
        else if (!secondPoint) {
            secondPoint = coords;

            // Создаем прямоугольник на основе двух точек
            createRectangle(firstPoint, secondPoint);

            // Генерируем случайную точку внутри прямоугольника
            generateRandomPoint(firstPoint, secondPoint);

            // Сбрасываем точки для возможного выбора нового прямоугольника
            firstPoint = null;
            secondPoint = null;
        }
    });
}

// Функция для создания прямоугольника
function createRectangle(topLeft, bottomRight) {
    if (rectangle) {
        myMap.geoObjects.remove(rectangle);
    }

    rectangle = new ymaps.GeoObject({
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    topLeft,
                    [topLeft[0], bottomRight[1]],
                    bottomRight,
                    [bottomRight[0], topLeft[1]],
                    topLeft
                ]
            ]
        }
    }, {
        strokeColor: '#0000FF',
        strokeWidth: 2
    });

    myMap.geoObjects.add(rectangle);
}

// Функция для генерации случайной точки внутри прямоугольника
function generateRandomPoint(topLeft, bottomRight) {
    const minLat = Math.min(topLeft[0], bottomRight[0]);
    const maxLat = Math.max(topLeft[0], bottomRight[0]);
    const minLon = Math.min(topLeft[1], bottomRight[1]);
    const maxLon = Math.max(topLeft[1], bottomRight[1]);

    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lon = Math.random() * (maxLon - minLon) + minLon;

    // Удаляем предыдущую случайную точку, если она была
    if (randomPoint) {
        myMap.geoObjects.remove(randomPoint);
    }

    randomPoint = new ymaps.Placemark([lat, lon], {
        balloonContent: 'Случайная точка'
    }, {
        preset: 'islands#icon',
        iconColor: '#FF0000'
    });

    myMap.geoObjects.add(randomPoint);
}
