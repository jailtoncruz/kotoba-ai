// utils/romajiConverter.ts
const hiraganaToRomajiMap: { [key: string]: string } = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "wo", ん: "n",

  // Dakuten variations
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",

  // Handakuten variations
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",

  // Double character variations
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
};

export function convertToRomaji(hiragana: string): string {
  let romaji = "";
  for (let i = 0; i < hiragana.length; i++) {
    const doubleChar = hiragana[i] + (hiragana[i + 1] || "");

    // Check for a double-character match
    if (hiraganaToRomajiMap[doubleChar]) {
      romaji += hiraganaToRomajiMap[doubleChar];
      i++; // Skip the next character
    } else if (hiraganaToRomajiMap[hiragana[i]]) {
      // Otherwise, check for a single-character match
      romaji += hiraganaToRomajiMap[hiragana[i]];
    } else {
      // If no match, add the original character (for non-hiragana characters)
      romaji += hiragana[i];
    }
  }
  return romaji;
}