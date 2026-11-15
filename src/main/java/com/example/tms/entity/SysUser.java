package com.example.tms.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@TableName("sys_user")
public class SysUser {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    /** BCrypt 摘要，永不出现在响应里。 */
    @JsonIgnore
    private String password;

    private String realName;

    /** ADMIN 管理员，TEACHER 普通教师 */
    private String role;

    private Long departmentId;

    private Integer status;

    private LocalDateTime lastLoginTime;

    private LocalDateTime createTime;
}
