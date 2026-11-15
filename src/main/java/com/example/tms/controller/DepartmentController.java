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
import com.example.tms.dto.PageQuery;
import com.example.tms.entity.Department;
import com.example.tms.service.DepartmentService;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/page")
    public PageResult<Department> page(PageQuery query) {
        return departmentService.page(query);
    }

    /** 下拉框数据源。 */
    @GetMapping("/list")
    public ApiResult<List<Department>> list() {
        return ApiResult.ok(departmentService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResult<Department> get(@PathVariable Long id) {
        return ApiResult.ok(departmentService.get(id));
    }

    @PostMapping("/save")
    public ApiResult<Void> save(@Valid @RequestBody Department department) {
        departmentService.save(department);
        return ApiResult.ok(null, "院系已新增");
    }

    @PostMapping("/update")
    public ApiResult<Void> update(@Valid @RequestBody Department department) {
        departmentService.update(department);
        return ApiResult.ok(null, "院系已保存");
    }

    @PostMapping("/delete/{id}")
    public ApiResult<Void> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ApiResult.ok(null, "院系已删除");
    }
}
