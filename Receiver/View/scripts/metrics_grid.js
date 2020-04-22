import { } from './jquery.js'
import { } from './notify.min.js'
import { } from './kendo.all.min.js'

const grid_update = () => $('#grid').data('kendoGrid').dataSource.read();
const dataSource = new kendo.data.DataSource({
    transport: {
        create: {
            url: '/create_metric',
            type: 'post',
            dataType: 'Json',
            complete: grid_update
        },
        read: {
            url: '/get_metrics',
            type: 'get',
            dataType: 'Json'
        },
        update: {
            url: '/update_metric',
            type: 'post',
            dataType: 'Json',
            complete: grid_update
        },
        destroy: {
            url: '/delete_metric',
            type: 'post',
            dataType: 'Json',
            complete: grid_update
        }
    },
    schema: {
        model: {
            id: 'Id',
            fields: {
                Id: { 
                    type: 'number', 
                    editable: false 
                },
                Name: { 
                    type: 'string' 
                },
                Description: { 
                    type: 'string' 
                },
                MinValue: { 
                    type: 'number' 
                },
                MaxValue: { 
                    type: 'number' 
                }
            }
        }
    },
    pageSize: 10
});

$(document).ready(() => 
    $('#grid').kendoGrid({
        dataSource,
        pageble: true,
        toolbar: [
            { 
                name: "create", 
                text: "Добавить" 
            }
        ],
        editable: "popup",
        pageable: true,
        sortable: true,
        columns: [
            { 
                field: 'Id', 
                title: 'Id' 
            },
            { 
                field: 'Name', 
                title: 'Тип' 
            },
            { 
                field: 'Description', 
                title: 'Описание' 
            },
            { 
                field: 'MinValue', 
                title: 'Минимальное значение' 
            },
            { 
                field: 'MaxValue', 
                title: 'Максимальное значение' 
            },
            { 
                command: ["edit", "destroy"], 
                title: "&nbsp;" 
            }
        ]
    })
)