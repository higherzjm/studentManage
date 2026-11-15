# 教师管理系统（Spring Boot + MyBatis-Plus + H2 + ExtJS 6.2）

一个可直接运行的教师管理系统：教师档案 CRUD、院系与课程维护、按学期安排任课、登录鉴权。
前端为 ExtJS 6.2 Classic，框架文件已离线内置，不依赖 CDN，也不需要 Sencha Cmd。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 后端 | Spring Boot 2.7.18（JDK 8）、MyBatis-Plus 3.5.3.1 |
| 数据库 | H2 内存库（MySQL 模式），启动时自动建表并灌入种子数据 |
| 鉴权 | 自建令牌会话（`X-Auth-Token`）+ `HandlerInterceptor`，密码用 BCrypt |
| 前端 | ExtJS 6.2.0 Classic（theme-neptune），`Ext.Loader` 按需加载，无构建步骤 |

## 快速开始

```bash
# 1. 构建（第一次运行需要联网下载依赖）
cd teacher-management-system
export JAVA_HOME="/d/Program Files (x86)/jdk/jdk1.8.0_261"
../.tools/apache-maven-3.9.9/bin/mvn -B -s tools/settings.xml -DskipTests package

# 2. 启动
"/d/Program Files (x86)/jdk/jdk1.8.0_261/bin/java" -jar target/teacher-management-system-1.0.0.jar

# 3. 打开浏览器
http://localhost:8080/
```

本机若已安装 Maven 3.6+，把上面的 mvn 换成 `mvn` 即可；`tools/settings.xml` 只是国内镜像配置，
用官方中央仓库构建成功也可以不加 `-s tools/settings.xml`。

### 演示账号

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `admin` | `admin123` | 管理员 |
| `T2001` / `T2005` / `T2010` | `123456` | 教师 |

种子数据：6 个院系、17 门课程、18 名教师、1 个学期（`2025-2026-1`）的任课安排。

### H2 控制台

`http://localhost:8080/h2-console`
JDBC URL `jdbc:h2:mem:tms;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE`，用户名 `sa`，密码留空。
数据只在内存里，应用重启即回到种子状态。

## 改前端不必重新打包

`static/` 会打进 jar，改一个 JS 就要重新 package 一次。开发时用源码目录直接提供静态资源：

```bash
"/d/Program Files (x86)/jdk/jdk1.8.0_261/bin/java" -jar target/teacher-management-system-1.0.0.jar \
  --spring.web.resources.static-locations=file:src/main/resources/static/
```

之后刷新浏览器即可看到 `src/main/resources/static` 下的最新代码（只有 Java 改动才需要重新构建）。

## 目录结构

```
src/main/java/com/example/tms
  common/     统一返回信封（ApiResult/PageResult）、业务异常、全局异常处理、查询工具
  config/     MyBatis-Plus 分页插件、MVC 拦截器注册、Jackson 日期格式
  controller/ auth / teacher / course / department 四个 REST 入口
  dto/        分页与查询入参、任课安排请求
  entity/     department、teacher、course、teacher_course、sys_user
  mapper/     MyBatis-Plus BaseMapper
  security/   令牌服务、拦截器、ThreadLocal 登录态
  service/    业务层：唯一性校验、引用完整性校验、分页与排序
  vo/         给前端的两视图对象（教师带任课数、课程带任课教师）

src/main/resources
  db/         schema.sql 建表、data.sql 种子数据
  application.yml
  static/
    index.html  引导页
    app.js      Ext.Loader 配置 + Ext.application（类文件靠 requires 按需加载）
    app/        Util.js（令牌与统一请求）、dict/ 共享字典、model/ store/ view/
    ext/        ExtJS 6.2.0 框架文件（471 个，离线内置）

tools/        fetch-ext-assets.sh（重新拉取 ext 目录）、settings.xml（Maven 镜像）
```

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/login` | 登录，返回令牌与用户信息 |
| POST | `/api/auth/logout` | 注销，令牌立即失效 |
| GET | `/api/auth/current` | 校验令牌，返回当前用户 |
| GET | `/api/teacher/page` | 教师分页（`start` `limit` `sort` `dir` `keyword` 院系/职称/性别/状态/入职日期区间） |
| GET/POST | `/api/teacher/{id}` `/save` `/update` `/delete/{id}` | 教师增删改查 |
| GET/POST | `/api/teacher/courses` `/courses/assign` | 某学期任课查询与覆盖式安排 |
| GET | `/api/teacher/terms` | 学期列表 |
| GET/POST | `/api/course/page` `/list` `/{id}` `/save` `/update` `/delete/{id}` | 课程 |
| GET/POST | `/api/department/page` `/list` `/{id}` `/save` `/update` `/delete/{id}` | 院系 |

约定：
- `/api/**` 全部要求携带 `X-Auth-Token`，未登录返回 401，前端统一弹回登录框。
- 写操作返回 `{success, message, data}`；列表返回 `{success, total, data}`，对应 ExtJS store 的 `totalProperty`/`rootProperty`。
- 排序字段走服务端白名单，前端传来的非法字段名会被忽略并回退到默认排序列。

## 一些设计取舍

- **不用 Sencha Cmd**：浏览器直接用 `Ext.Loader` 解析 `App.*`，因此一个类一个文件，字符串形式的
  按钮 `handler: 'onXxx'` 也不可用（那是 Cmd 的 `@controllable` 转换），统一写成 `listeners: {click: 'onXxx'}`。
- **令牌是内存态**：重启后所有会话失效，前端会在下一个 401 自动清掉本地令牌回到登录框。
  空闲过期时间由 `app.auth.token-idle-minutes` 控制（默认 120 分钟）。
- **引用完整性由服务端把关**：院系下仍有教师或课程时不允许删除；课程删除前检查任课安排；
  工号、院系代码、课程编号唯一。前端只做事前提示，最终判定在后端。
- **角色只用于界面展示**：管理员与教师在当前版本里的权限相同，没有做接口级 RBAC。
- **H2 用 MySQL 模式**：种子数据里的 `SELECT ... FROM department` 子查询和 `LIMIT` 写法都依赖这一点。

## 许可证

本项目代码以 GPL-3.0 发布（见 `LICENSE`）。`src/main/resources/static/ext/` 内置的
Sencha ExtJS 6.2.0 框架文件同样以 GPL 授权分发，版权归 Sencha 所有；这些文件由
`tools/fetch-ext-assets.sh` 拉取，内置只为让页面离线可跑，不含任何本项目原创内容。
