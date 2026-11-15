package com.example.tms.common;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;

/**
 * ExtJS Store 的分页信封：rootProperty = data，totalProperty = total。
 */
public class PageResult<T> {

    private boolean success = true;
    private long total;
    private List<T> data;

    public static <T> PageResult<T> of(IPage<T> page) {
        PageResult<T> r = new PageResult<>();
        r.total = page.getTotal();
        r.data = page.getRecords();
        return r;
    }

    public static <T> PageResult<T> of(long total, List<T> data) {
        PageResult<T> r = new PageResult<>();
        r.total = total;
        r.data = data;
        return r;
    }

    public static <T> PageResult<T> empty() {
        return of(0, java.util.Collections.emptyList());
    }

    public boolean isSuccess() {
        return success;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
