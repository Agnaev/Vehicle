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
            event => document.body.addEventListener(event, e => e.preventDefault())
        );
    $('#clearTable')?.on('click', e =>
        fetch('/api/metric_values/delete', {
            method: 'post'
        })
            .then(response => {
                if (response.ok) {
                    if(window['redrawCharts']) {
                        window['redrawCharts']();
                    }
                    return response.json();
                }
                throw new Error('error')
            })
            .then($.notify.bind(null, 'Данные из таблицы значений были удалены.', 'success'))
            .catch($.notify.bind(null, 'Произошла ошибка при удалении значений из таблицы значений', 'error'))
    )
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

export const slider = async (slider = $('#slider')[0]) => {
    const images = (await fetch_json('/api/get_images_list')).shuffle();
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

