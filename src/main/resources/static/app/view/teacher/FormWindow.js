Ext.define('App.view.teacher.FormWindow', {
    extend: 'App.view.base.FormWindow',

    apiPrefix: 'api/teacher',

    itemName: '教师',

    titleField: 'name',

    defaultValues: function () {
        return { gender: '男', status: 1 };
    },

    buildItems: function () {
        return [{
            xtype: 'hidden',
            name: 'id'
        }, {
            name: 'teacherNo',
            fieldLabel: '工号',
            allowBlank: false,
            maxLength: 32,
            emptyText: '例如 T2019'
        }, {
            name: 'name',
            fieldLabel: '姓名',
            allowBlank: false,
            maxLength: 32
        }, {
            name: 'gender',
            fieldLabel: '性别',
            xtype: 'combo',
            store: 'dict-gender',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'birthDate',
            fieldLabel: '出生日期',
            xtype: 'datefield',
            format: 'Y-m-d',
            editable: false,
            maxDate: new Date()
        }, {
            name: 'title',
            fieldLabel: '职称',
            xtype: 'combo',
            store: 'dict-title',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'education',
            fieldLabel: '学历',
            xtype: 'combo',
            store: 'dict-education',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'departmentId',
            fieldLabel: '所属院系',
            xtype: 'combo',
            store: 'dict-departments',
            displayField: 'deptName',
            valueField: 'id',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'hireDate',
            fieldLabel: '入职日期',
            xtype: 'datefield',
            format: 'Y-m-d',
            editable: false
        }, {
            name: 'phone',
            fieldLabel: '手机',
            // Ext 6.2 没有内置 phone vtype，这里用与后端 @Pattern 一致的规则做前置校验
            validator: function (value) {
                return !value || /^[0-9+\-()\s]{6,20}$/.test(value) ? true : '请输入 6-20 位数字号码';
            },
            emptyText: '11 位手机号'
        }, {
            name: 'email',
            fieldLabel: '邮箱',
            vtype: 'email'
        }, {
            name: 'status',
            fieldLabel: '在职状态',
            xtype: 'combo',
            store: 'dict-teacher-status',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            editable: false,
            forceSelection: true
        }, {
            name: 'remark',
            fieldLabel: '备注',
            xtype: 'textarea',
            columnWidth: 1,
            margin: '0 10 6 0',
            rows: 2
        }];
    },

    /** 日期字段取出来是 Date 对象，提交前统一成后端认得的 yyyy-MM-dd。 */
    collectData: function (values) {
        return {
            id: values.id === '' ? null : values.id,
            teacherNo: Ext.String.trim(values.teacherNo || ''),
            name: Ext.String.trim(values.name || ''),
            gender: values.gender,
            birthDate: values.birthDate ? Ext.util.Format.date(values.birthDate, 'Y-m-d') : null,
            phone: values.phone,
            email: values.email,
            title: values.title,
            education: values.education,
            departmentId: values.departmentId === '' ? null : values.departmentId,
            hireDate: values.hireDate ? Ext.util.Format.date(values.hireDate, 'Y-m-d') : null,
            status: values.status,
            remark: values.remark
        };
    }
});
