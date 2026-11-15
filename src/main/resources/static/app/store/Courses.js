Ext.define('App.store.Courses', {
    extend: 'Ext.data.Store',

    alias: 'store.courses',

    model: 'App.model.Course',

    pageSize: 25,

    remoteFilter: false,
    remoteSort: true,

    proxy: {
        type: 'ajax',
        url: 'api/course/page',
        simpleSortMode: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});
