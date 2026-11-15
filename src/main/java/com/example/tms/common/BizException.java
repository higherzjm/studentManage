package com.example.tms.common;

/**
 * 业务校验失败，由全局异常处理翻译成 ExtJS 能识别的 success=false 响应。
 */
public class BizException extends RuntimeException {

    public BizException(String message) {
        super(message);
    }
}
