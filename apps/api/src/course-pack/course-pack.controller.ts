import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";

import { AuthGuard, UncheckAuth } from "../guards/auth.guard";
import { User, UserEntity } from "../user/user.decorators";
import { CoursePackService } from "./course-pack.service";

@Controller("course-pack")
export class CoursePackController {
  constructor(private readonly coursePackService: CoursePackService) {}

  @Get("health")
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      routes: "course CRUD endpoints available",
    };
  }

  @UncheckAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User() user: UserEntity) {
    return await this.coursePackService.findAll(user.userId);
  }

  @UncheckAuth()
  @UseGuards(AuthGuard)
  @Get(":coursePackId")
  async findOne(@User() user: UserEntity, @Param("coursePackId") coursePackId: string) {
    return await this.coursePackService.findOneWithCourses(user.userId, coursePackId);
  }

  @UncheckAuth()
  @UseGuards(AuthGuard)
  @Get(":coursePackId/courses/:courseId")
  findCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.coursePackService.findCourse(user.userId, coursePackId, courseId);
  }

  @UncheckAuth()
  @UseGuards(AuthGuard)
  @Get(":coursePackId/courses/:courseId/next")
  findNextCourse(@Param("coursePackId") coursePackId: string, @Param("courseId") courseId: string) {
    return this.coursePackService.findNextCourse(coursePackId, courseId);
  }

  @UseGuards(AuthGuard)
  @Post(":coursePackId/courses/:courseId/complete")
  CompleteCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.coursePackService.completeCourse(user.userId, coursePackId, courseId);
  }

  @UseGuards(AuthGuard)
  @Post(":coursePackId/import")
  async importCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Body()
    body: {
      csvData: Array<{ chinese: string; english: string; soundmark: string }>;
      courseName?: string;
    },
  ) {
    return this.coursePackService.importCourseFromCsv(
      user.userId,
      coursePackId,
      body.csvData,
      body.courseName,
    );
  }

  @UseGuards(AuthGuard)
  @Get(":coursePackId/courses/:courseId/export")
  async exportCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.coursePackService.exportCourse(user.userId, coursePackId, courseId);
  }

  @UseGuards(AuthGuard)
  @Delete(":coursePackId/courses/:courseId")
  async deleteCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.coursePackService.deleteCourse(user.userId, coursePackId, courseId);
  }

  @UseGuards(AuthGuard)
  @Put(":coursePackId/courses/:courseId")
  async updateCourse(
    @User() user: UserEntity,
    @Param("coursePackId") coursePackId: string,
    @Param("courseId") courseId: string,
    @Body() body: { title: string; description?: string },
  ) {
    console.log(
      `Updating course: coursePackId=${coursePackId}, courseId=${courseId}, userId=${user.userId}`,
    );
    console.log("Update data:", body);
    return this.coursePackService.updateCourse(user.userId, coursePackId, courseId, body);
  }
}
