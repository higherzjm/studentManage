package com.example.tms.common;

import java.util.Map;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

public final class QueryUtils {

    private QueryUtils() {
    }

    /**
     * 只接受白名单里的排序列，避免把前端传来的字段名直接拼进 order by。
     */
    public static <T> void applySort(QueryWrapper<T> wrapper, String sort, boolean desc,
                                     Map<String, String> whitelist, String fallbackColumn) {
        String column = sort == null ? null : whitelist.get(sort);
        if (column == null) {
            column = fallbackColumn;
        }
        wrapper.orderBy(true, !desc, column);
    }

    /** 关键字为空时返回原 wrapper，否则按 given 列做 or 模糊匹配。 */
    public static <T> void likeAny(QueryWrapper<T> wrapper, String keyword, String... columns) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return;
        }
        String value = keyword.trim();
        wrapper.and(outer -> {
            for (int i = 0; i < columns.length; i++) {
                if (i > 0) {
                    outer.or();
                }
                outer.like(columns[i], value);
            }
        });
    }
}
