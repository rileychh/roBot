const matcher = /(?:不是|84|not)[\s.⋯]*(?:[兔ㄊ2二🐰🐇]+|(\(2\)){2,}|two|bunny|rabbit)/u;

export function containsBunny(message: string) {
  const normalizedMessage = message.normalize("NFKC");
  const standardizedMessage = normalizedMessage.replace(/[()\s]/g, "");

  return matcher.test(standardizedMessage);
}
