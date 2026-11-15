package com.example.tms.common;

/**
 * 统一的写操作返回体，ExtJS 直接读取 success / message / data。
 */
public class ApiResult<T> {

    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResult<T> ok() {
        return ok(null, null);
    }

    public static <T> ApiResult<T> ok(T data) {
        return ok(data, null);
    }

    public static <T> ApiResult<T> ok(T data, String message) {
        ApiResult<T> r = new ApiResult<>();
        r.success = true;
        r.data = data;
        r.message = message;
        return r;
    }

    public static <T> ApiResult<T> fail(String message) {
        ApiResult<T> r = new ApiResult<>();
        r.success = false;
        r.message = message;
        return r;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
