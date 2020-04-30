import { } from './jquery.min.js'
import { } from './kendo.all.min.js'

const refresh_grid = () => $('#grid').data('kendoGrid').dataSource.read();
const dataSource = new kendo.data.DataSource({
    transport: {
        create: {
            url: '/api/metrics/create',
            type: 'post',
            dataType: 'Json',
            complete: refresh_grid
        },
        read: {
            url: '/api/metrics/get',
            type: 'get',
            dataType: 'Json'
        },
        update: {
            url: '/api/metrics/update',
            type: 'post',
            dataType: 'Json',
            complete: refresh_grid
        },
        destroy: {
            url: '/api/metrics/delete',
            type: 'post',
            dataType: 'Json',
            complete: refresh_grid
        }
    },
    schema: {
        model: {
            id: 'Id',
            fields: {
                Id: { type: 'number', editable: false },
                Name: { type: 'string' },
                Description: { type: 'string' },
                MinValue: { type: 'number' },
                MaxValue: { type: 'number' }
            }
        }
    },
    pageSize: 10
});

$(document).ready(() => {
    $('#grid').kendoGrid({
        dataSource,
        pageble: true,
        toolbar: [ { name: "create", text: "Добавить" } ],
        editable: "popup",
        pageable: true,
        sortable: true,
        columns: [
            { field: 'Id', title: 'Id' },
            { field: 'Name', title: 'Тип' },
            { field: 'Description', title: 'Описание' },
            { field: 'MinValue', title: 'Минимальное значение' },
            { field: 'MaxValue', title: 'Максимальное значение' },
            { command: ["edit", "destroy"], title: "&nbsp;" }
        ]
    });
});