package com.example.tms.service;

import java.util.List;
import java.util.Map;

import com.example.tms.common.PageResult;
import com.example.tms.dto.PageQuery;
import com.example.tms.entity.Department;

public interface DepartmentService {

    PageResult<Department> page(PageQuery query);

    List<Department> listAll();

    /** id -> 名称，用于列表行里的冗余展示字段。 */
    Map<Long, String> nameMap();

    Department get(Long id);

    void save(Department department);

    void update(Department department);

    void delete(Long id);
}
