package com.example.tms.common;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BizException.class)
    public ApiResult<Void> handleBiz(BizException e) {
        return ApiResult.fail(e.getMessage());
    }

    /** @Valid 在 @RequestBody 上的校验失败。 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResult<Void> handleInvalid(MethodArgumentNotValidException e) {
        return ApiResult.fail(joinErrors(e.getBindingResult().getFieldErrors()));
    }

    /** @Valid 在表单/查询对象上的校验失败。 */
    @ExceptionHandler(BindException.class)
    public ApiResult<Void> handleBind(BindException e) {
        return ApiResult.fail(joinErrors(e.getBindingResult().getFieldErrors()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResult<Void> handleOther(Exception e) {
        log.error("未处理的服务端异常", e);
        return ApiResult.fail("服务器内部错误：" + e.getClass().getSimpleName());
    }

    private static String joinErrors(java.util.List<FieldError> errors) {
        return errors.stream()
                .map(err -> err.getField() + " " + err.getDefaultMessage())
                .collect(Collectors.joining("；"));
    }
}
