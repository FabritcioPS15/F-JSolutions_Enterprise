import { ProfileHeader } from '@/components/profile-header'
import { LinksList } from '@/components/links-list'
import { SocialFooter } from '@/components/social-footer'

export default function LinksPage() {
  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-between px-4 py-8 sm:py-12 selection:bg-[#5B21B6] selection:text-white overflow-x-hidden">
      {/* Background glow effects */}
      <div
        className="pointer-events-none fixed -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(91,33,182,0.25),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />

      {/* Main Column (Max width mobile friendly) */}
      <main className="w-full max-w-md flex-1 flex flex-col items-center">
        <ProfileHeader />
        <LinksList />
        <SocialFooter />
      </main>
    </div>
  )
}
