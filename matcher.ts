const matcher =
  /(?:[不8][是4]|not)(?:一隻|a)?(?:[兔ㄊ2二🐰🐇]+|(\(2\)){2,}|two|bunny|rabbit)/u;

export function containsBunny(message: string) {
  const normalizedMessage = message.normalize("NFKC");
  const standardizedMessage = normalizedMessage.replace(/[()\s.,⋯！!]/gu, "");

  return matcher.test(standardizedMessage);
}
