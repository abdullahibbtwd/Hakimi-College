/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admindashboard from "../admindashboard.js";
import type * as announcements from "../announcements.js";
import type * as auth from "../auth.js";
import type * as courses from "../courses.js";
import type * as departments from "../departments.js";
import type * as events from "../events.js";
import type * as exams from "../exams.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as level from "../level.js";
import type * as program from "../program.js";
import type * as results from "../results.js";
import type * as screening from "../screening.js";
import type * as screeningSlots from "../screeningSlots.js";
import type * as students from "../students.js";
import type * as teachers from "../teachers.js";
import type * as timetables from "../timetables.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admindashboard: typeof admindashboard;
  announcements: typeof announcements;
  auth: typeof auth;
  courses: typeof courses;
  departments: typeof departments;
  events: typeof events;
  exams: typeof exams;
  files: typeof files;
  http: typeof http;
  level: typeof level;
  program: typeof program;
  results: typeof results;
  screening: typeof screening;
  screeningSlots: typeof screeningSlots;
  students: typeof students;
  teachers: typeof teachers;
  timetables: typeof timetables;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
