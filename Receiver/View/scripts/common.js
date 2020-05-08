// @ts-check
'use strict';

Array.prototype['filterWithRemove'] =
    /**remove elements from current array and return them
     * @param {(value?:number, index?:number, array?:Array) => boolean} callback 
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
    return this.reduce((acc, v, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [v, acc[j]] = [acc[j], v];
        return acc;
    }, [...this]);
};

document.addEventListener('DOMContentLoaded', e => {
    ['contextmenu', 'selectstart', 'copy', 'select', 'dragstart', 'beforecopy']
        .forEach(
            event => document.body.addEventListener(event, e => e.preventDefault())
        );
}, {
    once: true
});

$.notify?.defaults({
    globalPosition: 'top centre'
});

/**
* @param {string} url Url to api.
* @param {{[key:string]:string}} options Request options.
* @returns {Promise} Result from server.
*/
export const fetch_json = (url, options = {}) => fetch(url, options)
    .then(x => x.json());

export const slider = (slider = document.querySelector('#slider')) =>
    fetch_json('/api/get_images_list')
        .then(images => {
            (function interval() {
                this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
                this.pointer = ++this.pointer !== this.images.length && this.pointer || 0;
                setTimeout(interval.bind(this), 5000);
            }).call({
                pointer: 0,
                images: images.shuffle(),
                slider
            });
        });

