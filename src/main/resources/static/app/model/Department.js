Ext.define('App.model.Department', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'deptCode', type: 'string' },
        { name: 'deptName', type: 'string' },
        { name: 'dean', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'remark', type: 'string' },
        { name: 'createTime', type: 'string' },
        { name: 'updateTime', type: 'string' }
    ]
});
