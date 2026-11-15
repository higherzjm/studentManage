Ext.define('App.view.course.Grid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.courseGrid',

    controller: 'courseGrid',

    store: { type: 'courses' },

    columnLines: true,
    scrollable: true,
    selModel: { mode: 'SINGLE' },
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    referenceHolder: true,

    columns: [{
        text: '课程编号',
        dataIndex: 'courseNo',
        width: 110,
        sorter: 'string'
    }, {
        text: '课程名称',
        dataIndex: 'courseName',
        width: 180,
        sorter: 'string'
    }, {
        text: '学分',
        dataIndex: 'credit',
        width: 70,
        align: 'center',
        sorter: 'int'
    }, {
        text: '学时',
        dataIndex: 'courseHours',
        width: 70,
        align: 'center',
        sorter: 'int'
    }, {
        text: '类型',
        dataIndex: 'courseType',
        width: 80,
        align: 'center'
    }, {
        text: '归属院系',
        dataIndex: 'departmentName',
        width: 170
    }, {
        text: '状态',
        dataIndex: 'status',
        width: 86,
        align: 'center',
        renderer: function (value) {
            return '<span class="status-dot ' + (value === 1 ? 'status-on' : 'status-off') + '"></span>'
                + (value === 1 ? '开设中' : '已停开');
        }
    }, {
        text: '任课教师',
        dataIndex: 'teacherNames',
        width: 190
    }, {
        text: '说明',
        dataIndex: 'description',
        flex: 1,
        minWidth: 140
    }],

    tbar: [{
        text: '新增课程',
        iconCls: 'x-fa fa-plus',
        listeners: {click: 'onAdd'}
    }, {
        text: '编辑',
        iconCls: 'x-fa fa-pencil',
        listeners: {click: 'onEdit'}
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
        emptyText: '还没有符合条件的课程'
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
            columnWidth: 0.2
        },
        items: [{
            xtype: 'textfield',
            name: 'keyword',
            itemId: 'keyword',
            emptyText: '课程编号 / 名称',
            columnWidth: 0.24,
            labelWidth: 0
        }, {
            xtype: 'combo',
            name: 'departmentId',
            itemId: 'departmentId',
            fieldLabel: '院系',
            store: 'dict-departments',
            displayField: 'deptName',
            valueField: 'id',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'combo',
            name: 'courseType',
            itemId: 'courseType',
            fieldLabel: '类型',
            store: 'dict-course-type-query',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'combo',
            name: 'status',
            itemId: 'status',
            fieldLabel: '状态',
            store: 'dict-course-status-query',
            displayField: 'text',
            valueField: 'value',
            queryMode: 'local',
            forceSelection: true
        }, {
            xtype: 'button',
            text: '查询',
            ui: 'default',
            columnWidth: 0.09,
            margin: '0 6 8 0',
            listeners: {click: 'onSearch'}
        }, {
            xtype: 'button',
            text: '重置',
            columnWidth: 0.09,
            margin: 0,
            listeners: {click: 'onReset'}
        }]
    }],

    listeners: {
        itemdblclick: 'onEdit'
    }
});
