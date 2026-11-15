Ext.define('App.view.course.FormWindow', {
    extend: 'App.view.base.FormWindow',

    apiPrefix: 'api/course',

    itemName: '课程',

    titleField: 'courseName',

    defaultValues: function () {
        return { status: 1, credit: 3, courseHours: 48, courseType: '必修' };
    },

    buildItems: function () {
        return [{
            xtype: 'hidden',
            name: 'id'
        }, {
            name: 'courseNo',
            fieldLabel: '课程编号',
            allowBlank: false,
            maxLength: 32,
            emptyText: '例如 CS420'
        }, {
            name: 'courseName',
            fieldLabel: '课程名称',
            allowBlank: false,
            maxLength: 64
        }, {
            name: 'credit',
            fieldLabel: '学分',
            xtype: 'numberfield',
            decimalPrecision: 1,
            minValue: 0,
            maxValue: 20,
            step: 0.5,
            allowBlank: false
        }, {
            name: 'courseHours',
            fieldLabel: '学时',
            xtype: 'numberfield',
            decimalPrecision: 0,
            minValue: 0,
            maxValue: 500,
            step: 8,
            allowBlank: false
        }, {
            name: 'departmentId',
            fieldLabel: '归属院系',
            xtype: 'combo',
            store: 'dict-departments',
            displayField: 'deptName',
            valueField: 'id',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'courseType',
            fieldLabel: '课程类型',
            xtype: 'combo',
            store: 'dict-course-type',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'status',
            fieldLabel: '开课状态',
            xtype: 'combo',
            store: 'dict-course-status',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'description',
            fieldLabel: '课程说明',
            xtype: 'textarea',
            columnWidth: 1,
            margin: '0 10 6 0',
            rows: 2
        }];
    },

    collectData: function (values) {
        return {
            id: values.id === '' ? null : values.id,
            courseNo: Ext.String.trim(values.courseNo || ''),
            courseName: Ext.String.trim(values.courseName || ''),
            credit: values.credit,
            courseHours: values.courseHours,
            departmentId: values.departmentId === '' ? null : values.departmentId,
            courseType: values.courseType,
            status: values.status,
            description: values.description
        };
    }
});
