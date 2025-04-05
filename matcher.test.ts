import assert from "node:assert";
import { test } from "node:test";
import { containsBunny } from "./matcher.ts";

test("containsBunny", () => {
  const not = ["不是", "不！是！", "84", "8 ⁴", "not", "不　是", "8是", "不4"];
  const article = ["一隻", "a"];
  const rabbit = [
    "22",
    "兔子",
    "𝟮𝟤",
    "②②",
    "⑵⑵",
    "𝟐𝟐",
    "𝟸𝟸",
    "two",
    "bunny",
    "rabbit",
    "二二",
    "🐰",
    "🐇",
  ];

  const testcases = new Set<string>();

  for (const n of not) {
    for (const a of article) {
      for (const r of rabbit) {
        testcases.add(`${n} ${a} ${r}`);
        testcases.add(`${n}${a}${r}`);
        testcases.add(`${n}　${a}　${r}`);
        testcases.add(`${n}...${a}...${r}`);
        testcases.add(`${n}⋯⋯${r}`);
        testcases.add(`${n}⋯⋯${a}⋯⋯${r}`);
      }
    }
  }

  for (const testcase of testcases) {
    assert.equal(containsBunny(testcase), true, testcase);
  }
});
