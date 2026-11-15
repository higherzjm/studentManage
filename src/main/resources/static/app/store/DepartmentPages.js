Ext.define('App.store.DepartmentPages', {
    extend: 'Ext.data.Store',

    alias: 'store.departmentpages',

    model: 'App.model.Department',

    pageSize: 20,

    autoLoad: false,

    remoteFilter: false,
    remoteSort: true,

    proxy: {
        type: 'ajax',
        url: 'api/department/page',
        simpleSortMode: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});
