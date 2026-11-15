Ext.define('App.view.login.WindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.login',

    onLogin: function () {
        var me = this,
            form = me.lookupReference('form'),
            button = me.lookupReference('loginBtn'),
            values = form.getValues();

        button.setDisabled(true).setText('登录中…');
        App.Util.request({
            url: 'api/auth/login',
            data: values,
            suppressToast: true,
            success: function (result) {
                App.Util.setToken(result.data.token);
                App.Util.setUser(result.data.user);
                // 事件发给视图：app.js 是在 loginWindow 上监听的
                me.getView().fireEvent('loginsuccess', me.getView(), result.data.user);
            },
            failure: function (result) {
                button.setDisabled(false).setText('登 录');
                form.down('#password').setValue('');
                form.down('#password').focus();
                App.Util.toast(result.message || '登录失败，请检查账号与密码', 'error');
            }
        });
    }
});
