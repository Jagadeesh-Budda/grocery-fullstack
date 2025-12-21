/**
 * Parse a spoken grocery command into structured data.
 * Example: "add 2 kg onions" -> { action: 'add', name: 'onions', quantity: 2, unit: 'kg', raw: 'add 2 kg onions' }
 *
 * Does not perform any network / UI logic.
 */
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000
};

const UNIT_MAP = {
  kg: "kg", kilo: "kg", kilos: "kg", kilogram: "kg", kilograms: "kg",
  g: "g", gram: "g", grams: "g",
  l: "l", litre: "l", liter: "l", litres: "l", liters: "l",
  ml: "ml", pack: "pack", packs: "pack", bunch: "bunch", dozen: "dozen",
  piece: "piece", pieces: "piece", pc: "piece", pcs: "piece"
};

function wordsToNumber(text) {
  text = text.replace(/-/g, " ").toLowerCase().trim();
  if (!text) return null;
  if (text === "a" || text === "an") return 1;
  // handle "a dozen"
  if (text === "dozen") return 12;

  const parts = text.split(/\s+/);
  let total = 0;
  let current = 0;
  for (let p of parts) {
    if (NUMBER_WORDS.hasOwnProperty(p)) {
      const val = NUMBER_WORDS[p];
      if (val === 100 || val === 1000) {
        current = (current || 1) * val;
      } else {
        current += val;
      }
    } else if (p === "dozen") {
      current = (current || 1) * 12;
    } else if (p === "half") {
      current += 0.5;
    } else {
      // unknown word
      return null;
    }
  }
  total += current;
  return total || null;
}

function normalizeUnit(u) {
  if (!u) return null;
  u = u.toLowerCase().replace(/\.$/, "");
  return UNIT_MAP[u] || null;
}

export function parseVoiceCommand(input = "") {
  const raw = String(input || "").trim();
  const text = raw.toLowerCase();

  // detect action
  let action = null;
  if (/\b(add|put|insert|create|buy)\b/.test(text)) action = "add";
  else if (/\b(remove|delete|remove from|delete from|discard)\b/.test(text)) action = "remove";
  else if (/\b(update|set)\b/.test(text)) action = "update";
  else action = "add"; // default

  // try numeric pattern first: "add 2 kg onions" or "add 1.5 kg milk"
  const numPattern = /(?:\b(?:add|put|insert|create|buy|remove|delete|update|set)\b\s*)?([0-9]+(?:[.,][0-9]+)?)\s*(kg|kilo|kilos|kilogram|kilograms|g|gram|grams|l|litre|liter|ml|dozen|pack|packs|bunch|piece|pc|pcs)?(?:\s+(?:of\s+)?)?(.*)/i;
  let m = text.match(numPattern);
  if (m) {
    const rawNum = m[1].replace(",", ".");
    const quantity = parseFloat(rawNum);
    const unit = normalizeUnit(m[2]);
    const name = (m[3] || "").trim();
    return { action, name: name || null, quantity: Number.isFinite(quantity) ? quantity : null, unit, raw };
  }

  // try number-words pattern: "add two kilos of onions" or "add a dozen eggs"
  const wordsPattern = /(?:\b(?:add|put|insert|create|buy|remove|delete|update|set)\b\s*)?([a-z\s-]+?)\s*(kg|kilo|kilos|kilogram|kilograms|g|gram|grams|l|litre|liter|ml|dozen|pack|packs|bunch|piece|pc|pcs)?(?:\s+(?:of\s+)?)?(.*)/i;
  m = text.match(wordsPattern);
  if (m) {
    const numWordPart = (m[1] || "").trim();
    const possibleUnit = m[2];
    const rest = (m[3] || "").trim();
    const parsedNumber = wordsToNumber(numWordPart);
    if (parsedNumber != null) {
      const unit = normalizeUnit(possibleUnit);
      const name = rest || null;
      // "two apples" may be parsed as number+name if rest empty and numWordPart contains both (e.g. "two apples")
      if (!name) {
        // attempt to split num words from trailing noun (e.g. "two apples")
        const split = numWordPart.split(/\s+/);
        // find first token that is not a number word
        let i = 0;
        for (; i < split.length; i++) {
          const token = split[i];
          if (!NUMBER_WORDS[token] && token !== "dozen" && token !== "half" && token !== "-" && token !== "and" && token !== "a" && token !== "an") break;
        }
        if (i < split.length) {
          const qtyWords = split.slice(0, i).join(" ");
          const nameWords = split.slice(i).join(" ");
          const q = wordsToNumber(qtyWords);
          if (q != null) {
            return { action, name: nameWords || null, quantity: q, unit, raw };
          }
        }
      }
      return { action, name: name || null, quantity: parsedNumber, unit, raw };
    }
  }

  // fallback: try extract unit anywhere and treat remaining as name
  const unitRegex = new RegExp("\\b(" + Object.keys(UNIT_MAP).join("|") + ")\\b", "i");
  const unitMatch = text.match(unitRegex);
  let unit = unitMatch ? normalizeUnit(unitMatch[1]) : null;
  // remove common action words and "of"
  const nameGuess = text.replace(/\b(add|put|insert|create|buy|remove|delete|update|set|of|please)\b/gi, "").replace(/\b(that|the|a|an)\b/gi, "").replace(/\s+/g, " ").trim();
  return { action, name: nameGuess || null, quantity: null, unit, raw };
}

export default parseVoiceCommand;