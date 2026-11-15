package com.example.tms.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TeacherQuery extends PageQuery {

    private Long departmentId;

    private String gender;

    private String title;

    /** 1 在职，0 离职，null 不限 */
    private Integer status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate hireDateFrom;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate hireDateTo;
}
