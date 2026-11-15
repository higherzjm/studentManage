package com.example.tms.vo;

import com.example.tms.entity.Teacher;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 教师列表行：实体字段 + 冗余的院系名称，前端一次读取即可渲染。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TeacherView extends Teacher {

    private String departmentName;

    /** 当前学期任课门数 */
    private Integer courseCount;
}
