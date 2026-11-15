-- 教师管理系统 · H2 (MySQL 兼容模式) 建表脚本
-- 由 spring.sql.init 在每次启动时执行

CREATE TABLE IF NOT EXISTS department
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    dept_code    VARCHAR(32)  NOT NULL UNIQUE,
    dept_name    VARCHAR(64)  NOT NULL,
    dean         VARCHAR(32),
    phone        VARCHAR(32),
    location     VARCHAR(128),
    remark       VARCHAR(255),
    create_time  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_no    VARCHAR(32)  NOT NULL UNIQUE,
    name          VARCHAR(32)  NOT NULL,
    gender        VARCHAR(4)   NOT NULL DEFAULT '男',
    birth_date    DATE,
    phone         VARCHAR(32),
    email         VARCHAR(64),
    title         VARCHAR(32),
    education     VARCHAR(32),
    department_id BIGINT,
    hire_date     DATE,
    status        TINYINT      NOT NULL DEFAULT 1,
    remark        VARCHAR(255),
    create_time   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teacher_dept ON teacher (department_id);
CREATE INDEX IF NOT EXISTS idx_teacher_name ON teacher (name);

CREATE TABLE IF NOT EXISTS course
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_no     VARCHAR(32)  NOT NULL UNIQUE,
    course_name   VARCHAR(64)  NOT NULL,
    credit        DECIMAL(4, 1) NOT NULL DEFAULT 0,
    course_hours  INT          NOT NULL DEFAULT 0,
    department_id BIGINT,
    course_type   VARCHAR(32),
    status        TINYINT      NOT NULL DEFAULT 1,
    description   VARCHAR(255),
    create_time   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_course_dept ON course (department_id);

CREATE TABLE IF NOT EXISTS teacher_course
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id  BIGINT       NOT NULL,
    course_id   BIGINT       NOT NULL,
    term        VARCHAR(32)  NOT NULL DEFAULT '',
    create_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_teacher_course UNIQUE (teacher_id, course_id, term)
);

CREATE INDEX IF NOT EXISTS idx_tc_course ON teacher_course (course_id);

CREATE TABLE IF NOT EXISTS sys_user
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(32)  NOT NULL UNIQUE,
    password        VARCHAR(100) NOT NULL,
    real_name       VARCHAR(32),
    role            VARCHAR(16)  NOT NULL DEFAULT 'TEACHER',
    department_id   BIGINT,
    status          TINYINT      NOT NULL DEFAULT 1,
    last_login_time TIMESTAMP,
    create_time     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
