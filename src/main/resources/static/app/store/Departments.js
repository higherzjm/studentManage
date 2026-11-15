Ext.define('App.store.Departments', {
    extend: 'Ext.data.Store',

    alias: 'store.departments',

    model: 'App.model.Department',

    proxy: {
        type: 'ajax',
        url: 'api/department/list',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    sorters: [{ property: 'deptCode', direction: 'ASC' }]
});
