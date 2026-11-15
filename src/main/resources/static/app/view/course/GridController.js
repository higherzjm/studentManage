Ext.define('App.view.course.GridController', {
    extend: 'App.view.base.GridController',

    alias: 'controller.courseGrid',

    apiPrefix: 'api/course',

    formWindowClass: 'App.view.course.FormWindow',

    itemName: '课程',

    // 课程的增删改会影响“任课安排”里的可选列表
    dictionaryStoreIds: ['dict-all-courses'],

    totalText: function (total) {
        return '共 <b>' + total + '</b> 门课程';
    },

    collectParams: function () {
        var values = this.getView().down('#searchForm').getValues();
        return App.Util.compact({
            keyword: values.keyword,
            departmentId: values.departmentId,
            courseType: values.courseType,
            status: values.status
        });
    },

    confirmText: function (record) {
        return '确定删除课程「' + record.get('courseName') + '（' + record.get('courseNo') + '）」吗？'
            + '已有任课安排的课程无法删除。';
    }
});
