// @ts-check
'use strict';

export default class ConnectStatus {
    /** @param {Function} notificator */
    constructor(notificator, showMessage = true) {
        /** @type {HTMLElement} */
        this.status = document.querySelector('div#connection_status');
        /** @type {{
         * connect: HTMLSelectElement, 
         * disconnect: HTMLSelectElement
         * }} */
        this.btn = {
            connect: document.querySelector('#connect_to_vehicle'),
            disconnect: document.querySelector('#close_connection')
        }
        this.notificator = notificator;
        this.disconnect(showMessage);
    }
    /** disable connect btn & enable disconnect btn & set online status */
    connect() {
        this.notificator('Подключение к БПЛА прошло успешно', 'success');
        this.btn.connect.disabled = true;
        this.btn.disconnect.disabled = false;
        this.status.textContent = 'ONLINE';
    }
    /** enable connect btn & disable disconnect btn & set offline status */
    disconnect(showMessage = true) {
        showMessage && this.notificator('Подключения к БПЛА было прервано', 'warn');
        this.btn.connect.disabled = false;
        this.btn.disconnect.disabled = true;
        this.status.textContent = 'OFFLINE';
    }
};
