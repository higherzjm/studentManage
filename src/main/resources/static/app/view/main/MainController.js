Ext.define('App.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    init: function (view) {
        var user = App.Util.getUser() || {};
        this.lookupReference('userLabel').setHtml(
            Ext.String.htmlEncode(user.realName || user.username || '') +
            '（' + (user.role === 'ADMIN' ? '管理员' : '教师') + '）'
        );
    },

    onSignOut: function () {
        App.Util.confirm('确定退出当前账号吗？', function () {
            App.Util.signOut();
        });
    }
});
