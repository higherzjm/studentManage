Ext.define('App.view.teacher.CourseWindow', {
    extend: 'Ext.window.Window',

    title: '任课安排',
    width: 760,
    height: 520,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',
    referenceHolder: true,

    /** { id, name, teacherNo } */
    teacher: null,

    initComponent: function () {
        var me = this;

        me.title = '任课安排 · ' + me.teacher.name + '（' + me.teacher.teacherNo + '）';
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

        me.callParent(arguments);

        me.grid = me.down('#coursePicker');
        me.grid.addDocked(me.buildBar());
        me.grid.getSelectionModel().on('selectionchange', function (model, selected) {
            me.lookupReference('pickedLabel').setHtml('已选 <b>' + selected.length + '</b> 门');
        });
        me.lookupReference('term').setValue(App.dict.Dictionaries.latestTerm());
        me.loadAssigned();
    },

    buildBar: function () {
        var me = this;

        return {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'combo',
                fieldLabel: '学期',
                labelWidth: 44,
                reference: 'term',
                store: 'dict-terms',
                displayField: 'term',
                valueField: 'term',
                queryMode: 'local',
                editable: false,
                width: 200,
                listeners: {
                    change: function () {
                        me.loadAssigned();
                    }
                }
            }, '->', {
                text: '全选',
                handler: function () {
                    me.grid.getSelectionModel().select(me.grid.getStore().getRange(), true);
                }
            }, {
                text: '全不选',
                handler: function () {
                    me.grid.getSelectionModel().clearSelections();
                }
            }, {
                xtype: 'component',
                reference: 'pickedLabel',
                style: 'color:#666;font-size:12px;margin-left:12px;',
                html: '已选 <b>0</b> 门'
            }]
        };
    },

    items: [{
        xtype: 'grid',
        itemId: 'coursePicker',
        store: 'dict-all-courses',
        columnLines: true,
        selModel: {
            mode: 'MULTI',
            ignoreRightMouseSelection: true
        },
        viewConfig: {
            stripeRows: true
        },
        columns: [{
            text: '课程编号',
            dataIndex: 'courseNo',
            width: 110
        }, {
            text: '课程名称',
            dataIndex: 'courseName',
            flex: 1,
            minWidth: 170
        }, {
            text: '学分',
            dataIndex: 'credit',
            width: 64,
            align: 'center'
        }, {
            text: '学时',
            dataIndex: 'courseHours',
            width: 64,
            align: 'center'
        }, {
            text: '类型',
            dataIndex: 'courseType',
            width: 78,
            align: 'center'
        }, {
            text: '归属院系',
            dataIndex: 'departmentName',
            width: 160
        }, {
            text: '状态',
            dataIndex: 'status',
            width: 78,
            align: 'center',
            renderer: function (value) {
                return value === 1 ? '开设中' : '已停开';
            }
        }]
    }],

    getTerm: function () {
        return this.lookupReference('term').getValue() || '';
    },

    /** 拉取该教师该学期已有的任课，回填选中状态。 */
    loadAssigned: function () {
        var me = this,
            term = me.getTerm();

        if (!term) {
            me.grid.getSelectionModel().clearSelections();
            return;
        }
        App.Util.request({
            url: 'api/teacher/courses',
            method: 'GET',
            params: { teacherId: me.teacher.id, term: term },
            suppressToast: true,
            success: function (result) {
                var ids = result.data || [],
                    targets = [];
                Ext.each(me.grid.getStore().getRange(), function (record) {
                    if (Ext.Array.contains(ids, record.get('id'))) {
                        targets.push(record);
                    }
                });
                me.grid.getSelectionModel().select(targets, false);
            }
        });
    },

    onSave: function () {
        var me = this,
            term = me.getTerm();

        if (!term) {
            App.Util.toast('请先选择学期', 'error');
            return;
        }
        App.Util.request({
            url: 'api/teacher/courses/assign',
            data: {
                teacherId: me.teacher.id,
                term: term,
                courseIds: Ext.Array.map(me.grid.getSelectionModel().getSelection(), function (record) {
                    return record.get('id');
                })
            },
            success: function (result) {
                App.Util.toast(result.message || '任课安排已保存', 'success');
                me.destroy();
                // 列表里的“任课门数”需要重新统计
                Ext.each(Ext.ComponentQuery.query('teacherGrid'), function (grid) {
                    grid.getStore().reload();
                });
            }
        });
    }
});
