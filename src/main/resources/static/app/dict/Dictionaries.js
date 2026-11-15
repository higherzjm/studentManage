/**
 * 字典与共享数据源。
 *
 * 所有字典都以 storeId 的形式在启动时注册一次，视图里只写 id 字符串。
 * 这样类文件在执行自身定义时无需引用其它类，也不会让每个下拉框各自发请求。
 */
Ext.define('App.dict.Dictionaries', {
    singleton: true,

    GENDER: 'dict-gender',
    GENDER_QUERY: 'dict-gender-query',
    TITLE: 'dict-title',
    TITLE_QUERY: 'dict-title-query',
    EDUCATION: 'dict-education',
    EDUCATION_QUERY: 'dict-education-query',
    COURSE_TYPE: 'dict-course-type',
    COURSE_TYPE_QUERY: 'dict-course-type-query',
    TEACHER_STATUS: 'dict-teacher-status',
    TEACHER_STATUS_QUERY: 'dict-teacher-status-query',
    COURSE_STATUS: 'dict-course-status',
    COURSE_STATUS_QUERY: 'dict-course-status-query',
    DEPARTMENT: 'dict-departments',
    ALL_COURSE: 'dict-all-courses',
    TERM: 'dict-terms',

    genderRows: [
        { value: '男', text: '男' },
        { value: '女', text: '女' }
    ],

    titleRows: [
        { value: '教授', text: '教授' },
        { value: '副教授', text: '副教授' },
        { value: '讲师', text: '讲师' },
        { value: '助教', text: '助教' }
    ],

    educationRows: [
        { value: '博士', text: '博士' },
        { value: '硕士', text: '硕士' },
        { value: '学士', text: '学士' }
    ],

    courseTypeRows: [
        { value: '必修', text: '必修' },
        { value: '选修', text: '选修' },
        { value: '公共课', text: '公共课' }
    ],

    teacherStatusRows: [
        { value: 1, text: '在职' },
        { value: 0, text: '离职' }
    ],

    courseStatusRows: [
        { value: 1, text: '开设中' },
        { value: 0, text: '已停开' }
    ],

    prepare: function () {
        var me = this;

        if (Ext.StoreManager.lookup(me.DEPARTMENT)) {
            return;
        }

        me.registerLocal(me.GENDER, me.genderRows);
        me.registerLocal(me.GENDER_QUERY, me.withAll(me.genderRows));
        me.registerLocal(me.TITLE, me.titleRows);
        me.registerLocal(me.TITLE_QUERY, me.withAll(me.titleRows));
        me.registerLocal(me.EDUCATION, me.educationRows);
        me.registerLocal(me.EDUCATION_QUERY, me.withAll(me.educationRows));
        me.registerLocal(me.COURSE_TYPE, me.courseTypeRows);
        me.registerLocal(me.COURSE_TYPE_QUERY, me.withAll(me.courseTypeRows));
        me.registerLocal(me.TEACHER_STATUS, me.teacherStatusRows);
        me.registerLocal(me.TEACHER_STATUS_QUERY, me.withAll(me.teacherStatusRows));
        me.registerLocal(me.COURSE_STATUS, me.courseStatusRows);
        me.registerLocal(me.COURSE_STATUS_QUERY, me.withAll(me.courseStatusRows));

        me.remoteStores = [
            Ext.create('App.store.Departments', { storeId: me.DEPARTMENT }),
            Ext.create('App.store.AllCourses', { storeId: me.ALL_COURSE })
        ];

        me.termStore = Ext.create('Ext.data.Store', {
            storeId: me.TERM,
            fields: ['term'],
            data: []
        });
        me.loadRemote();
    },

    /**
     * 需要登录才能取到的共享数据。未登录时一个请求都不发，
     * 登录成功进入主界面后由 App.dict.Dictionaries.loadRemote 再调用。
     */
    loadRemote: function () {
        var me = this;
        if (!App.Util.getToken()) {
            return;
        }
        Ext.each(me.remoteStores, function (store) {
            store.load();
        });
        me.loadTerms();
    },

    /** /api/teacher/terms 返回的是字符串数组，转成 store 行更直观。 */
    loadTerms: function (onLoaded) {
        var store = this.termStore;
        App.Util.request({
            url: 'api/teacher/terms',
            method: 'GET',
            suppressToast: true,
            success: function (result) {
                var rows = Ext.Array.map(result.data || [], function (term) {
                    return { term: term };
                });
                store.loadData(rows);
                if (onLoaded) {
                    onLoaded(rows);
                }
            }
        });
    },

    latestTerm: function () {
        var first = this.termStore.first();
        return first ? first.get('term') : '';
    },

    registerLocal: function (storeId, rows) {
        return Ext.create('Ext.data.Store', {
            storeId: storeId,
            fields: ['value', 'text'],
            data: rows
        });
    },

    /** 查询表单用的字典要多一个“全部”空选项。 */
    withAll: function (rows, allText) {
        return [{ value: '', text: allText || '全部' }].concat(rows);
    }
});
