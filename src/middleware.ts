import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth',
  },
})

export const config = {
  matcher: [
    '/routing/:path*',
    '/intake/:path*',
    '/results/:path*',
    '/oath/:path*',
    '/dashboard/:path*',
    '/decisions/:path*',
    '/decision/:path*',
    '/vault/:path*',
    '/settings/:path*',
  ],
}
