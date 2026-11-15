Ext.define('App.store.Teachers', {
    extend: 'Ext.data.Store',

    alias: 'store.teachers',

    model: 'App.model.Teacher',

    pageSize: 25,

    // 由视图控制器在装配好查询条件后显式加载，避免自动加载抢跑
    autoLoad: false,

    // 条件通过 proxy 的 extraParams 下发，服务端负责全部筛选与分页
    remoteFilter: false,
    remoteSort: true,

    proxy: {
        type: 'ajax',
        url: 'api/teacher/page',
        simpleSortMode: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});
