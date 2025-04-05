import emoji from "emoji-toolkit";

export function matchPattern(content: string): boolean {
  return !!content
    .normalize("NFKD")
    .replace(/([0-9])\u{FE0F}\u{20E3}/gu, "$1") // Normalize Keycap Digits
    .replace(/(?:[\s()]|<.*>)/g, "") // Remove spaces, mentions and emojis
    .match(
      /(?:[⛔🚫❌🙅]+|[不八8⓼➑][是四4⓸➍]|not)(?:一隻|a)?(?:[兔ㄊ二2⓶➋🐰🐇]+|two|bunny|rabbit)/iu,
    );
}

export async function ollama(message: string): Promise<boolean> {
  const normalizedMessage = message
    .normalize("NFKD")
    .replace(/([0-9])\u{FE0F}\u{20E3}/gu, "$1") // Normalize Keycap Digits
    .replace(/(?:<.*>)/g, ""); // Remove mentions and emojis

  const transformedMessage = emoji.toShort(normalizedMessage);

  if (transformedMessage === "") {
    return false;
  }

  const prompt = `\
You are analyzing a message to determine if it contains a statement where someone is denying that they are a bunny (rabbit).

IMPORTANT CONTEXT:
- In Chinese internet slang, "22" can refer to a rabbit/bunny
- "Leporidae" is the scientific family that includes rabbits and hares
- The denial might be expressed in various languages, especially Chinese
- Valid denials include rejecting being a rabbit, bunny, 22, or member of Leporidae

SOME CLEAR DENIAL EXAMPLES (should return true):
- "我對我的物種為兔子的言論表達否定" (I express denial about statements regarding my species being a rabbit)
- "我不覺得我是一隻22" (I don't feel I am a "22")
- "我否定我是22" (I deny I am "22")
- "我不承認我是22" (I don't admit I am "22")
- "我不認為我是兔子" (I don't think I am a rabbit)
- "我的個人認同中缺少自己是兔子的成分" (My personal identity lacks the component of being a rabbit)
- "我不屬於Leporidae的集合內" (I don't belong in the Leporidae set)
- ":rabbit::x:" (Rabbit emoji followed by an X)

SOME NOT CLEAR DENIAL EXAMPLES (should return false):
- "" (empty message)
- "讀到空訊息結果是22了www" (Reading an empty message resulted in "22" lol)
- ":rabbit:" (Rabbit emoji)
- ":rabbit::white_check_mark:" (Rabbit emoji followed by a check mark)
- Messages where rabbit/bunny references are unclear or metaphorical

Return true if highly confident of a denial, otherwise return false.`;

  try {
    const response = await fetch(
      `https://${process.env.OLLAMA_HOST}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:4b",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: transformedMessage,
            },
          ],
          prompt,
          stream: false,
          format: {
            type: "boolean",
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();

    return result.message.content.trim() === "true";
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    return false;
  }
}
