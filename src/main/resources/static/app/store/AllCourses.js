/**
 * 全量课程，供“任课安排”里的复选框列表使用。
 */
Ext.define('App.store.AllCourses', {
    extend: 'Ext.data.Store',

    alias: 'store.allcourses',

    model: 'App.model.Course',

    proxy: {
        type: 'ajax',
        url: 'api/course/list',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    sorters: [{ property: 'courseNo', direction: 'ASC' }]
});
