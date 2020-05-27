// @ts-check
'use strict';

import { } from './Array.prototype.js';

$(document).ready(e => {
    ['contextmenu', 'selectstart', 'copy', 'select', 'dragstart', 'beforecopy']
        .forEach(
            event => $('body').on(event, e => e.preventDefault())
        );
    $('#clearTable')?.on('click', e => {
        if (confirm('Вы действительно хотите удалить все записи из базы данных?') === false) {
            return;
        }
        fetch('/api/metric_values', {
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
            .then($.notify.bind(null, 'Данные из таблицы значений были удалены.', 'success'))
            .catch($.notify.bind(null, 'Произошла ошибка при удалении значений из таблицы значений', 'error'));
    });
});

$.notify?.defaults({
    globalPosition: 'top centre'
});

/**
* @param {string} url Url to api.
* @param {{[key:string]:string}} options Request options.
* @returns {Promise} Result from server.
*/
export const fetch_json = (url, options = {}) =>
    fetch(url, options)
        .then(x => x.json())
        .catch(e => e);

/** @param { String } key cookie key
 * @returns { string | null } cookie value by key
*/
export const getCookie = key =>
    document.cookie.split(';').find(cook =>
        key.trim() === cook.split('=')[0].trim()
    )?.split('=')[1];


/** @param {string} requestString 
 * @returns {Promise<any>}
*/
const makePartialViwe = requestString =>
    fetch(requestString)
        .then(x => x.text())
        .then(x => $.parseHTML(x)[0])

makePartialViwe('/header.html')
    .then(x => $(x).appendTo($('header.header')));

makePartialViwe('/footer.html')
    .then(x => $(x).appendTo($('footer.footer')));

export const slider = async slider => {
    await makePartialViwe('/slider.html')
        .then(x => $(x).prependTo($('main')))
        .then(() => slider = slider || $('#slider')[0]);

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
            const blob = await fetch(src).then(x => x.blob());
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
    return arr.reduce((res, item) => Object.assign(res, { [item[field]]: item }), {});
}

