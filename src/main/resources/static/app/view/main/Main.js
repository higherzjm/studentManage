Ext.define('App.view.main.Main', {
    extend: 'Ext.container.Viewport',

    controller: 'main',

    layout: 'border',

    items: [{
        region: 'north',
        xtype: 'panel',
        height: 46,
        cls: 'app-header',
        border: false,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'tbtext',
            text: '教师管理系统',
            cls: 'app-title'
        }, {
            xtype: 'tbspacer',
            flex: 1
        }, {
            xtype: 'component',
            reference: 'userLabel',
            cls: 'app-user',
            html: ''
        }, {
            xtype: 'button',
            text: '退出登录',
            cls: 'x-btn-flat',
            listeners: {click: 'onSignOut'}
        }]
    }, {
        region: 'center',
        xtype: 'tabpanel',
        reference: 'tabs',
        plain: true,
        defaults: {
            border: false,
            bodyPadding: 0
        },
        items: [{
            xtype: 'teacherGrid',
            title: '教师管理',
            iconCls: 'x-fa fa-users',
            closable: false
        }, {
            xtype: 'courseGrid',
            title: '课程管理',
            iconCls: 'x-fa fa-book',
            closable: false
        }, {
            xtype: 'departmentGrid',
            title: '院系管理',
            iconCls: 'x-fa fa-sitemap',
            closable: false
        }]
    }]
});
