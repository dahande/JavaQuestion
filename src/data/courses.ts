import type { Course, Lesson } from '../types'
import { javaIntro } from './courses/java-intro'
import { javaOop } from './courses/java-oop'
import { javaSilver } from './courses/java-silver'

export const courses: Course[] = [javaIntro, javaOop, javaSilver]

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId)
}

export function getLesson(
  courseId: string,
  lessonId: string,
): { course: Course; lesson: Lesson } | undefined {
  const course = getCourse(courseId)
  if (!course) return undefined
  const lesson = course.lessons.find((l) => l.id === lessonId)
  if (!lesson) return undefined
  return { course, lesson }
}

/** コース内の全ステップキー（進捗率の算出に使う） */
export function courseStepKeys(course: Course): string[] {
  return course.lessons.flatMap((lesson) =>
    lesson.steps.map((step) => `${course.id}/${lesson.id}/${step.id}`),
  )
}

/** レッスン内の全ステップキー */
export function lessonStepKeys(courseId: string, lesson: Lesson): string[] {
  return lesson.steps.map((step) => `${courseId}/${lesson.id}/${step.id}`)
}
