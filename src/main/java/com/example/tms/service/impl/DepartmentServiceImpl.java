package com.example.tms.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tms.common.BizException;
import com.example.tms.common.PageResult;
import com.example.tms.common.QueryUtils;
import com.example.tms.dto.PageQuery;
import com.example.tms.entity.Course;
import com.example.tms.entity.Department;
import com.example.tms.entity.Teacher;
import com.example.tms.mapper.CourseMapper;
import com.example.tms.mapper.DepartmentMapper;
import com.example.tms.mapper.TeacherMapper;
import com.example.tms.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private static final Map<String, String> SORTABLE = new LinkedHashMap<>();

    static {
        SORTABLE.put("deptCode", "dept_code");
        SORTABLE.put("deptName", "dept_name");
        SORTABLE.put("dean", "dean");
        SORTABLE.put("createTime", "create_time");
    }

    private final DepartmentMapper departmentMapper;
    private final TeacherMapper teacherMapper;
    private final CourseMapper courseMapper;

    public DepartmentServiceImpl(DepartmentMapper departmentMapper, TeacherMapper teacherMapper,
                                 CourseMapper courseMapper) {
        this.departmentMapper = departmentMapper;
        this.teacherMapper = teacherMapper;
        this.courseMapper = courseMapper;
    }

    @Override
    public PageResult<Department> page(PageQuery query) {
        QueryWrapper<Department> wrapper = new QueryWrapper<>();
        QueryUtils.likeAny(wrapper, query.getKeyword(), "dept_code", "dept_name", "dean");
        QueryUtils.applySort(wrapper, query.getSort(), query.isDesc(), SORTABLE, "dept_code");
        Page<Department> page = new Page<>(query.page(), query.size());
        return PageResult.of(departmentMapper.selectPage(page, wrapper));
    }

    @Override
    public List<Department> listAll() {
        return departmentMapper.selectList(new QueryWrapper<Department>().orderByAsc("dept_code"));
    }

    @Override
    public Map<Long, String> nameMap() {
        Map<Long, String> map = new HashMap<>();
        for (Department d : listAll()) {
            map.put(d.getId(), d.getDeptName());
        }
        return map;
    }

    @Override
    public Department get(Long id) {
        Department department = departmentMapper.selectById(id);
        if (department == null) {
            throw new BizException("院系不存在：" + id);
        }
        return department;
    }

    @Override
    @Transactional
    public void save(Department department) {
        checkCodeUnique(department.getDeptCode(), null);
        LocalDateTime now = LocalDateTime.now();
        department.setId(null);
        department.setCreateTime(now);
        department.setUpdateTime(now);
        departmentMapper.insert(department);
    }

    @Override
    @Transactional
    public void update(Department department) {
        if (department.getId() == null) {
            throw new BizException("缺少院系 id");
        }
        get(department.getId());
        checkCodeUnique(department.getDeptCode(), department.getId());
        department.setUpdateTime(LocalDateTime.now());
        departmentMapper.updateById(department);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        get(id);
        Long teachers = teacherMapper.selectCount(new QueryWrapper<Teacher>().eq("department_id", id));
        if (teachers != null && teachers > 0) {
            throw new BizException("该院系下还有 " + teachers + " 名教师，请先调整教师所属院系");
        }
        Long courses = courseMapper.selectCount(new QueryWrapper<Course>().eq("department_id", id));
        if (courses != null && courses > 0) {
            throw new BizException("该院系下还有 " + courses + " 门课程，请先调整课程归属");
        }
        departmentMapper.deleteById(id);
    }

    private void checkCodeUnique(String code, Long selfId) {
        QueryWrapper<Department> wrapper = new QueryWrapper<Department>().eq("dept_code", code);
        if (selfId != null) {
            wrapper.ne("id", selfId);
        }
        Long count = departmentMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new BizException("院系代码已存在：" + code);
        }
    }
}
