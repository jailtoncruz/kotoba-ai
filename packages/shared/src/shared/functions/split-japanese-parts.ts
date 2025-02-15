import { LessonScriptLine } from '../../core/interfaces/lesson-script-line';

export function splitTextByJapanese(input: string): LessonScriptLine[] {
  // Regular expression to match Japanese characters (Hiragana, Katakana, Kanji)
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g;

  // Split the input text by Japanese segments
  const segments: LessonScriptLine[] = [];
  let lastIndex = 0;
  let sequence = 1;

  let match;
  while ((match = japaneseRegex.exec(input)) !== null) {
    // Add the non-Japanese text before the match
    if (match.index > lastIndex) {
      segments.push({
        sequence: sequence++,
        text: input.slice(lastIndex, match.index).trim(),
        languageCode: 'en-US',
      });
    }

    // Add the Japanese text
    segments.push({
      sequence: sequence++,
      text: match[0],
      languageCode: 'ja-JP',
    });

    // Update the last index
    lastIndex = match.index + match[0].length;
  }

  // Add the remaining non-Japanese text after the last match
  if (lastIndex < input.length) {
    segments.push({
      sequence: sequence++,
      text: input.slice(lastIndex).trim(),
      languageCode: 'en-US',
    });
  }

  return segments;
}
