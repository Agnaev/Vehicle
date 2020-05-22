// @ts-check
'use strict';

Array.prototype['filterWithRemove'] =
    /**remove elements from current array and return them
     * @param { (value?:number, index?:number, array?:Array) => boolean } callback 
     */
    function (callback) {
        return this.reduce((total, ...args) => {
            if (callback(...args)) {
                total.push(args[1]);
            }
            return total;
        }, [])
            .map(
                /** @param {number} index 
                 * @param {number} shift смещение*/
                (index, shift) => this.splice(index - shift, 1)[0]
            );
    };

Array.prototype['shuffle'] = function () {
    return this.reduce((acc, val) => {
        const j = Math.floor(Math.random() * acc.length);
        [val, acc[j]] = [acc[j], val];
        return acc;
    }, [...this]);
};

Storage.prototype.removeBlobs = function () {
    Object.entries(this)
        .forEach(([key, val]) => val.startsWith('blob') && this.removeItem(key));
};

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
    document.cookie.split(';').filter(cook =>
        key.trim() === cook.split('=')[0].trim()
    )[0]?.split('=')[1];


/** @param {string} requestString 
 * @returns {Promise<any>}
*/
const makePartialViwe = requestString =>
    fetch(requestString)
        .then(x => x.text())
        .then(x => $.parseHTML(x)[0])

makePartialViwe('/header.html')
    .then(x => $(x).appendTo($('header.header')));

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
    (async function interval() {
        const img_name = this.images[this.pointer];
        let src = localStorage.getItem(img_name);
        if (!src) {
            src = `/images/${img_name}`;
            const blob = await fetch(src).then(x => x.blob());
            src = URL.createObjectURL(blob);
            localStorage.setItem(img_name, src);
        }
        this.slider.src = src;
        this.pointer = ++this.pointer !== this.images.length && this.pointer || 0;
        setTimeout(interval.bind(this), 5000);
    }).call({
        pointer: 0,
        images,
        slider
    });
}

