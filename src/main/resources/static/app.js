/**
 * 不使用 Sencha Cmd 的引导方式：由 Ext.Loader 按需加载 App.* 类文件。
 * 框架文件来自本地 static/ext 目录，页面完全离线可用。
 */
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'App': 'app'
    }
});

Ext.application({
    name: 'App',

    // 静态资源前缀指向本地 ext 目录，图标与主题图片才不会去公网取
    requires: [
        'App.Util',
        'App.dict.Dictionaries',
        'App.model.Department',
        'App.model.Teacher',
        'App.model.Course',
        'App.store.Departments',
        'App.store.DepartmentPages',
        'App.store.Courses',
        'App.store.Teachers',
        'App.store.AllCourses',
        'App.view.base.GridController',
        'App.view.base.FormWindow',
        'App.view.login.Window',
        'App.view.login.WindowController',
        'App.view.main.Main',
        'App.view.main.MainController',
        'App.view.teacher.Grid',
        'App.view.teacher.GridController',
        'App.view.teacher.FormWindow',
        'App.view.teacher.CourseWindow',
        'App.view.course.Grid',
        'App.view.course.GridController',
        'App.view.course.FormWindow',
        'App.view.department.Grid',
        'App.view.department.GridController',
        'App.view.department.FormWindow'
    ],

    launch: function () {
        var me = this;

        // Ext 接管 body 之前先摘掉静态引导语，否则它会作为 body 子节点混进 Viewport
        var hint = Ext.getDom('boot-hint');
        if (hint) {
            Ext.get(hint).remove();
        }

        App.dict.Dictionaries.prepare();

        // 令牌失效（过期或被踢出）时统一回到登录框，各处无需重复处理
        App.Util.on('unauthorized', function () {
            me.dropMain();
            me.showLogin();
        });
        App.Util.on('signedout', function () {
            me.dropMain();
            me.showLogin();
        });

        // 先向服务端确认令牌仍然有效，再决定进主界面还是登录框
        App.Util.request({
            url: 'api/auth/current',
            method: 'GET',
            suppressToast: true,
            success: function (result) {
                App.Util.setUser(result.data);
                me.showMain();
            },
            failure: function () {
                me.showLogin();
            }
        });
    },

    dropMain: function () {
        if (this.mainView && !this.mainView.destroyed) {
            this.mainView.destroy();
        }
        this.mainView = null;
    },

    showLogin: function () {
        if (this.loginWindow && this.loginWindow.rendered && !this.loginWindow.destroyed) {
            this.loginWindow.show();
            return;
        }
        var me = this;
        this.loginWindow = Ext.widget('loginWindow');
        this.loginWindow.on('loginsuccess', function () {
            me.loginWindow.destroy();
            me.loginWindow = null;
            me.showMain();
        });
        this.loginWindow.show();
    },

    showMain: function () {
        if (this.mainView && !this.mainView.destroyed) {
            return;
        }
        App.dict.Dictionaries.loadRemote();
        this.mainView = Ext.create('App.view.main.Main');
    }
});
