Ext.define('App.model.Teacher', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'teacherNo', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'gender', type: 'string' },
        // 后端已统一输出 yyyy-MM-dd，模型保持字符串，避免多余的时区/格式转换
        { name: 'birthDate', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'education', type: 'string' },
        { name: 'departmentId', type: 'auto' },
        { name: 'departmentName', type: 'string' },
        { name: 'hireDate', type: 'string' },
        { name: 'status', type: 'int', defaultValue: 1 },
        { name: 'courseCount', type: 'int', defaultValue: 0 },
        { name: 'remark', type: 'string' },
        { name: 'createTime', type: 'string' }
    ]
});
