// @ts-check

'use strict'

export default class ConnectStatus{
    constructor(){
        /** @type {HTMLSelectElement} */
        this.connect_btn = document.querySelector('#connect_to_vehicle');
        /** @type {HTMLSelectElement} */
        this.disconnect_btn = document.querySelector('#close_connection');
        /** @type {HTMLElement} */
        this.container = document.querySelector('div#connection_status');
        this.disconnect();
    }
    connect() {
        this.connect_btn.disabled = true;
        this.disconnect_btn.disabled = false;
        this.container.textContent = 'ONLINE';
    }
    disconnect(){
        this.connect_btn.disabled = false;
        this.disconnect_btn.disabled = true;
        this.container.textContent = 'OFFLINE';
    }
}