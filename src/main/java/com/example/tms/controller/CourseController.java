package com.example.tms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tms.common.ApiResult;
import com.example.tms.common.PageResult;
import com.example.tms.dto.CourseQuery;
import com.example.tms.entity.Course;
import com.example.tms.service.CourseService;
import com.example.tms.vo.CourseView;

@RestController
@RequestMapping("/api/course")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/page")
    public PageResult<CourseView> page(CourseQuery query) {
        return courseService.page(query);
    }

    /** 教师任课选择器的数据源。 */
    @GetMapping("/list")
    public ApiResult<List<Course>> list() {
        return ApiResult.ok(courseService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResult<CourseView> get(@PathVariable Long id) {
        return ApiResult.ok(courseService.get(id));
    }

    @PostMapping("/save")
    public ApiResult<Void> save(@Valid @RequestBody Course course) {
        courseService.save(course);
        return ApiResult.ok(null, "课程已新增");
    }

    @PostMapping("/update")
    public ApiResult<Void> update(@Valid @RequestBody Course course) {
        courseService.update(course);
        return ApiResult.ok(null, "课程已保存");
    }

    @PostMapping("/delete/{id}")
    public ApiResult<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ApiResult.ok(null, "课程已删除");
    }
}
