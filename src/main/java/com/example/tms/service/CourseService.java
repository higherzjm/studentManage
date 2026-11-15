package com.example.tms.service;

import java.util.List;

import com.example.tms.common.PageResult;
import com.example.tms.dto.CourseQuery;
import com.example.tms.entity.Course;
import com.example.tms.vo.CourseView;

public interface CourseService {

    PageResult<CourseView> page(CourseQuery query);

    List<Course> listAll();

    CourseView get(Long id);

    void save(Course course);

    void update(Course course);

    void delete(Long id);
}
