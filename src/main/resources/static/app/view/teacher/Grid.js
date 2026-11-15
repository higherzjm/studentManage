Ext.define('App.view.teacher.Grid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.teacherGrid',

    controller: 'teacherGrid',

    store: { type: 'teachers' },

    columnLines: true,
    scrollable: true,
    selModel: {
        mode: 'SINGLE'
    },
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    referenceHolder: true,

    columns: [{
        text: '工号',
        dataIndex: 'teacherNo',
        width: 96,
        sorter: 'string'
    }, {
        text: '姓名',
        dataIndex: 'name',
        width: 92,
        sorter: 'string'
    }, {
        text: '性别',
        dataIndex: 'gender',
        width: 58,
        align: 'center'
    }, {
        text: '出生日期',
        dataIndex: 'birthDate',
        width: 100,
        align: 'center'
    }, {
        text: '职称',
        dataIndex: 'title',
        width: 80,
        align: 'center',
        sorter: 'string'
    }, {
        text: '学历',
        dataIndex: 'education',
        width: 70,
        align: 'center'
    }, {
        text: '所属院系',
        dataIndex: 'departmentName',
        width: 170
    }, {
        text: '入职日期',
        dataIndex: 'hireDate',
        width: 100,
        align: 'center',
        sorter: 'string'
    }, {
        text: '状态',
        dataIndex: 'status',
        width: 82,
        align: 'center',
        renderer: function (value) {
            return '<span class="status-dot ' + (value === 1 ? 'status-on' : 'status-off') + '"></span>'
                + (value === 1 ? '在职' : '离职');
        }
    }, {
        text: '任课',
        dataIndex: 'courseCount',
        width: 68,
        align: 'center',
        renderer: function (value) {
            return (value || 0) + ' 门';
        }
    }, {
        text: '手机',
        dataIndex: 'phone',
        width: 120
    }, {
        text: '邮箱',
        dataIndex: 'email',
        width: 170
    }, {
        text: '备注',
        dataIndex: 'remark',
        flex: 1,
        minWidth: 140
    }],

    tbar: [{
        text: '新增教师',
        iconCls: 'x-fa fa-plus',
        listeners: {click: 'onAdd'}
    }, {
        text: '编辑',
        iconCls: 'x-fa fa-pencil',
        listeners: {click: 'onEdit'}
    }, {
        text: '任课安排',
        iconCls: 'x-fa fa-calendar-check-o',
        listeners: {click: 'onAssign'}
    }, '-', {
        text: '删除',
        iconCls: 'x-fa fa-trash-o',
        listeners: {click: 'onDelete'}
    }, '-', {
        text: '刷新',
        iconCls: 'x-fa fa-refresh',
        listeners: {click: 'onRefresh'}
    }, '->', {
        xtype: 'component',
        reference: 'totalLabel',
        style: 'color:#666;font-size:12px;',
        html: ''
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        itemId: 'pager',
        displayInfo: true,
        emptyText: '没有符合条件的教师'
    },

    dockedItems: [{
        xtype: 'form',
        itemId: 'searchForm',
        dock: 'top',
        bodyPadding: '10 12 4 12',
        layout: 'column',
        defaults: {
            labelWidth: 60,
            labelAlign: 'right',
            margin: '0 12 8 0',
            columnWidth: 0.185
        },
        items: [{
            xtype: 'textfield',
            name: 'keyword',
            emptyText: '工号 / 姓名 / 邮箱 / 手机',
            itemId: 'keyword',
            columnWidth: 0.2,
            labelWidth: 0
        }, {
            xtype: 'combo',
            name: 'departmentId',
            fieldLabel: '院系',
            itemId: 'departmentId',
            store: 'dict-departments',
            displayField: 'deptName',
            valueField: 'id',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'combo',
            name: 'title',
            fieldLabel: '职称',
            itemId: 'title',
            store: 'dict-title-query',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'combo',
            name: 'gender',
            fieldLabel: '性别',
            itemId: 'gender',
            store: 'dict-gender-query',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'combo',
            name: 'status',
            fieldLabel: '状态',
            itemId: 'status',
            store: 'dict-teacher-status-query',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'datefield',
            name: 'hireDateFrom',
            fieldLabel: '入职从',
            itemId: 'hireDateFrom',
            format: 'Y-m-d',
            submitFormat: 'Y-m-d'
        }, {
            xtype: 'datefield',
            name: 'hireDateTo',
            fieldLabel: '入职至',
            itemId: 'hireDateTo',
            format: 'Y-m-d',
            submitFormat: 'Y-m-d'
        }, {
            xtype: 'button',
            text: '查询',
            ui: 'default',
            columnWidth: 0.08,
            margin: '0 6 8 0',
            listeners: {click: 'onSearch'}
        }, {
            xtype: 'button',
            text: '重置',
            columnWidth: 0.08,
            margin: 0,
            listeners: {click: 'onReset'}
        }]
    }],

    listeners: {
        // 双击直接进入编辑，省去一次鼠标定位
        itemdblclick: 'onEdit'
    }
});
