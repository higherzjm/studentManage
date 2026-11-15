package com.example.tms.dto;

import lombok.Data;

/**
 * ExtJS PagingGrid 的通用查询参数：start/limit 来自分页工具条，sort/dir 来自排序状态。
 */
@Data
public class PageQuery {

    private Integer start = 0;

    private Integer limit = 20;

    /** ExtJS 字段名，服务端用白名单映射到列，避免任意排序注入。 */
    private String sort;

    /** ASC / DESC */
    private String dir;

    /** 关键字，按具体实体的可搜索列匹配。 */
    private String keyword;

    public long page() {
        int size = limit == null || limit < 1 ? 20 : limit;
        int offset = start == null || start < 0 ? 0 : start;
        return offset / size + 1;
    }

    public long size() {
        if (limit == null || limit < 1) {
            return 20;
        }
        return Math.min(limit, 500);
    }

    /** 只有 dir 明确写了 DESC 才降序；没带 dir（默认按 fallback 列）时保持升序。 */
    public boolean isDesc() {
        return dir != null && "DESC".equalsIgnoreCase(dir);
    }
}
