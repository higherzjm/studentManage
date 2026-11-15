package com.example.tms.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tms.common.BizException;
import com.example.tms.common.PageResult;
import com.example.tms.common.QueryUtils;
import com.example.tms.dto.CourseAssignRequest;
import com.example.tms.dto.TeacherQuery;
import com.example.tms.entity.Course;
import com.example.tms.entity.Teacher;
import com.example.tms.entity.TeacherCourse;
import com.example.tms.mapper.CourseMapper;
import com.example.tms.mapper.TeacherCourseMapper;
import com.example.tms.mapper.TeacherMapper;
import com.example.tms.service.DepartmentService;
import com.example.tms.service.TeacherService;
import com.example.tms.vo.TeacherView;

@Service
public class TeacherServiceImpl implements TeacherService {

    private static final Map<String, String> SORTABLE = new LinkedHashMap<>();

    static {
        SORTABLE.put("teacherNo", "teacher_no");
        SORTABLE.put("name", "name");
        SORTABLE.put("title", "title");
        SORTABLE.put("departmentId", "department_id");
        SORTABLE.put("hireDate", "hire_date");
        SORTABLE.put("status", "status");
        SORTABLE.put("createTime", "create_time");
    }

    private final TeacherMapper teacherMapper;
    private final CourseMapper courseMapper;
    private final TeacherCourseMapper teacherCourseMapper;
    private final DepartmentService departmentService;

    public TeacherServiceImpl(TeacherMapper teacherMapper, CourseMapper courseMapper,
                             TeacherCourseMapper teacherCourseMapper, DepartmentService departmentService) {
        this.teacherMapper = teacherMapper;
        this.courseMapper = courseMapper;
        this.teacherCourseMapper = teacherCourseMapper;
        this.departmentService = departmentService;
    }

    @Override
    public PageResult<TeacherView> page(TeacherQuery query) {
        QueryWrapper<Teacher> wrapper = buildWrapper(query);
        QueryUtils.applySort(wrapper, query.getSort(), query.isDesc(), SORTABLE, "teacher_no");
        Page<Teacher> page = new Page<>(query.page(), query.size());
        Page<Teacher> result = teacherMapper.selectPage(page, wrapper);
        List<TeacherView> views = toViews(result.getRecords());
        return PageResult.of(result.getTotal(), views);
    }

    @Override
    public TeacherView get(Long id) {
        Teacher teacher = teacherMapper.selectById(id);
        if (teacher == null) {
            throw new BizException("教师不存在：" + id);
        }
        return toViews(Collections.singletonList(teacher)).get(0);
    }

    @Override
    @Transactional
    public void save(Teacher teacher) {
        checkNoUnique(teacher.getTeacherNo(), null);
        LocalDateTime now = LocalDateTime.now();
        teacher.setId(null);
        teacher.setStatus(teacher.getStatus() == null ? 1 : teacher.getStatus());
        teacher.setCreateTime(now);
        teacher.setUpdateTime(now);
        teacherMapper.insert(teacher);
    }

    @Override
    @Transactional
    public void update(Teacher teacher) {
        if (teacher.getId() == null) {
            throw new BizException("缺少教师 id");
        }
        get(teacher.getId());
        checkNoUnique(teacher.getTeacherNo(), teacher.getId());
        teacher.setUpdateTime(LocalDateTime.now());
        teacherMapper.updateById(teacher);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        get(id);
        teacherCourseMapper.delete(new QueryWrapper<TeacherCourse>().eq("teacher_id", id));
        teacherMapper.deleteById(id);
    }

    @Override
    public List<Long> listCourseIds(Long teacherId, String term) {
        QueryWrapper<TeacherCourse> wrapper = new QueryWrapper<TeacherCourse>().eq("teacher_id", teacherId);
        if (hasText(term)) {
            wrapper.eq("term", term);
        }
        return teacherCourseMapper.selectList(wrapper).stream()
                .map(TeacherCourse::getCourseId)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignCourses(CourseAssignRequest request) {
        Teacher teacher = teacherMapper.selectById(request.getTeacherId());
        if (teacher == null) {
            throw new BizException("教师不存在：" + request.getTeacherId());
        }
        String term = request.getTerm().trim();
        teacherCourseMapper.delete(new QueryWrapper<TeacherCourse>()
                .eq("teacher_id", request.getTeacherId())
                .eq("term", term));
        List<Long> courseIds = request.getCourseIds() == null
                ? Collections.<Long>emptyList()
                : request.getCourseIds().stream().distinct().collect(Collectors.toList());
        if (!courseIds.isEmpty()) {
            Long count = courseMapper.selectCount(new QueryWrapper<Course>().in("id", courseIds));
            if (count == null || count != courseIds.size()) {
                throw new BizException("课程列表中包含了不存在的课程");
            }
            LocalDateTime now = LocalDateTime.now();
            for (Long courseId : courseIds) {
                TeacherCourse link = new TeacherCourse();
                link.setTeacherId(request.getTeacherId());
                link.setCourseId(courseId);
                link.setTerm(term);
                link.setCreateTime(now);
                teacherCourseMapper.insert(link);
            }
        }
    }

    @Override
    public List<String> listTerms() {
        return teacherCourseMapper.selectList(new QueryWrapper<TeacherCourse>()
                        .select("DISTINCT term").orderByDesc("term")).stream()
                .map(TeacherCourse::getTerm)
                .collect(Collectors.toList());
    }

    /** 查询条件 -> Wrapper，所有条件都是可选的。 */
    private QueryWrapper<Teacher> buildWrapper(TeacherQuery query) {
        QueryWrapper<Teacher> wrapper = new QueryWrapper<>();
        QueryUtils.likeAny(wrapper, query.getKeyword(), "teacher_no", "name", "email", "phone");
        if (query.getDepartmentId() != null) {
            wrapper.eq("department_id", query.getDepartmentId());
        }
        if (hasText(query.getGender())) {
            wrapper.eq("gender", query.getGender());
        }
        if (hasText(query.getTitle())) {
            wrapper.eq("title", query.getTitle());
        }
        if (query.getStatus() != null) {
            wrapper.eq("status", query.getStatus());
        }
        if (query.getHireDateFrom() != null) {
            wrapper.ge("hire_date", query.getHireDateFrom());
        }
        if (query.getHireDateTo() != null) {
            wrapper.le("hire_date", query.getHireDateTo());
        }
        return wrapper;
    }

    /** 补齐院系名称与任课门数，避免在 SQL 里做联表。 */
    private List<TeacherView> toViews(List<Teacher> teachers) {
        if (teachers.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, String> deptNames = departmentService.nameMap();
        List<Long> ids = teachers.stream().map(Teacher::getId).collect(Collectors.toList());
        Map<Long, Long> courseCounts = teacherCourseMapper
                .selectList(new QueryWrapper<TeacherCourse>().select("teacher_id").in("teacher_id", ids))
                .stream()
                .collect(Collectors.groupingBy(TeacherCourse::getTeacherId, Collectors.counting()));
        List<TeacherView> views = new ArrayList<>(teachers.size());
        for (Teacher teacher : teachers) {
            TeacherView view = new TeacherView();
            BeanUtils.copyProperties(teacher, view);
            view.setDepartmentName(deptNames.get(teacher.getDepartmentId()));
            view.setCourseCount(courseCounts.getOrDefault(teacher.getId(), 0L).intValue());
            views.add(view);
        }
        return views;
    }

    private void checkNoUnique(String teacherNo, Long selfId) {
        QueryWrapper<Teacher> wrapper = new QueryWrapper<Teacher>().eq("teacher_no", teacherNo);
        if (selfId != null) {
            wrapper.ne("id", selfId);
        }
        Long count = teacherMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new BizException("工号已存在：" + teacherNo);
        }
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
