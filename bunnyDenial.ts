export function matchPattern(content: string): boolean {
  return !!content
    .normalize("NFKD")
    .replace(/([0-9])\u{FE0F}\u{20E3}/gu, "$1") // Normalize Keycap Digits
    .replace(/(?:[\s()]|<.*>)/g, "") // Remove spaces, mentions and emojis
    .match(
      /(?:[⛔🚫❌🙅]+|[不八8⓼➑][是四4⓸➍]|not)(?:一隻|a)?(?:[兔ㄊ二2⓶➋🐰🐇]+|two|bunny|rabbit)/iu,
    );
}

