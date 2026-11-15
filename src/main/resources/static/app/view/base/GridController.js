/**
 * 三个管理列表的公共行为：分页工具条绑store、查询条件下发、增删改与刷新。
 * 子类只需给出接口前缀、表单窗口类名和各自的查询条件组装方式。
 */
Ext.define('App.view.base.GridController', {
    extend: 'Ext.app.ViewController',

    /** 后端 REST 前缀，如 api/teacher */
    apiPrefix: '',

    /** 新增/编辑弹窗类名 */
    formWindowClass: '',

    /** 提示语里的业务名词，如「教师」 */
    itemName: '记录',

    init: function (view) {
        var me = this;
        // 分页工具条要等子件全部就绪后再绑同一个 store 实例
        view.on('afterrender', function () {
            var store = view.getStore();
            view.down('#pager').bindStore(store);
            store.on('load', me.onStoreLoad, me);
            me.onSearch();
        }, me, { single: true });
    },

    onStoreLoad: function (store) {
        this.lookupReference('totalLabel').setHtml(this.totalText(store.getTotalCount()));
    },

    totalText: function (total) {
        return '共 <b>' + total + '</b> 条';
    },

    /** 查询表单 -> 后端参数；子类覆写后记得调用 App.Util.compact 剔除空值。 */
    collectParams: function () {
        return {};
    },

    onSearch: function () {
        var store = this.getView().getStore();
        store.getProxy().setExtraParams(this.collectParams());
        store.loadPage(1);
    },

    onReset: function () {
        this.getView().down('#searchForm').reset();
        this.onSearch();
    },

    onRefresh: function () {
        this.getView().getStore().reload();
    },

    onAdd: function () {
        this.openForm(null);
    },

    onEdit: function () {
        var record = this.getSelected();
        if (!record) {
            App.Util.toast('请先在表格中选择一条' + this.itemName, 'info');
            return;
        }
        this.openForm(record);
    },

    openForm: function (record) {
        var me = this;
        Ext.create(me.formWindowClass, {
            record: record,
            listeners: {
                saved: function () {
                    me.getView().getStore().reload();
                    me.refreshDictionaries();
                }
            }
        }).show();
    },

    onDelete: function () {
        var me = this,
            record = me.getSelected();

        if (!record) {
            App.Util.toast('请先在表格中选择要删除的' + me.itemName, 'info');
            return;
        }
        App.Util.confirm(me.confirmText(record), function () {
            App.Util.request({
                url: me.apiPrefix + '/delete/' + record.getId(),
                success: function (result) {
                    App.Util.toast(result.message || '已删除', 'success');
                    me.getView().getStore().reload();
                    me.refreshDictionaries();
                }
            });
        });
    },

    /** 子类可覆写，把被删对象的名称写进确认框。 */
    confirmText: function () {
        return '确定删除选中的' + this.itemName + '吗？';
    },

    /**
     * 本模块的数据变更后需要跟着刷新的共享字典 store id，由子类给出。
     */
    dictionaryStoreIds: [],

    refreshDictionaries: function () {
        Ext.each(this.dictionaryStoreIds, function (storeId) {
            var store = Ext.StoreManager.lookup(storeId);
            if (store) {
                store.reload();
            }
        });
    },

    getSelected: function () {
        return this.getView().getSelectionModel().getSelection()[0];
    }
});
