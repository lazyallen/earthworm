import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, desc, eq, or } from "drizzle-orm";

import {
  course,
  courseHistory,
  coursePack,
  masteredElements,
  statement,
  userCourseProgress,
} from "@earthworm/schema";
import { CourseHistoryService } from "../course-history/course-history.service";
import { CourseService } from "../course/course.service";
import { DB, DbType } from "../global/providers/db.provider";
import { MembershipService } from "../membership/membership.service";

@Injectable()
export class CoursePackService {
  constructor(
    @Inject(DB) private db: DbType,
    private readonly courseService: CourseService,
    private readonly courseHistoryService: CourseHistoryService,
    private readonly membershipService: MembershipService,
  ) {}

  async findAll(userId?: string) {
    let result = [];

    const publicCoursePacks = await this.findAllPublicCoursePacks();
    result.push(...publicCoursePacks);

    if (userId) {
      const userIdOwnedCoursePacks = await this.findAllForUser(userId);
      result.push(...userIdOwnedCoursePacks);

      // 看看是不是创始会员
      // 是的话 需要去查所有课程包的 shareLevel 为 founder_only 的
      if (await this.membershipService.isFounderMembership(userId)) {
        const founderOnlyCoursePacks = await this.findFounderOnly();
        result.push(...founderOnlyCoursePacks);
      }
    }

    return result;
  }

  async findFounderOnly() {
    const coursePacks = await this.db.query.coursePack.findMany({
      orderBy: asc(coursePack.order),
      where: and(eq(coursePack.shareLevel, "founder_only")), // TODO 缺一个 shareLevel 的枚举类型
    });

    return coursePacks;
  }

  async findAllForUser(userId: string) {
    const userIdOwnedCoursePacks = await this.db.query.coursePack.findMany({
      orderBy: asc(coursePack.order),
      where: and(eq(coursePack.creatorId, userId), eq(coursePack.shareLevel, "private")),
    });

    return userIdOwnedCoursePacks;
  }

  async findAllPublicCoursePacks() {
    return await this.db.query.coursePack.findMany({
      orderBy: asc(coursePack.order),
      where: eq(coursePack.shareLevel, "public"),
    });
  }

  async findOne(coursePackId: string) {
    const result = await this.db.query.coursePack.findFirst({
      where: eq(coursePack.id, coursePackId),
    });

    if (!result) {
      throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
    }

    return result;
  }

  async findOneWithCourses(userId: string, coursePackId: string) {
    const coursePackWithCourses = await this.findCoursePackWithCourses(coursePackId, userId);

    if (userId) {
      coursePackWithCourses.courses = await this.addCompletionCountsToCourses(
        userId,
        coursePackWithCourses.courses,
        coursePackId,
      );
    }

    return coursePackWithCourses;
  }

  private async findCoursePackWithCourses(coursePackId: string, userId: string) {
    const coursePackWithCourses = await this.db.query.coursePack.findFirst({
      where: and(eq(coursePack.id, coursePackId)),
      with: {
        courses: {
          orderBy: asc(course.order),
        },
      },
    });

    if (!coursePackWithCourses) {
      throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
    }

    if (coursePackWithCourses.shareLevel === "private") {
      if (coursePackWithCourses.creatorId === userId) {
        return coursePackWithCourses;
      } else {
        throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
      }
    } else if (coursePackWithCourses.shareLevel === "founder_only") {
      if (await this.membershipService.isFounderMembership(userId)) {
        return coursePackWithCourses;
      } else {
        throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
      }
    } else {
      return coursePackWithCourses;
    }
  }

  private async addCompletionCountsToCourses(userId: string, courses: any[], coursePackId: string) {
    return await Promise.all(
      courses.map(async (course) => {
        const completionCount = await this.courseHistoryService.findCompletionCount(
          userId,
          coursePackId,
          course.id,
        );
        return {
          ...course,
          completionCount,
        };
      }),
    );
  }

  async findCourse(userId: string, coursePackId: string, courseId: string) {
    if (userId) {
      return await this.courseService.findWithUserProgress(coursePackId, courseId, userId);
    } else {
      return await this.courseService.find(coursePackId, courseId);
    }
  }

  async findNextCourse(coursePackId: string, courseId: string) {
    return await this.courseService.findNext(coursePackId, courseId);
  }

  async completeCourse(userId: string, coursePackId: string, courseId: string) {
    return await this.courseService.completeCourse(userId, coursePackId, courseId);
  }

  async importCourseFromCsv(
    userId: string,
    coursePackId: string,
    csvData: Array<{ chinese: string; english: string; soundmark: string }>,
    courseName?: string,
  ) {
    // 验证用户是否有权限导入到这个课程包
    const coursePackExists = await this.db.query.coursePack.findFirst({
      where: and(
        eq(coursePack.id, coursePackId),
        or(eq(coursePack.creatorId, userId), eq(coursePack.shareLevel, "public")),
      ),
    });

    if (!coursePackExists) {
      throw new NotFoundException(
        `CoursePack with ID ${coursePackId} not found or you don't have permission to modify it`,
      );
    }

    // 验证CSV数据格式
    if (!csvData || csvData.length === 0) {
      throw new BadRequestException("CSV data is empty");
    }

    for (const item of csvData) {
      if (!item.chinese || !item.english || !item.soundmark) {
        throw new BadRequestException(
          "CSV data format is invalid. Each row must have chinese, english, and soundmark fields",
        );
      }
    }

    // 获取课程包中的最大课程顺序
    const maxOrderResult = await this.db.query.course.findFirst({
      where: eq(course.coursePackId, coursePackId),
      orderBy: [desc(course.order)],
      columns: { order: true },
    });

    const nextCourseOrder = maxOrderResult ? maxOrderResult.order + 1 : 1;

    // 确定课程标题，如果提供了自定义名称则使用，否则使用默认名称
    const courseTitle = courseName?.trim() || `导入课程 ${new Date().toLocaleDateString()}`;

    // 创建新课程
    const newCourse = await this.db
      .insert(course)
      .values({
        title: courseTitle,
        description: "从CSV文件导入的课程",
        coursePackId,
        order: nextCourseOrder,
      })
      .returning();

    // 批量插入语句
    const statements = csvData.map((item, index) => ({
      chinese: item.chinese,
      english: item.english,
      soundmark: item.soundmark,
      courseId: newCourse[0].id,
      order: index + 1,
    }));

    await this.db.insert(statement).values(statements);

    return {
      success: true,
      courseId: newCourse[0].id,
      statementsCount: statements.length,
    };
  }

  async exportCourse(userId: string, coursePackId: string, courseId: string) {
    // 验证课程包是否存在
    const coursePackExists = await this.db.query.coursePack.findFirst({
      where: eq(coursePack.id, coursePackId),
    });

    if (!coursePackExists) {
      throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
    }

    // 验证课程是否存在
    const courseExists = await this.db.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.coursePackId, coursePackId)),
      with: {
        statements: {
          orderBy: asc(statement.order),
        },
      },
    });

    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // 返回课程数据用于导出
    return {
      course: {
        id: courseExists.id,
        title: courseExists.title,
        description: courseExists.description,
      },
      statements: courseExists.statements.map((stmt) => ({
        chinese: stmt.chinese,
        english: stmt.english,
        soundmark: stmt.soundmark,
      })),
    };
  }

  async deleteCourse(userId: string, coursePackId: string, courseId: string) {
    // 首先验证课程包是否存在
    const coursePackExists = await this.db.query.coursePack.findFirst({
      where: eq(coursePack.id, coursePackId),
    });

    if (!coursePackExists) {
      throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
    }

    // 验证用户是否有权限删除课程（创建者或者是公共课程包）
    const hasPermission =
      coursePackExists.creatorId === userId || coursePackExists.shareLevel === "public";

    if (!hasPermission) {
      throw new NotFoundException(`You don't have permission to modify this course pack`);
    }

    // 验证课程是否存在
    const courseExists = await this.db.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.coursePackId, coursePackId)),
    });

    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // 获取该课程的所有语句，用于删除掌握状态
    const courseStatements = await this.db
      .select()
      .from(statement)
      .where(eq(statement.courseId, courseId));

    // 删除用户对该课程所有语句的掌握状态
    for (const stmt of courseStatements) {
      await this.db
        .delete(masteredElements)
        .where(
          and(
            eq(masteredElements.userId, userId),
            eq(masteredElements.content, JSON.stringify({ english: stmt.english })),
          ),
        );
    }

    // 删除课程相关的语句
    await this.db.delete(statement).where(eq(statement.courseId, courseId));

    // 删除课程历史记录
    await this.db
      .delete(courseHistory)
      .where(
        and(eq(courseHistory.coursePackId, coursePackId), eq(courseHistory.courseId, courseId)),
      );

    // 删除用户课程进度
    await this.db
      .delete(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.coursePackId, coursePackId),
          eq(userCourseProgress.courseId, courseId),
        ),
      );

    // 删除课程
    await this.db.delete(course).where(eq(course.id, courseId));

    return {
      success: true,
      message: "Course deleted successfully",
    };
  }

  async updateCourse(
    userId: string,
    coursePackId: string,
    courseId: string,
    updateData: { title: string; description?: string },
  ) {
    // 首先验证课程包是否存在
    const coursePackExists = await this.db.query.coursePack.findFirst({
      where: eq(coursePack.id, coursePackId),
    });

    if (!coursePackExists) {
      throw new NotFoundException(`CoursePack with ID ${coursePackId} not found`);
    }

    // 验证用户是否有权限编辑课程（创建者或者是公共课程包）
    const hasPermission =
      coursePackExists.creatorId === userId || coursePackExists.shareLevel === "public";

    if (!hasPermission) {
      throw new NotFoundException(`You don't have permission to modify this course pack`);
    }

    // 验证课程是否存在
    const courseExists = await this.db.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.coursePackId, coursePackId)),
    });

    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // 更新课程
    const updatedCourse = await this.db
      .update(course)
      .set({
        title: updateData.title,
        description: updateData.description || courseExists.description,
      })
      .where(eq(course.id, courseId))
      .returning();

    return {
      success: true,
      course: updatedCourse[0],
    };
  }
}
