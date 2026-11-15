package com.example.tms.entity;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@Data
@TableName("department")
public class Department {

    @TableId(type = IdType.AUTO)
    private Long id;

    @NotBlank(message = "不能为空")
    @Size(max = 32, message = "长度不能超过 32")
    private String deptCode;

    @NotBlank(message = "不能为空")
    @Size(max = 64, message = "长度不能超过 64")
    private String deptName;

    private String dean;

    private String phone;

    private String location;

    private String remark;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
