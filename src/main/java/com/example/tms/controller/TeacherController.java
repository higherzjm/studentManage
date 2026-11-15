package com.example.tms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.tms.common.ApiResult;
import com.example.tms.common.PageResult;
import com.example.tms.dto.CourseAssignRequest;
import com.example.tms.dto.TeacherQuery;
import com.example.tms.entity.Teacher;
import com.example.tms.service.TeacherService;
import com.example.tms.vo.TeacherView;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/page")
    public PageResult<TeacherView> page(TeacherQuery query) {
        return teacherService.page(query);
    }

    @GetMapping("/{id}")
    public ApiResult<TeacherView> get(@PathVariable Long id) {
        return ApiResult.ok(teacherService.get(id));
    }

    @PostMapping("/save")
    public ApiResult<Void> save(@Valid @RequestBody Teacher teacher) {
        teacherService.save(teacher);
        return ApiResult.ok(null, "教师已新增");
    }

    @PostMapping("/update")
    public ApiResult<Void> update(@Valid @RequestBody Teacher teacher) {
        teacherService.update(teacher);
        return ApiResult.ok(null, "教师信息已保存");
    }

    @PostMapping("/delete/{id}")
    public ApiResult<Void> delete(@PathVariable Long id) {
        teacherService.delete(id);
        return ApiResult.ok(null, "教师已删除，任课安排同步解除");
    }

    @GetMapping("/courses")
    public ApiResult<List<Long>> courses(@RequestParam Long teacherId,
                                        @RequestParam(required = false) String term) {
        return ApiResult.ok(teacherService.listCourseIds(teacherId, term));
    }

    @PostMapping("/courses/assign")
    public ApiResult<Void> assign(@Valid @RequestBody CourseAssignRequest request) {
        teacherService.assignCourses(request);
        return ApiResult.ok(null, "任课安排已保存");
    }

    @GetMapping("/terms")
    public ApiResult<List<String>> terms() {
        return ApiResult.ok(teacherService.listTerms());
    }
}
