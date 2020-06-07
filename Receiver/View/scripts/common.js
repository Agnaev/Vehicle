// @ts-check
'use strict';

import { } from './Array.prototype.js';

$(document).ready(e => {
    $('#clearTable')?.on('click', _e => {
        if (confirm('Вы действительно хотите удалить все записи из базы данных?') === false) {
            return;
        }
        fetch('/api/sensors_values', {
            method: 'delete'
        })
            .then(response => {
                if (response.ok) {
                    if (window['redrawCharts']) {
                        window['redrawCharts']();
                    }
                    return;// response.json();
                }
                throw new Error('error');
            })
            .then($?.notify?.bind(null, 'Данные из таблицы значений были удалены.', 'success'))
            .catch($?.notify?.bind(null, 'Произошла ошибка при удалении значений из таблицы значений', 'error'));
    });
});

$?.notify?.defaults({
    globalPosition: 'top centre'
});

/**
* @param {string} url Url to api.
* @param {{[key:string]:string}} options Request options.
* @returns {Promise} Result from server.
*/
export const fetch_json = async (url, options = {}) => {
    const request = await fetch(url, options);
    const response = await request.json();
    return response;
}

/** @param { String } key cookie key
 * @returns { string | null } cookie value by key
*/
export const getCookie = key => 
    document.cookie.split(';').find(
        cook => key.trim() === cook.split('=')[0].trim()
    )?.split('=')[1];

/** @param {string} requestString 
 * @returns {Promise<any>}
*/
const makePartialViwe = async requestString => {
    const request = await fetch(requestString)
    const text = await request.text();
    return $.parseHTML(text)[0];
}

makePartialViwe('/header.html')
    .then(x => $(x).appendTo($('header.header')));

makePartialViwe('/footer.html')
    .then(x => $(x).appendTo($('footer.footer')));

export const slider = async slider => {
    const slider_markup = await makePartialViwe('/slider.html');
    $(slider_markup).prependTo($('main'));
    slider = slider || $('#slider')[0];

    let images = JSON.parse(getCookie('images_list') ?? '[]');
    if (!images || images.length === 0) {
        images = (await fetch_json('/api/get_images_list')).shuffle();
        document.cookie = `images_list=${JSON.stringify(images)};max-age=1800;`;
    };
    localStorage.removeBlobs();
    let pointer = 0;
    const interval = async () => {
        const img_name = images[pointer];
        let src = localStorage.getItem(img_name);
        if (!src) {
            src = `/images/${img_name}`;
            const blob_req = await fetch(src)
            const blob = await blob_req.blob();
            localStorage.setItem(img_name, URL.createObjectURL(blob));
        }
        slider.src = src;
        pointer = ++pointer !== images.length ? pointer : 0;
        setTimeout(interval, 5000);
    }
    interval();
}

/** @param { Array<any> } arr массив, который необходимо проиндексировать
 * @param { string } field поля для индексации
 */
export const indexing = (arr, field) => {
    return arr.reduce((res, item) => Object.assign(res, {
        [item[field]]: item
    }), {});
}

