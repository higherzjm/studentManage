Ext.define('App.view.department.Grid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.departmentGrid',

    controller: 'departmentGrid',

    store: { type: 'departmentpages' },

    columnLines: true,
    scrollable: true,
    selModel: { mode: 'SINGLE' },
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    referenceHolder: true,

    columns: [{
        text: '院系代码',
        dataIndex: 'deptCode',
        width: 110,
        sorter: 'string'
    }, {
        text: '院系名称',
        dataIndex: 'deptName',
        width: 220,
        sorter: 'string'
    }, {
        text: '负责人',
        dataIndex: 'dean',
        width: 100
    }, {
        text: '联系电话',
        dataIndex: 'phone',
        width: 140
    }, {
        text: '办公地点',
        dataIndex: 'location',
        width: 160
    }, {
        text: '备注',
        dataIndex: 'remark',
        flex: 1,
        minWidth: 160
    }],

    tbar: [{
        text: '新增院系',
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
        emptyText: '还没有任何院系'
    },

    dockedItems: [{
        xtype: 'form',
        itemId: 'searchForm',
        dock: 'top',
        bodyPadding: '10 12 4 12',
        layout: 'column',
        items: [{
            xtype: 'textfield',
            name: 'keyword',
            itemId: 'keyword',
            emptyText: '院系代码 / 名称 / 负责人',
            columnWidth: 0.3,
            margin: '0 12 8 0',
            listeners: {
                // 数据量不大，回车即查，省去一次鼠标定位
                specialkey: function (field, e) {
                    if (e.getKey() === e.ENTER) {
                        field.up('gridpanel').lookupController().onSearch();
                    }
                }
            }
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
