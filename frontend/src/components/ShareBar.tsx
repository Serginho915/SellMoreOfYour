import { SocialIcon } from './SocialIcon';

export function ShareBar({ title, url }: { title: string; url: string }) {
  const absoluteUrl = typeof window !== 'undefined' ? new URL(url, window.location.origin).href : url;
  const shareText = `${title} ${absoluteUrl}`;
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedShareText = encodeURIComponent(shareText);
  const targets = [
    { label: 'X', icon: 'x' as const, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'Threads', icon: 'threads' as const, href: `https://www.threads.net/intent/post?text=${encodedShareText}` },
    { label: 'Telegram', icon: 'telegram' as const, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'LinkedIn', icon: 'linkedin' as const, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  return (
    <aside className="share-bar" aria-label="Share this post">
      <span className="share-label">Share this post</span>
      <div className="share-actions">
        {targets.map((target) => (
          <a key={target.label} className="share-link" href={target.href} target="_blank" rel="noreferrer" aria-label={`Share on ${target.label}`}>
            <SocialIcon name={target.icon} />
            <span>{target.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
