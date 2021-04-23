import assert from "assert";
import { Stroke, normalize, normalizeUrlSafe, stenoToBuffer } from "../steno.js";

describe("steno", function () {
  describe("#normalize()", function () {
    it("should normalize simple steno", () => {
      assert.equal("STPH-", normalize("STPH-"));
    });
    it("should normalize implications", () => {
      const tests = new Map(
        // Expected, given
        [
          ["STPH-", "STPH"],
          ["R-R", "RR"],
          ["STPRAPBLG", "SFRAJ"],
          ["STKPW-", "Z"],
          ["-Z", "-Z"],
        ]
      );
      tests.forEach((given, expected) =>
        assert.equal(expected, normalize(given))
      );
    });
    it("should handle multi-chord strokes", () => {
      const tests = new Map(
        // Expected, given
        [
          ["STP-/H-", "STP H"],
          ["STP-/H-", "STP/H"],
          ["TH-/S-/STOEUPB", "TH S STOIN"],
          ["TKPWRAET", "TKPWRAET "],
        ]
      );
      tests.forEach((given, expected) =>
        assert.equal(expected, normalize(given))
      );
    });
    it("should ignore invalid steno", () => {
      const tests = new Map(
        // Expected, given
        [["S-/T-/P-", "S/FSR/T/P"]]
      );
      tests.forEach((given, expected) =>
        assert.equal(expected, normalize(given))
      );
    });
    it("should work with long vowels", () => {
      const tests = new Map(
        // Expected, given
        [
          ["AOEU", "II"],
          ["AO", "OO"],
          ["AOU", "UU"],
          ["AOE", "EE"],
          ["AEU", "AA"],
        ]
      );
      tests.forEach((given, expected) =>
        assert.equal(expected, normalize(given))
      );
    });
  });
  describe("#normalizeUrlSafe()", function () {
    it("should not replace some special characters", () => {
      assert.equal("numSTstar_TED", normalizeUrlSafe("12*/TED"));
    });
    it("should work with multistroke", () => {
      assert.equal("WOEFL_WORBG_PWOT", normalizeUrlSafe("WOEFL/WORK/BOT"));
    });
  });
  describe("Stroke", () => {
    describe("#toBuffer()", () => {
      it("should make a Buffer with a length", () => {
        const test = new Stroke("STPH-");
        const buffer = test.toBuffer();
        assert.ok(buffer.length > 100);
      });
    });
  });
  describe("stenoToBuffer", () => {
    it("should work", () => {
      assert.ok(stenoToBuffer("TKPWRAET/WORK/GANG").length > 300);
    });
  });
});
