package com.example.tms.vo;

import com.example.tms.entity.Course;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CourseView extends Course {

    private String departmentName;

    /** 任课教师姓名，多个以 、 分隔 */
    private String teacherNames;
}
