/**
 * 全局工具：令牌存取、统一请求、提示与确认框。
 * 所有写操作都走 App.Util.request，成功/失败的判定只看返回信封里的 success。
 */
Ext.define('App.Util', {
    singleton: true,

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    TOKEN_HEADER: 'X-Auth-Token',
    TOKEN_KEY: 'tms.token',

    currentUser: null,

    /**
     * 会话序号：每次换令牌自增。401 要等到回调时机还认得当前会话才算数，
     * 否则重新登录之后才被送达的旧请求 401 会把新会话踢掉。
     */
    sessionSeq: 0,

    constructor: function (config) {
        // Ext.mixin.Observable 不会自动初始化，漏掉这一步时 on()/fireEvent() 会直接抛错
        this.mixins.observable.constructor.call(this, config);
        this.initAjax();
    },

    // ===== 令牌与会话 =====

    getToken: function () {
        try {
            return window.localStorage.getItem(this.TOKEN_KEY) || '';
        } catch (e) {
            return '';
        }
    },

    setToken: function (token) {
        try {
            window.localStorage.setItem(this.TOKEN_KEY, token);
        } catch (e) {
            // 隐私模式下写不进 localStorage，会话退化为内存态
        }
        this.applyTokenHeader(token);
        this.sessionSeq++;
    },

    clearToken: function () {
        try {
            window.localStorage.removeItem(this.TOKEN_KEY);
        } catch (e) { /* ignore */ }
        this.applyTokenHeader('');
        this.currentUser = null;
        this.sessionSeq++;
    },

    /**
     * 令牌要通过 defaultHeaders 附着在每一个请求上（表格代理也是走 Ext.Ajax）。
     * defaultHeaders 是 processed config：直接改 Ext.Ajax.defaultHeaders 属性
     * 并不会被 setupHeaders 读到，只能用 setDefaultHeaders 写。
     */
    applyTokenHeader: function (token) {
        var headers = Ext.apply({}, Ext.Ajax.getDefaultHeaders() || {});
        if (token) {
            headers[this.TOKEN_HEADER] = token;
        } else {
            delete headers[this.TOKEN_HEADER];
        }
        Ext.Ajax.setDefaultHeaders(headers);
    },

    setUser: function (user) {
        this.currentUser = user;
    },

    getUser: function () {
        return this.currentUser;
    },

    /** 退出登录后回到登录框，主界面整体销毁重建。 */
    signOut: function () {
        var me = this;
        this.request({
            url: 'api/auth/logout',
            suppressToast: true,
            complete: function () {
                me.clearToken();
                me.fireEvent('signedout');
            }
        });
    },

    // ===== 请求 =====

    /**
     * @param cfg url / method / data(对象，作为 JSON body) / params(对象，作为查询串)
     *             success(result) / failure(result, response) / complete() / suppressToast
     */
    request: function (cfg) {
        var me = this,
            method = (cfg.method || 'POST').toUpperCase();

        Ext.Ajax.request({
            url: cfg.url,
            method: method,
            jsonData: method === 'GET' ? undefined : (cfg.data || {}),
            params: method === 'GET' ? this.compact(cfg.params) : cfg.params,
            timeout: cfg.timeout || 30000,
            suppressToast: true,
            tmsSession: this.sessionSeq,
            success: function (response) {
                var result = Ext.decode(response.responseText, true) || {};
                if (result.success) {
                    if (cfg.success) {
                        cfg.success.call(cfg.scope || me, result, response);
                    }
                } else {
                    if (!cfg.suppressToast) {
                        me.toast(result.message || '操作失败', 'error');
                    }
                    if (cfg.failure) {
                        cfg.failure.call(cfg.scope || me, result, response);
                    }
                }
                if (cfg.complete) {
                    cfg.complete.call(cfg.scope || me, result, response);
                }
            },
            failure: function (response) {
                var result = Ext.decode(response.responseText, true) || {};
                if (!cfg.suppressToast && !cfg.toastSuppressedByGlobal) {
                    // 401 由全局异常监听处理，这里不再叠加提示
                    if (response.status !== 401) {
                        me.toast(me.extractMessage(result, response) || ('请求失败（HTTP ' + response.status + '）'), 'error');
                    }
                }
                if (cfg.failure) {
                    cfg.failure.call(cfg.scope || me, result, response);
                }
                if (cfg.complete) {
                    cfg.complete.call(cfg.scope || me, result, response);
                }
            }
        });
    },

    extractMessage: function (result, response) {
        if (result && result.message) {
            return result.message;
        }
        return null;
    },

    /** 去掉空串/null/undefined，避免后端把空字符串往 Integer 上绑。 */
    compact: function (params) {
        var out = {}, key, value;
        if (!params) {
            return out;
        }
        for (key in params) {
            if (params.hasOwnProperty(key)) {
                value = params[key];
                if (value !== null && value !== undefined && value !== '') {
                    out[key] = value;
                }
            }
        }
        return out;
    },

    // ===== 反馈 =====

    toast: function (message, ui) {
        if (Ext.toast) {
            Ext.toast({
                html: message,
                ui: ui || 'info',
                align: 't',
                autoCloseDelay: 3000
            });
        } else {
            Ext.Msg.show({
                title: ui === 'error' ? '操作失败' : '提示',
                message: message,
                buttons: Ext.Msg.OK,
                icon: ui === 'error' ? Ext.Msg.ERROR : Ext.Msg.INFO
            });
        }
    },

    confirm: function (message, callback, scope) {
        Ext.Msg.confirm('请确认', message, function (btn) {
            if (btn === 'yes') {
                callback.call(scope || window);
            }
        }, this);
    },

    // ===== 内部 =====

    initAjax: function () {
        var me = this,
            token = me.getToken();

        if (token) {
            me.applyTokenHeader(token);
        }
        // 统一处理 HTTP 层异常：401 直接回登录框，其余给出可读提示
        Ext.Ajax.on('requestexception', function (conn, response, options) {
            if (response.status === 401) {
                // 代理自己发的请求（表格加载）没有打序号，一律算当前会话
                var stale = options && Ext.isDefined(options.tmsSession) &&
                    options.tmsSession !== me.sessionSeq;
                if (stale) {
                    return;
                }
                me.clearToken();
                // 不在 XHR 回调里同步建窗口：Ext.Ajax 要在这之后回收请求队列，
                // 回调中的任何异常都会让后续请求永远排在队列里出不来。
                Ext.defer(function () {
                    me.fireEvent('unauthorized');
                }, 10);
                return;
            }
            if (options && options.suppressToast) {
                return;
            }
            var result = Ext.decode(response.responseText, true) || {},
                text = result.message;
            if (!text) {
                text = response.status === 0
                    ? '无法连接服务器，请确认后端已启动'
                    : '请求失败（HTTP ' + response.status + '）';
            }
            me.toast(text, 'error');
        });
    }
});
