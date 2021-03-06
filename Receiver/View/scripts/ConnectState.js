// @ts-check
'use strict';

import { } from './minifyjs/jquery.min.js';

export default class ConnectStatus {
    /** @param {Function} notificator */
    constructor(notificator) {
        /** @type {JQuery<HTMLElement>} */
        this.status = $('div#connection_status');
        /** @type {{
         * connect: JQuery<HTMLSelectElement>, 
         * disconnect: JQuery<HTMLSelectElement>
         * clear: JQuery<HTMLSelectElement>
         * }} */
        this.btn = {
            connect: $('#connect_to_vehicle'),
            disconnect: $('#close_connection'),
            clear: $('#clearTable')
        };
        this.notificator = notificator;
        this.disconnect(false);
    }
    /** disable connect btn & enable disconnect btn & set online status */
    connect() {
        this.notificator('Подключение к БПЛА прошло успешно', 'success');
        this.btn.disconnect.prop('disabled', false);
        [this.btn.connect, this.btn.clear]
            .forEach(btn => btn.prop('disabled', true));
        this.status.text('ONLINE');
    }
    /** enable connect btn & disable disconnect btn & set offline status */
    disconnect(showMessage = true) {
        showMessage && this.notificator('Подключения к БПЛА было прервано', 'warn');
        [this.btn.connect, this.btn.clear]
            .forEach(btn => btn.prop('disabled', false));
        this.btn.disconnect.prop('disabled', true);
        this.status.text('OFFLINE');
    }
};
