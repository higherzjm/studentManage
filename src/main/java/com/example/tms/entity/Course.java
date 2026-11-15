package com.example.tms.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@Data
@TableName("course")
public class Course {

    @TableId(type = IdType.AUTO)
    private Long id;

    @NotBlank(message = "不能为空")
    @Size(max = 32, message = "长度不能超过 32")
    private String courseNo;

    @NotBlank(message = "不能为空")
    @Size(max = 64, message = "长度不能超过 64")
    private String courseName;

    @DecimalMin(value = "0.0", message = "不能小于 0")
    @DecimalMax(value = "20.0", message = "不能大于 20")
    private BigDecimal credit;

    @Min(value = 0, message = "不能小于 0")
    @Max(value = 500, message = "不能大于 500")
    private Integer courseHours;

    private Long departmentId;

    /** 必修 / 选修 / 公共课 */
    private String courseType;

    /** 1 开设中，0 已停开 */
    private Integer status;

    @Size(max = 255, message = "长度不能超过 255")
    private String description;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
