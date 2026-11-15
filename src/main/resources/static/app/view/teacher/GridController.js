Ext.define('App.view.teacher.GridController', {
    extend: 'App.view.base.GridController',

    alias: 'controller.teacherGrid',

    apiPrefix: 'api/teacher',

    formWindowClass: 'App.view.teacher.FormWindow',

    itemName: '教师',

    totalText: function (total) {
        return '共 <b>' + total + '</b> 名教师';
    },

    collectParams: function () {
        var values = this.getView().down('#searchForm').getValues(),
            params = {
                keyword: values.keyword,
                departmentId: values.departmentId,
                title: values.title,
                gender: values.gender,
                status: values.status
            };

        if (values.hireDateFrom) {
            params.hireDateFrom = Ext.util.Format.date(values.hireDateFrom, 'Y-m-d');
        }
        if (values.hireDateTo) {
            params.hireDateTo = Ext.util.Format.date(values.hireDateTo, 'Y-m-d');
        }
        return App.Util.compact(params);
    },

    confirmText: function (record) {
        return '确定删除教师「' + record.get('name') + '（' + record.get('teacherNo') + '）」吗？'
            + '其任课安排会一并解除。';
    },

    onAssign: function () {
        var record = this.getSelected();
        if (!record) {
            App.Util.toast('请先在表格中选择一名教师', 'info');
            return;
        }
        Ext.create('App.view.teacher.CourseWindow', {
            teacher: {
                id: record.get('id'),
                name: record.get('name'),
                teacherNo: record.get('teacherNo')
            }
        }).show();
    }
});
