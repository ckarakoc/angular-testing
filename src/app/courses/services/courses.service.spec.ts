import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { find } from "rxjs/operators";

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe(courses => {
      expect(courses)
        .withContext('No courses returned')
        .toBeTruthy();
      expect(courses.length)
        .withContext('Wrong number of courses returned')
        .toBe(12);

      const course = courses.find(c => c.id === 12);

      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({ payload: Object.values(COURSES) });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);
  });

  it('should save a course', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }

    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
      expect(course.titles.description).toBe('Testing Course');
    });

    const req = httpTestingController
      .expectOne('/api/courses/12');
    expect(req.request.method)
      .toEqual('PUT');
    expect(req.request.body.titles.description)
      .toEqual(changes.titles.description);

    req.flush({ ...COURSES[12], ...changes });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }
    coursesService.saveCourse(12, changes).subscribe(() => fail('should not succeed'), (error: HttpErrorResponse) => {
      expect(error.status).toBe(500);
    });

    const req = httpTestingController
      .expectOne('/api/courses/12');
    expect(req.request.method)
      .toEqual('PUT');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should find lessons', () => {
    coursesService.findLessons(12).subscribe(lessons => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
  });

  afterEach(() => {
    httpTestingController.verify();
  });


});
