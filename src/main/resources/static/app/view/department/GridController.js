Ext.define('App.view.department.GridController', {
    extend: 'App.view.base.GridController',

    alias: 'controller.departmentGrid',

    apiPrefix: 'api/department',

    formWindowClass: 'App.view.department.FormWindow',

    itemName: '院系',

    // 院系名称在所有下拉框里都是同一份数据
    dictionaryStoreIds: ['dict-departments'],

    totalText: function (total) {
        return '共 <b>' + total + '</b> 个院系';
    },

    collectParams: function () {
        return App.Util.compact({
            keyword: this.getView().down('#searchForm').getValues().keyword
        });
    },

    /** 院系被教师或课程引用时后端会拒绝删除，提示语里说清楚。 */
    confirmText: function (record) {
        return '确定删除院系「' + record.get('deptName') + '」吗？'
            + '若该院系下仍有教师或课程，删除会被服务端拒绝。';
    }
});
