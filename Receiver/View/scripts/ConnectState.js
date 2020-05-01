// @ts-check
'use strict';

export default class ConnectStatus {
    constructor() {
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
        this.disconnect();
    }
    /** disable connect btn & enable disconnect btn & set online status */
    connect() {
        this.btn.connect.disabled = true;
        this.btn.disconnect.disabled = false;
        this.status.textContent = 'ONLINE';
    }
    /** enable connect btn & disable disconnect btn & set offline status */
    disconnect() {
        this.btn.connect.disabled = false;
        this.btn.disconnect.disabled = true;
        this.status.textContent = 'OFFLINE';
    }
};