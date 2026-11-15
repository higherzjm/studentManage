package com.example.tms.service;

import java.util.List;

import com.example.tms.common.PageResult;
import com.example.tms.dto.CourseAssignRequest;
import com.example.tms.dto.TeacherQuery;
import com.example.tms.entity.Teacher;
import com.example.tms.vo.TeacherView;

public interface TeacherService {

    PageResult<TeacherView> page(TeacherQuery query);

    TeacherView get(Long id);

    void save(Teacher teacher);

    void update(Teacher teacher);

    void delete(Long id);

    /** 某教师某学期的任课课程 id。 */
    List<Long> listCourseIds(Long teacherId, String term);

    /** 整组覆盖某学期的任课安排。 */
    void assignCourses(CourseAssignRequest request);

    /** 可选择的学期列表，来自已有任课记录。 */
    List<String> listTerms();
}
