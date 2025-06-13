// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { ConvexHttpClient } from 'convex/browser';
// import { api } from './convex/_generated/api';

// const isProtectedRoute = createRouteMatcher([
//   '/admin(.*)',
//   '/teacher(.*)',
//   '/student(.*)',
//   '/dashboard(.*)',
//   '/application(.*)',
//   '/progress(.*)',
//   '/rejection(.*)',
// ]);

// export default clerkMiddleware(async (clerkAuth, req) => {
//   if (!isProtectedRoute(req)) return;

//   const { userId } = clerkAuth();
//   if (!userId) {
//     return (await clerkAuth()).redirectToSignIn();
//   }

//   try {
//     // Create Convex HTTP client
//     const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
//     // Fetch user role and status from Convex
//     const userData = await convex.query(api.users.getRoleAndStatus);
    
//     if (!userData) {
//       return new Response(null, { status: 403, headers: { 'Location': '/unauthorized' } });
//     }

//     const { role, studentStatus } = userData;
//     const path = req.nextUrl.pathname;

//     // Role-based path protection
//     if (path.startsWith('/admin') && role !== 'admin') {
//       return new Response(null, { status: 403, headers: { 'Location': '/unauthorized' } });
//     }

//     if (path.startsWith('/teacher') && role !== 'teacher' && role !== 'admin') {
//       return new Response(null, { status: 403, headers: { 'Location': '/unauthorized' } });
//     }

//     // Student path with status checks
//     if (path.startsWith('/student')) {
//       const allowedRoles = ['student', 'admin', 'teacher'];
//       if (!allowedRoles.includes(role) || studentStatus !== 'admitted') {
//         return new Response(null, { status: 403, headers: { 'Location': '/unauthorized' } });
//       }
//     }

//     // Application status redirections
//     if (role === 'student') {
//       if (studentStatus === 'progress' && !path.startsWith('/progress')) {
//         return Response.redirect(new URL('/progress', req.url));
//       }
//       if (studentStatus === 'rejected' && !path.startsWith('/rejection')) {
//         return Response.redirect(new URL('/rejection', req.url));
//       }
//       if (studentStatus === 'admitted' && !path.startsWith('/student')) {
//         return Response.redirect(new URL('/student', req.url));
//       }
//       if ((!studentStatus || studentStatus === 'not_started') && !path.startsWith('/application')) {
//         return Response.redirect(new URL('/application', req.url));
//       }
//     }

//   } catch (error) {
//     console.error("Middleware error:", error);
//     return new Response(null, { status: 500, headers: { 'Location': '/error' } });
//   }
// });

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)',
//     '/(api|trpc)(.*)',
//   ],
// };
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api';

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/teacher(.*)',
  '/student(.*)',
  '/dashboard(.*)',
  '/application(.*)',
  '/progress(.*)',
  '/rejection(.*)',
]);

export default clerkMiddleware(async (clerkAuth, req) => {
  if (!isProtectedRoute(req)) return;

  // Await the clerkAuth promise to get the auth object
  const auth = await clerkAuth();
  
  const { userId } = auth;
  if (!userId) {
    return auth.redirectToSignIn();
  }

  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const userData = await convex.query(api.users.getRoleAndStatus);
    
    if (!userData) {
      return new Response(null, { status: 403, headers: { Location: '/unauthorized' } });
    }

    const { role, studentStatus } = userData;
    const path = req.nextUrl.pathname;

    // Admin route protection
    if (path.startsWith('/admin') && role !== 'admin') {
      return new Response(null, { status: 403, headers: { Location: '/unauthorized' } });
    }

    // Teacher route protection
    if (path.startsWith('/teacher') && !['teacher'].includes(role)) {
      return new Response(null, { status: 403, headers: { Location: '/unauthorized' } });
    }

    // Student route protection
    if (path.startsWith('/student') && 
        (!['student'].includes(role) || studentStatus !== 'admitted')) {
      return new Response(null, { status: 403, headers: { Location: '/unauthorized' } });
    }

    // Student status redirects
    if (role === 'student') {
      if (studentStatus === 'progress' && !path.startsWith('/progress')) {
        return Response.redirect(new URL('/progress', req.url));
      }
      if (studentStatus === 'rejected' && !path.startsWith('/rejection')) {
        return Response.redirect(new URL('/rejection', req.url));
      }
      if (studentStatus === 'admitted' && !path.startsWith('/student')) {
        return Response.redirect(new URL('/student', req.url));
      }
      if ((!studentStatus || studentStatus === 'not_started') && !path.startsWith('/application')) {
        return Response.redirect(new URL('/application', req.url));
      }
    }

  } catch (error) {
    console.error("Middleware error:", error);
    return new Response(null, { status: 500, headers: { Location: '/error' } });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)',
    '/(api|trpc)(.*)',
  ],
};