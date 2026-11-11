/**
 * Defensive clean-up for CMS HTML before it is rendered.
 * WordPress content is authored by trusted editors, but this removes the most
 * dangerous constructs (scripts, inline handlers, javascript: URLs, iframes from
 * unknown hosts). For stricter policies, swap in `sanitize-html` here.
 */
const ALLOWED_IFRAME_HOSTS = ["www.youtube-nocookie.com", "www.youtube.com", "player.vimeo.com"];

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/<iframe[^>]*src=("|')([^"']+)\1[^>]*>[\s\S]*?<\/iframe>/gi, (match, _q, src: string) => {
      try {
        return ALLOWED_IFRAME_HOSTS.includes(new URL(src).hostname) ? match : "";
      } catch {
        return "";
      }
    });
}

/** Strip all tags — for excerpts and meta descriptions. */
export function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
