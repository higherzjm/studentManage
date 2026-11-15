/**
 * 新增/编辑弹窗的公共骨架：字段布局、保存与取消、按 record 判定新增还是编辑。
 * 子类只提供标题、字段集合和取值转换。
 */
Ext.define('App.view.base.FormWindow', {
    extend: 'Ext.window.Window',

    width: 640,
    layout: 'fit',
    modal: true,
    resizable: false,
    closeAction: 'destroy',
    referenceHolder: true,
    defaultButton: 'save',

    /** 传入即为编辑，为空则是新增。 */
    record: null,

    /** REST 前缀，如 api/teacher */
    apiPrefix: '',

    /** 标题与提示语里的业务名词 */
    itemName: '记录',

    initComponent: function () {
        var me = this;

        me.title = me.buildTitle();
        me.buttons = [{
            itemId: 'save',
            text: '保 存',
            ui: 'default',
            handler: function () {
                me.onSave();
            }
        }, {
            text: '取 消',
            handler: function () {
                me.destroy();
            }
        }];
        me.items = [{
            xtype: 'form',
            reference: 'form',
            bodyPadding: 14,
            layout: 'column',
            defaults: me.fieldDefaults(),
            items: me.buildItems()
        }];

        me.callParent(arguments);

        if (me.record) {
            me.lookupReference('form').loadRecord(me.record);
        } else {
            // Ext.form.Panel 没有 setValues，默认值要交给它内部的 Ext.form.Basic
            me.lookupReference('form').getForm().setValues(me.defaultValues());
        }
    },

    buildTitle: function () {
        if (this.record) {
            return '编辑' + this.itemName + ' · ' + (this.record.get(this.titleField) || '');
        }
        return '新增' + this.itemName;
    },

    /** 编辑态标题里展示哪个字段。 */
    titleField: 'name',

    fieldDefaults: function () {
        return {
            xtype: 'textfield',
            labelWidth: 78,
            labelAlign: 'right',
            margin: '0 10 10 0',
            columnWidth: 0.5,
            msgTarget: 'side'
        };
    },

    defaultValues: function () {
        return {};
    },

    buildItems: function () {
        return [{ xtype: 'hidden', name: 'id' }];
    },

    /** 表单原始值 -> 提交给后端的数据，子类负责日期等格式转换。 */
    collectData: function (values) {
        return values;
    },

    onSave: function () {
        var me = this,
            form = me.lookupReference('form'),
            isNew = !me.record;

        if (!form.isValid()) {
            App.Util.toast('请先补全标红提示的必填项', 'error');
            return;
        }
        App.Util.request({
            url: me.apiPrefix + (isNew ? '/save' : '/update'),
            data: me.collectData(form.getValues()),
            success: function (result) {
                App.Util.toast(result.message || '已保存', 'success');
                me.fireEvent('saved', me, !isNew);
                me.destroy();
            }
        });
    }
});
