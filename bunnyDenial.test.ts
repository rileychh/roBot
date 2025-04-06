import assert from "node:assert/strict";
import { before, test } from "node:test";
import { matchPattern, ollama } from "./bunnyDenial.ts";

test("matchPattern should correctly identify bunny denial messages", async (t) => {
  const positiveTestCases = [
    "8422",
    "不是兔",
    "84rabbit",
    "Not bunny",
    "不是22",
    "我 不是 ²²",
    "我 8 ⁴ 22！！！！",
    "8️⃣4️⃣2️⃣2️⃣",
  ];

  await t.test("should return true for valid bunny patterns", () => {
    for (const testCase of positiveTestCases) {
      assert.equal(
        matchPattern(testCase),
        true,
        `Expected "${testCase}" to be recognized as a bunny pattern`,
      );
    }
  });

  const negativeTestCases = [
    "<:bnohappy:1358035489524809810>",
    "<:bnowaaa:1358035762741776516>",
  ];

  await t.test("should return false for invalid bunny patterns", () => {
    for (const testCase of negativeTestCases) {
      assert.equal(
        matchPattern(testCase),
        false,
        `Expected "${testCase}" to NOT be recognized as a bunny pattern`,
      );
    }
  });
});

test("ollama should identify bunny denial messages", async (t) => {
  // Ensure environment variable is set
  before(() => {
    if (!process.env.OLLAMA_HOST) {
      assert.fail(
        "Environment variable OLLAMA_HOST is not set. Please set it to the Ollama API host.",
      );
    }
  });

  await t.test("should handle a basic call to the API", async () => {
    const result = await ollama("I am not a bunny");

    assert.equal(typeof result, "boolean", "Expected result to be a boolean");
  });

  const postiveTestCases = [
    "我對我的物種為兔子的言論表達否定",
    "我不覺得我是一隻22",
    "我否定我是22",
    "我不承認我是22",
    "我不認為我是兔子",
    "我的個人認同中缺少自己是兔子的成分",
    "我不屬於Leporidae的集合內",
    "我拒絕承認我是22",
    "🐰❌",
    "私はうさちゃんじゃありません",
  ];

  await t.test("should return true for bunny denial messages", async () => {
    for (const message of postiveTestCases) {
      const result = await ollama(message);
      assert.equal(
        result,
        true,
        `Expected message "${message}" to return true`,
      );
    }
  });

  const negativeTestCases = [
    "",
    "我對我的物種為兔子的言論表達肯定",
    "讀到空訊息結果是22了www",
    "🐰",
    "🐰✅",
    "🐇❤️",
    "ㄌㄨㄞㄌㄧ不是22",
    "我不喜歡22",
  ];

  await t.test(
    "should return false for non-bunny denial messages",
    async () => {
      for (const message of negativeTestCases) {
        const result = await ollama(message);
        assert.equal(
          result,
          false,
          `Expected message "${message}" to return false`,
        );
      }
    },
  );
});
