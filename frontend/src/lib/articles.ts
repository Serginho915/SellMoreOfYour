import type { Article, Post } from '../domain';

const covers = ['/covers/cover1.png', '/covers/cover2.png', '/covers/cover3.png', '/covers/cover4.png'];

function pickCover(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return covers[hash % covers.length];
}

export function toArticle(post: Post, index = 0): Article {
  const tag = post.tags[0] || (post.source === 'ai' ? 'Sales Psychology' : 'Selling');

  return {
    ...post,
    cover: pickCover(post.slug || post.title),
    category: tag.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    readingTime: Math.max(5, Math.ceil(post.contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length / 180)),
    views: 2400 + index * 420,
  };
}
