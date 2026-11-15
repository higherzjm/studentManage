-- 教师管理系统 · 演示数据
-- 不写死主键，交给自增序列，避免后续插入时与序列冲突；跨表引用用子查询。

-- ===== 院系 =====
INSERT INTO department (dept_code, dept_name, dean, phone, location, remark) VALUES
    ('CS',   '计算机科学与技术学院', '周明远', '010-62730011', '主楼 A 区 5 层', '含人工智能与系统两个方向'),
    ('SE',   '软件学院',             '李慧敏', '010-62730022', '主楼 B 区 3 层', '示范性软件学院'),
    ('EE',   '电子与信息工程学院',   '陈国强', '010-62730033', '信息楼 2 层',   '承担全校公共数学课'),
    ('MATH', '数学与统计学院',       '王丽娟', '010-62730044', '理科楼 4 层',   null),
    ('FL',   '外国语学院',           '张雅雯', '010-62730055', '文科楼 1 层',   null),
    ('ME',   '机械工程学院',         '刘建平', '010-62730066', '工程楼 3 层',   null);

-- ===== 教师 =====
INSERT INTO teacher (teacher_no, name, gender, birth_date, phone, email, title, education, department_id, hire_date, status, remark) VALUES
    ('T2001', '赵启航', '男', '1975-03-12', '13800010001', 'zhaoqh@univ.edu.cn',  '教授',   '博士', (SELECT id FROM department WHERE dept_code='CS'),   '2003-09-01', 1, '博士生导师，研究方向：分布式系统'),
    ('T2002', '孙雅琴', '女', '1982-07-25', '13800010002', 'sunyq@univ.edu.cn',    '副教授', '博士', (SELECT id FROM department WHERE dept_code='CS'),   '2009-07-01', 1, '机器学习课题组'),
    ('T2003', '吴承霖', '男', '1988-11-04', '13800010003', 'wycl@univ.edu.cn',     '讲师',   '硕士', (SELECT id FROM department WHERE dept_code='CS'),   '2015-09-01', 1, null),
    ('T2004', '郑晓岚', '女', '1990-01-19', '13800010004', 'zhengxl@univ.edu.cn',  '助教',   '硕士', (SELECT id FROM department WHERE dept_code='CS'),   '2018-09-01', 1, '在读博士'),
    ('T2005', '马文韬', '男', '1978-05-30', '13800010005', 'mawt@univ.edu.cn',     '教授',   '博士', (SELECT id FROM department WHERE dept_code='SE'),   '2005-09-01', 1, '软件学院院长助理'),
    ('T2006', '林静怡', '女', '1985-09-16', '13800010006', 'linjy@univ.edu.cn',    '副教授', '硕士', (SELECT id FROM department WHERE dept_code='SE'),   '2011-03-01', 1, null),
    ('T2007', '黄自強', '男', '1983-12-08', '13800010007', 'huangzq@univ.edu.cn',  '讲师',   '博士', (SELECT id FROM department WHERE dept_code='SE'),   '2014-09-01', 1, '海归博士'),
    ('T2008', '徐婉如', '女', '1979-04-21', '13800010008', 'xuwz@univ.edu.cn',     '教授',   '博士', (SELECT id FROM department WHERE dept_code='EE'),   '2004-09-01', 1, 'IEEE 会员'),
    ('T2009', '胡博文', '男', '1991-08-13', '13800010009', 'hubw@univ.edu.cn',     '助教',   '硕士', (SELECT id FROM department WHERE dept_code='EE'),   '2019-07-01', 1, null),
    ('T2010', '曹敏华', '女', '1976-02-09', '13800010010', 'caomh@univ.edu.cn',    '副教授', '硕士', (SELECT id FROM department WHERE dept_code='MATH'), '2002-09-01', 1, '全校高等数学教学组'),
    ('T2011', '袁晨阳', '男', '1987-06-27', '13800010011', 'yuancy@univ.edu.cn',   '讲师',   '博士', (SELECT id FROM department WHERE dept_code='MATH'), '2016-09-01', 1, null),
    ('T2012', '唐语彤', '女', '1992-10-15', '13800010012', 'tangyt@univ.edu.cn',   '助教',   '学士', (SELECT id FROM department WHERE dept_code='MATH'), '2020-09-01', 0, '2024 年离职深造'),
    ('T2013', '沈亦舟', '男', '1980-01-03', '13800010013', 'shenyz@univ.edu.cn',   '副教授', '博士', (SELECT id FROM department WHERE dept_code='FL'),   '2008-09-01', 1, '英语语言文学'),
    ('T2014', '韩雨薇', '女', '1986-03-22', '13800010014', 'hanyw@univ.edu.cn',    '讲师',   '硕士', (SELECT id FROM department WHERE dept_code='FL'),   '2013-09-01', 1, null),
    ('T2015', '彭思远', '男', '1974-11-11', '13800010015', 'pengsy@univ.edu.cn',   '教授',   '博士', (SELECT id FROM department WHERE dept_code='ME'),   '2000-09-01', 1, '机械设计及理论方向'),
    ('T2016', '邓佳琪', '女', '1989-07-07', '13800010016', 'dengjq@univ.edu.cn',   '讲师',   '硕士', (SELECT id FROM department WHERE dept_code='ME'),   '2017-09-01', 1, null),
    ('T2017', '罗承宇', '男', '1984-05-18', '13800010017', 'luocy@univ.edu.cn',    '副教授', '博士', (SELECT id FROM department WHERE dept_code='CS'),   '2012-09-01', 1, '兼任本科教学秘书'),
    ('T2018', '蒋若彤', '女', '1993-09-29', '13800010018', 'jiangrt@univ.edu.cn',  '助教',   '硕士', (SELECT id FROM department WHERE dept_code='EE'),   '2021-09-01', 1, null);

-- ===== 课程 =====
INSERT INTO course (course_no, course_name, credit, course_hours, department_id, course_type, status, description) VALUES
    ('CS101',  '计算机组成原理',    4.0, 64, (SELECT id FROM department WHERE dept_code='CS'),   '必修', 1, '专业核心课'),
    ('CS201',  '操作系统',          4.0, 64, (SELECT id FROM department WHERE dept_code='CS'),   '必修', 1, '含 16 学时实验'),
    ('CS305',  '机器学习导论',      3.0, 48, (SELECT id FROM department WHERE dept_code='CS'),   '选修', 1, '面向高年级本科与研究生'),
    ('CS410',  '分布式系统',        3.0, 48, (SELECT id FROM department WHERE dept_code='CS'),   '选修', 1, null),
    ('SE120',  '软件工程',          3.0, 48, (SELECT id FROM department WHERE dept_code='SE'),   '必修', 1, '专业入门课'),
    ('SE230',  '数据库系统',        4.0, 64, (SELECT id FROM department WHERE dept_code='SE'),   '必修', 1, null),
    ('SE340',  'Web 前端开发实务',  2.0, 40, (SELECT id FROM department WHERE dept_code='SE'),   '选修', 1, 'ExtJS / Vue 双方向'),
    ('SE341',  '移动应用开发',      2.0, 40, (SELECT id FROM department WHERE dept_code='SE'),   '选修', 0, '本学期停开'),
    ('EE210',  '信号与系统',        4.0, 64, (SELECT id FROM department WHERE dept_code='EE'),   '必修', 1, null),
    ('EE350',  '数字集成电路设计',  3.0, 48, (SELECT id FROM department WHERE dept_code='EE'),   '选修', 1, null),
    ('MATH101','高等数学（上）',    5.0, 80, (SELECT id FROM department WHERE dept_code='MATH'), '公共课', 1, '全校理工科大一年级'),
    ('MATH102','高等数学（下）',    5.0, 80, (SELECT id FROM department WHERE dept_code='MATH'), '公共课', 1, null),
    ('MATH260','概率论与数理统计',  3.0, 48, (SELECT id FROM department WHERE dept_code='MATH'), '公共课', 1, null),
    ('FL110',  '大学英语（一）',    2.0, 32, (SELECT id FROM department WHERE dept_code='FL'),   '公共课', 1, null),
    ('FL220',  '学术英语写作',      2.0, 32, (SELECT id FROM department WHERE dept_code='FL'),   '选修', 1, '研究生公共选修'),
    ('ME240',  '机械原理',          4.0, 64, (SELECT id FROM department WHERE dept_code='ME'),   '必修', 1, null),
    ('ME360',  '有限元分析基础',    3.0, 48, (SELECT id FROM department WHERE dept_code='ME'),   '选修', 1, null);

-- ===== 教师任课安排 =====
INSERT INTO teacher_course (teacher_id, course_id, term) VALUES
    ((SELECT id FROM teacher WHERE teacher_no='T2001'), (SELECT id FROM course WHERE course_no='CS201'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2001'), (SELECT id FROM course WHERE course_no='CS410'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2002'), (SELECT id FROM course WHERE course_no='CS305'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2002'), (SELECT id FROM course WHERE course_no='CS410'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2003'), (SELECT id FROM course WHERE course_no='CS101'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2004'), (SELECT id FROM course WHERE course_no='CS101'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2005'), (SELECT id FROM course WHERE course_no='SE120'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2006'), (SELECT id FROM course WHERE course_no='SE230'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2007'), (SELECT id FROM course WHERE course_no='SE340'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2008'), (SELECT id FROM course WHERE course_no='EE210'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2009'), (SELECT id FROM course WHERE course_no='EE210'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2010'), (SELECT id FROM course WHERE course_no='MATH101'),'2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2010'), (SELECT id FROM course WHERE course_no='MATH102'),'2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2011'), (SELECT id FROM course WHERE course_no='MATH260'),'2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2013'), (SELECT id FROM course WHERE course_no='FL220'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2014'), (SELECT id FROM course WHERE course_no='FL110'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2015'), (SELECT id FROM course WHERE course_no='ME240'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2016'), (SELECT id FROM course WHERE course_no='ME360'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2017'), (SELECT id FROM course WHERE course_no='CS201'),  '2025-2026-1'),
    ((SELECT id FROM teacher WHERE teacher_no='T2018'), (SELECT id FROM course WHERE course_no='EE350'),  '2025-2026-1');

-- ===== 登录账号 =====
-- admin / admin123 管理员；教师工号 / 123456 普通教师
INSERT INTO sys_user (username, password, real_name, role, department_id, status) VALUES
    ('admin', '$2a$10$27qgdiJWY47vuEW9rgY6rO6TQE6id5qL3opAPlF7NdfCN4RbehJHq', '系统管理员', 'ADMIN', NULL, 1),
    ('T2001', '$2a$10$44ohwyWknclrKB1YQ8cesOzFDPvMWEaSFHuxp0v/dBk6ncZVBeB4K', '赵启航',     'TEACHER', (SELECT id FROM department WHERE dept_code='CS'), 1),
    ('T2005', '$2a$10$44ohwyWknclrKB1YQ8cesOzFDPvMWEaSFHuxp0v/dBk6ncZVBeB4K', '马文韬',     'TEACHER', (SELECT id FROM department WHERE dept_code='SE'), 1),
    ('T2010', '$2a$10$44ohwyWknclrKB1YQ8cesOzFDPvMWEaSFHuxp0v/dBk6ncZVBeB4K', '曹敏华',     'TEACHER', (SELECT id FROM department WHERE dept_code='MATH'), 1);
