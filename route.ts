/**
 * an Arrray of routes that are accessible to the public
 * these route doesnt reqquuire authentication
 * @type {string[]}
 */

export const publicRoutes =[
    "/",
    "/new-verification"

]

/**
 * an Arrray of routes that are used for authentication
 * these route will redirect user logged in users to /setting
 * @type {string[]}
 */
export const authRoutes =[
    "/auth/login",
    // "/register",
    // "/error",
    // "/reset",
    // "/new-password"
]

/**
 * the prefix for API authentication routes
 * routes that start  with this are use for PII authentucation purpose
 * @type {string}
 */

export const apiAuthPrefix = "/api/login"
export const apiAuthPrefix1 = "/api/register" 
export const publicApiRoute = "/api/public/product"
export const adminRoute = '/admin'
export const studentRoute = '/student'
export const teacherRoute = '/teacher'
export const applicant = "/application"


/**
 *the default redirect
 *  @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/"