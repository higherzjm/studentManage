package com.example.tms.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@Data
@TableName("teacher_course")
public class TeacherCourse {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long teacherId;

    private Long courseId;

    /** 开课学期，例如 2025-2026-1 */
    private String term;

    private LocalDateTime createTime;
}
