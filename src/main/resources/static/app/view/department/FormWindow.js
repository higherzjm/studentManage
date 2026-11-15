Ext.define('App.view.department.FormWindow', {
    extend: 'App.view.base.FormWindow',

    apiPrefix: 'api/department',

    itemName: '院系',

    titleField: 'deptName',

    buildItems: function () {
        return [{
            xtype: 'hidden',
            name: 'id'
        }, {
            name: 'deptCode',
            fieldLabel: '院系代码',
            allowBlank: false,
            maxLength: 32,
            emptyText: '例如 CS'
        }, {
            name: 'deptName',
            fieldLabel: '院系名称',
            allowBlank: false,
            maxLength: 64
        }, {
            name: 'dean',
            fieldLabel: '负责人',
            maxLength: 32
        }, {
            name: 'phone',
            fieldLabel: '联系电话',
            maxLength: 32
        }, {
            name: 'location',
            fieldLabel: '办公地点',
            maxLength: 128
        }, {
            name: 'remark',
            fieldLabel: '备注',
            columnWidth: 1,
            margin: '0 10 6 0'
        }];
    },

    collectData: function (values) {
        return {
            id: values.id === '' ? null : values.id,
            deptCode: Ext.String.trim(values.deptCode || '').toUpperCase(),
            deptName: Ext.String.trim(values.deptName || ''),
            dean: values.dean,
            phone: values.phone,
            location: values.location,
            remark: values.remark
        };
    }
});
