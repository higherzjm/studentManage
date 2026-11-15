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
import com.example.tms.dto.CourseQuery;
import com.example.tms.entity.Course;
import com.example.tms.entity.Teacher;
import com.example.tms.entity.TeacherCourse;
import com.example.tms.mapper.CourseMapper;
import com.example.tms.mapper.TeacherCourseMapper;
import com.example.tms.mapper.TeacherMapper;
import com.example.tms.service.CourseService;
import com.example.tms.service.DepartmentService;
import com.example.tms.vo.CourseView;

@Service
public class CourseServiceImpl implements CourseService {

    private static final Map<String, String> SORTABLE = new LinkedHashMap<>();

    static {
        SORTABLE.put("courseNo", "course_no");
        SORTABLE.put("courseName", "course_name");
        SORTABLE.put("credit", "credit");
        SORTABLE.put("courseHours", "course_hours");
        SORTABLE.put("courseType", "course_type");
        SORTABLE.put("status", "status");
    }

    private final CourseMapper courseMapper;
    private final TeacherMapper teacherMapper;
    private final TeacherCourseMapper teacherCourseMapper;
    private final DepartmentService departmentService;

    public CourseServiceImpl(CourseMapper courseMapper, TeacherMapper teacherMapper,
                             TeacherCourseMapper teacherCourseMapper, DepartmentService departmentService) {
        this.courseMapper = courseMapper;
        this.teacherMapper = teacherMapper;
        this.teacherCourseMapper = teacherCourseMapper;
        this.departmentService = departmentService;
    }

    @Override
    public PageResult<CourseView> page(CourseQuery query) {
        QueryWrapper<Course> wrapper = new QueryWrapper<>();
        QueryUtils.likeAny(wrapper, query.getKeyword(), "course_no", "course_name");
        if (query.getDepartmentId() != null) {
            wrapper.eq("department_id", query.getDepartmentId());
        }
        if (hasText(query.getCourseType())) {
            wrapper.eq("course_type", query.getCourseType());
        }
        if (query.getStatus() != null) {
            wrapper.eq("status", query.getStatus());
        }
        if (query.getTeacherId() != null) {
            List<Long> courseIds = listCourseIdsOfTeacher(query.getTeacherId());
            if (courseIds.isEmpty()) {
                return PageResult.empty();
            }
            wrapper.in("id", courseIds);
        }
        QueryUtils.applySort(wrapper, query.getSort(), query.isDesc(), SORTABLE, "course_no");
        Page<Course> page = new Page<>(query.page(), query.size());
        Page<Course> result = courseMapper.selectPage(page, wrapper);
        return PageResult.of(result.getTotal(), toViews(result.getRecords()));
    }

    @Override
    public List<Course> listAll() {
        return courseMapper.selectList(new QueryWrapper<Course>().orderByAsc("course_no"));
    }

    @Override
    public CourseView get(Long id) {
        Course course = courseMapper.selectById(id);
        if (course == null) {
            throw new BizException("课程不存在：" + id);
        }
        return toViews(Collections.singletonList(course)).get(0);
    }

    @Override
    @Transactional
    public void save(Course course) {
        checkNoUnique(course.getCourseNo(), null);
        LocalDateTime now = LocalDateTime.now();
        course.setId(null);
        course.setStatus(course.getStatus() == null ? 1 : course.getStatus());
        course.setCreateTime(now);
        course.setUpdateTime(now);
        courseMapper.insert(course);
    }

    @Override
    @Transactional
    public void update(Course course) {
        if (course.getId() == null) {
            throw new BizException("缺少课程 id");
        }
        get(course.getId());
        checkNoUnique(course.getCourseNo(), course.getId());
        course.setUpdateTime(LocalDateTime.now());
        courseMapper.updateById(course);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        get(id);
        Long linked = teacherCourseMapper.selectCount(new QueryWrapper<TeacherCourse>().eq("course_id", id));
        if (linked != null && linked > 0) {
            throw new BizException("该课程已有 " + linked + " 条任课安排，请先解除关联");
        }
        courseMapper.deleteById(id);
    }

    private List<Long> listCourseIdsOfTeacher(Long teacherId) {
        return teacherCourseMapper.selectList(new QueryWrapper<TeacherCourse>()
                        .select("DISTINCT course_id").eq("teacher_id", teacherId)).stream()
                .map(TeacherCourse::getCourseId)
                .collect(Collectors.toList());
    }

    /** 补齐院系名称与任课教师，两次批量查询即可，不在 SQL 里做联表。 */
    private List<CourseView> toViews(List<Course> courses) {
        if (courses.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, String> deptNames = departmentService.nameMap();
        List<Long> courseIds = courses.stream().map(Course::getId).collect(Collectors.toList());
        List<TeacherCourse> links = teacherCourseMapper
                .selectList(new QueryWrapper<TeacherCourse>().in("course_id", courseIds));
        Map<Long, String> teacherNamesByCourse = Collections.emptyMap();
        if (!links.isEmpty()) {
            List<Long> teacherIds = links.stream().map(TeacherCourse::getTeacherId).distinct()
                    .collect(Collectors.toList());
            Map<Long, String> teacherNames = teacherMapper
                    .selectList(new QueryWrapper<Teacher>().select("id", "name").in("id", teacherIds)).stream()
                    .collect(Collectors.toMap(Teacher::getId, Teacher::getName, (a, b) -> a));
            teacherNamesByCourse = links.stream()
                    .filter(link -> teacherNames.containsKey(link.getTeacherId()))
                    .collect(Collectors.groupingBy(TeacherCourse::getCourseId, LinkedHashMap::new,
                            Collectors.mapping(link -> teacherNames.get(link.getTeacherId()),
                                    Collectors.joining("、"))));
        }
        List<CourseView> views = new ArrayList<>(courses.size());
        for (Course course : courses) {
            CourseView view = new CourseView();
            BeanUtils.copyProperties(course, view);
            view.setDepartmentName(deptNames.get(course.getDepartmentId()));
            view.setTeacherNames(teacherNamesByCourse.get(course.getId()));
            views.add(view);
        }
        return views;
    }

    private void checkNoUnique(String courseNo, Long selfId) {
        QueryWrapper<Course> wrapper = new QueryWrapper<Course>().eq("course_no", courseNo);
        if (selfId != null) {
            wrapper.ne("id", selfId);
        }
        Long count = courseMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new BizException("课程编号已存在：" + courseNo);
        }
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
