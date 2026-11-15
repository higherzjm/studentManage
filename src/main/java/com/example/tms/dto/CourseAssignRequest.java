package com.example.tms.dto;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * 教师任课安排：整组覆盖某个学期下该教师的课程列表。
 */
@Data
public class CourseAssignRequest {

    @NotNull(message = "不能为空")
    private Long teacherId;

    @NotBlank(message = "不能为空")
    private String term;

    private List<Long> courseIds;
}
