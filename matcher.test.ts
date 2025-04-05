import { test } from "node:test";
import assert from "node:assert";
import { containsBunny } from "./matcher.ts";

test("containsBunny", () => {
  const not = ["不是", "84", "8 ⁴", "not", "不　是"];
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
  ];

  const testcases = new Set<string>();

  for (const n of not) {
    for (const r of rabbit) {
      testcases.add(`${n} ${r}`);
      testcases.add(`${n}${r}`);
      testcases.add(`${n}　${r}`);
      testcases.add(`${n}...${r}`);
      testcases.add(`${n}⋯⋯${r}`);
      testcases.add(`${n}⋯⋯${r}`);
    }
  }

  for (const testcase of testcases) {
    assert.equal(containsBunny(testcase), true, testcase);
  }
});
