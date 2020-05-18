import { } from './jquery.min.js';
import { } from './kendo.all.min.js';
import { slider, fetch_json } from './common.js';

const refresh_grid = () => $('#grid').data('kendoGrid').dataSource.read();

const config = {
    url: '/api/states',
    dataType: 'Json',
};

const dataSource = new kendo.data.DataSource({
    transport: {
        create: {
            type: 'post',
            ...config,
            complete: refresh_grid
        },
        read: {
            ...config,
            type: 'get',
        },
        update: {
            ...config,
            type: 'put',
            complete: refresh_grid
        },
        destroy: {
            ...config,
            type: 'delete',
            complete: refresh_grid
        }
    },
    schema: {
        model: {
            id: 'Id',
            fields: {
                Id: { type: 'number', editable: false },
                MetricTypeId: { type: 'string' },
                StateId: { type: 'string' },
                MinValue: { type: 'number' },
                MaxValue: { type: 'number' }
            }
        }
    },
    pageSize: 15
});

function editor(container, options) {
    const dataSource = Object.keys(this)
        .filter(x => +x)
        .map(x => ({
            Id: x,
            Name: this[x]?.Name
        }));
    $(`<input required name="${options.field}"/>`)
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource
        })
}

const createGrid = (metrics, states) => {
    const getColor = color => {
        return { 
            'green': '#6bf35c', 
            'yellow': '#ffff55' 
        }[color] || color;
    };

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
                title: 'Тип',
                editor: editor.bind(metrics),
                field: 'MetricTypeId',
                template: item => metrics[+item.MetricTypeId]?.Name
            },
            {
                title: 'Состояние',
                editor: editor.bind(states),
                field: 'StateId',
                template: item => {
                    const { color, Name } = states[+item.StateId];
                    return `<div style='background-color: ${getColor(color)}'>${Name}</div>`;
                }
            },
            { field: 'MinValue', title: 'Минимальное значение' },
            { field: 'MaxValue', title: 'Максимальное значение' },
            { command: ["edit", "destroy"], title: "&nbsp;" }
        ]
    });
};

$(document).ready(async () => {
    const [_metrics, states] = await Promise.all([fetch_json('/api/metrics'), fetch_json('/api/states/list')]);

    const metrics = _metrics.reduce((res, item) => ({
        ...res,
        [item.Id]: item
    }), {});

    createGrid(metrics, states);
    slider();
});


