Ext.define('App.model.Course', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'courseNo', type: 'string' },
        { name: 'courseName', type: 'string' },
        { name: 'credit', type: 'float' },
        { name: 'courseHours', type: 'int' },
        { name: 'departmentId', type: 'auto' },
        { name: 'departmentName', type: 'string' },
        { name: 'courseType', type: 'string' },
        { name: 'status', type: 'int', defaultValue: 1 },
        { name: 'teacherNames', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'createTime', type: 'string' }
    ]
});
