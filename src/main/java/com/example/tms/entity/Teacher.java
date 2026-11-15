package com.example.tms.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@Data
@TableName("teacher")
public class Teacher {

    @TableId(type = IdType.AUTO)
    private Long id;

    @NotBlank(message = "不能为空")
    @Size(max = 32, message = "长度不能超过 32")
    private String teacherNo;

    @NotBlank(message = "不能为空")
    @Size(max = 32, message = "长度不能超过 32")
    private String name;

    @Pattern(regexp = "^[男女]$", message = "只能是 男 或 女")
    private String gender;

    private LocalDate birthDate;

    @Pattern(regexp = "^$|^[0-9+\\-()\\s]{6,20}$", message = "格式不正确")
    private String phone;

    @Email(message = "格式不正确")
    @Size(max = 64, message = "长度不能超过 64")
    private String email;

    /** 职称：教授 / 副教授 / 讲师 / 助教 */
    private String title;

    /** 学历：博士 / 硕士 / 学士 */
    private String education;

    private Long departmentId;

    private LocalDate hireDate;

    /** 1 在职，0 离职 */
    private Integer status;

    @Size(max = 255, message = "长度不能超过 255")
    private String remark;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
