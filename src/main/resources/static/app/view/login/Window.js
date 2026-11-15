Ext.define('App.view.login.Window', {
    extend: 'Ext.window.Window',

    alias: 'widget.loginWindow',

    controller: 'login',

    title: '教师管理系统',
    width: 360,
    modal: true,
    resizable: false,
    closable: false,
    collapsible: false,
    constrain: true,
    layout: 'fit',
    iconCls: 'x-fa fa-graduation-cap',

    items: [{
        xtype: 'form',
        reference: 'form',
        bodyPadding: 18,
        defaults: {
            xtype: 'textfield',
            anchor: '100%',
            margin: '0 0 12 0',
            labelWidth: 60
        },
        items: [{
            name: 'username',
            fieldLabel: '账号',
            itemId: 'username',
            emptyText: 'admin 或教师工号',
            allowBlank: false,
            tabIndex: 1
        }, {
            name: 'password',
            fieldLabel: '密码',
            itemId: 'password',
            inputType: 'password',
            emptyText: '请输入密码',
            allowBlank: false,
            tabIndex: 2,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() === e.ENTER) {
                        field.up('window').lookupController().onLogin();
                    }
                }
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                xtype: 'button',
                text: '登 录',
                ui: 'default-bold',
                formBind: true,
                tabIndex: 3,
                reference: 'loginBtn',
                listeners: {click: 'onLogin'},
                margin: '0 8 8 0'
            }]
        }]
    }
    ],

    listeners: {
        show: function (win) {
            var field = win.down('#username');
            if (field && !App.Util.getToken()) {
                field.focus();
            }
        }
    }
});
