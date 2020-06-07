import { } from './minifyjs/jquery.min.js';
import { } from './minifyjs/kendo.all.min.js';
import { slider } from './common.js';

const refresh_grid = () => $('#grid').data('kendoGrid').dataSource.read();
const dataSource = new kendo.data.DataSource({
    transport: {
        create: {
            url: '/api/sensors',
            type: 'post',
            complete: refresh_grid
        },
        read: {
            url: '/api/sensors',
            type: 'get',
        },
        update: {
            url: '/api/sensors',
            type: 'put',
            complete: refresh_grid
        },
        destroy: {
            url: '/api/sensors',
            type: 'delete',
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

const createGrid = () => $('#grid').kendoGrid({
    dataSource,
    pageble: true,
    toolbar: [{ name: "create", text: "Добавить" }],
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


$(document).ready(createGrid);

slider();
