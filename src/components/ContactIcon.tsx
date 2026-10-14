interface ContactIconProps {
  kind: 'phone' | 'whatsapp'
}

export function ContactIcon({ kind }: ContactIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {kind === 'phone' ? (
        <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 20.7l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="m8.3 7.5 1.2 2-1 1.1c.8 1.8 2.1 3.1 3.9 3.9l1.1-1 2 1.2c.3.2.4.5.2.8-.5 1-1.3 1.4-2.3 1.1-3.8-1-6.5-3.7-7.4-7.3-.2-1 .3-1.8 1.4-2.1.4-.1.7 0 .9.3Z" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
