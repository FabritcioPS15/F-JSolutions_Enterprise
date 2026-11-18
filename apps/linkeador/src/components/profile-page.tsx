import { LinksList } from '@/components/links-list'
import { ProfileHeader } from '@/components/profile-header'
import { SocialFooter } from '@/components/social-footer'
import { profileThemeVars, resolveInk } from '@/lib/theme'
import type { LinkProfile } from '@/lib/link-profiles'

export function ProfilePage({ profile }: { profile: LinkProfile }) {
  const ink = resolveInk(profile)

  return (
    <div
      data-ink={ink}
      style={profileThemeVars(profile)}
      className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden px-4 py-8 text-[var(--page-ink)] selection:bg-[var(--accent)] selection:text-white sm:py-12"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'var(--page-bg)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-glow), transparent 65%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-soft), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center">
        <ProfileHeader profile={profile} />
        <LinksList profile={profile} />
        <SocialFooter profile={profile} />
      </main>
    </div>
  )
}
