import { } from './minifyjs/jquery.min.js';
import { } from './minifyjs/kendo.all.min.js';
import { slider, fetch_json, indexing } from './common.js';

const refresh_grid = () => $('#grid').data('kendoGrid').dataSource.read();

const dataSource = new kendo.data.DataSource({
    transport: {
        create: {
            type: 'post',
            url: '/api/states',
            complete: refresh_grid
        },
        read: {
            url: '/api/states',
            type: 'get',
        },
        update: {
            url: '/api/states',
            type: 'put',
            complete: refresh_grid
        },
        destroy: {
            url: '/api/states',
            type: 'delete',
            complete: refresh_grid
        }
    },
    schema: {
        model: {
            id: 'Id',
            fields: {
                Id: { type: 'number', editable: false },
                SensorTypeId: { type: 'string' },
                StateId: { type: 'string' },
                MinValue: { type: 'number' },
                MaxValue: { type: 'number' }
            }
        }
    },
    pageSize: 15
});

function editor(container, options) {
    const dataSource = Object.entries(this)
        .filter(x => +x[0])
        .map(([Id, { Name }]) => ({ Id, Name }));
    $(`<input required name="${options.field}"/>`)
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource
        });
}

const createGrid = ([sensors, states]) => {
    sensors = indexing(sensors, 'Id');
    const getColor = color => ({
        'green': '#6bf35c',
        'red': 'red',
        'yellow': '#ffff55'
    }[color] || color);

    $('#grid').kendoGrid({
        dataSource,
        pageble: true,
        toolbar: [{ name: "create", text: "Добавить" }],
        editable: "popup",
        pageable: true,
        sortable: true,
        columns: [
            { field: 'Id', title: 'Id' },
            {
                title: 'Датчик',
                editor: editor.bind(sensors),
                field: 'SensorTypeId',
                template: item => sensors[+item.SensorTypeId]?.Name
            },
            {
                title: 'Состояние',
                editor: editor.bind(states),
                field: 'StateId',
                template: item => {
                    const _state = states[+item.StateId];
                    return `<div style='background-color: ${getColor(_state?.color)}'>${_state?.Name}</div>`;
                }
            },
            { field: 'MinValue', title: 'Минимальное значение' },
            { field: 'MaxValue', title: 'Максимальное значение' },
            { command: ["edit", "destroy"], title: "&nbsp;" }
        ]
    });
};

$(document).ready(() => {
    Promise.all([
        fetch_json('/api/sensors'), 
        fetch_json('/api/states/list')
    ])
    .then(createGrid)
    .catch(exc => {
        console.error('Ошибка при запросе данных с сервера', exc);
        $.notify('Произошла ошибка при запросе данных с сервера', 'error')
    });
    slider();
});


