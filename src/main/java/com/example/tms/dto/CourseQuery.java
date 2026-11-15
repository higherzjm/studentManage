package com.example.tms.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CourseQuery extends PageQuery {

    private Long departmentId;

    private String courseType;

    private Integer status;

    /** 按任课教师筛选（教师 id） */
    private Long teacherId;
}
