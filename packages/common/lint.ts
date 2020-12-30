import { TextlintKernel, TextlintResult } from '@textlint/kernel';
// @ts-expect-error
import textlintPluginText from '@textlint/textlint-plugin-text';
import textlintFilterRuleJaNamedEntities from 'textlint-filter-rule-ja-named-entities';
import textlintFilterRuleURLs from 'textlint-filter-rule-urls';
// @ts-expect-error
import textlintRuleDateWeekdayMismatch from 'textlint-rule-date-weekday-mismatch';
// @ts-expect-error
import textlintRuleJaHiraganaKeishikimeishi from 'textlint-rule-ja-hiragana-keishikimeishi';
// @ts-expect-error
import textlintRuleJaJoyoOrJinmeiyoKanji from 'textlint-rule-ja-joyo-or-jinmeiyo-kanji';
// @ts-expect-error
import textlintRuleJaNoInappropriateWords from 'textlint-rule-ja-no-inappropriate-words';
// @ts-expect-error
import textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-expect-error
import textlintRuleJaNoSuccessiveWord from 'textlint-rule-ja-no-successive-word';
// @ts-expect-error
import textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-expect-error
import textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-expect-error
import textlintRuleNoHankakuKana from 'textlint-rule-no-hankaku-kana';
// @ts-expect-error
import textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
// @ts-expect-error
import textlintRuleNoMixedZenkakuAndHankakuAlphabet from 'textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet';
import textlintRuleNoSynonyms from '@textlint-ja/textlint-rule-no-synonyms';
// @ts-expect-error
import textlintRulePreferTariTari from 'textlint-rule-prefer-tari-tari';
// @ts-expect-error
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';

const kernel = new TextlintKernel();

const lint = (text: string): Promise<TextlintResult> =>
  kernel.lintText(text, {
    ext: '.txt',
    filterRules: [
      {
        ruleId: 'ja-named-entities',
        rule: textlintFilterRuleJaNamedEntities,
      },
      {
        ruleId: 'urls',
        rule: textlintFilterRuleURLs,
      },
    ],
    plugins: [
      {
        pluginId: 'text',
        plugin: textlintPluginText,
      },
    ],
    rules: [
      ...Object.keys(textlintRulePresetJapanese.rules).map((key) => ({
        ruleId: key,
        rule: textlintRulePresetJapanese.rules[key],
        options: textlintRulePresetJapanese.rulesConfig[key],
      })),
      {
        ruleId: 'date-weekday-mismatch',
        rule: textlintRuleDateWeekdayMismatch,
      },
      {
        ruleId: 'ja-hiragana-keishikimeishi',
        rule: textlintRuleJaHiraganaKeishikimeishi,
      },
      {
        ruleId: 'ja-joyo-or-jinmeiyo-kanji',
        rule: textlintRuleJaJoyoOrJinmeiyoKanji,
      },
      {
        ruleId: 'ja-no-inappropriate-words',
        rule: textlintRuleJaNoInappropriateWords,
      },
      {
        ruleId: 'ja-no-redundant-expression',
        rule: textlintRuleJaNoRedundantExpression,
      },
      {
        ruleId: 'ja-no-successive-word',
        rule: textlintRuleJaNoSuccessiveWord,
      },
      {
        ruleId: 'ja-unnatural-alphabet',
        rule: textlintRuleJaUnnaturalAlphabet,
      },
      {
        ruleId: 'max-appearence-count-of-words',
        rule: textlintRuleMaxAppearenceCountOfWords,
      },
      {
        ruleId: 'no-hankaku-kana',
        rule: textlintRuleNoHankakuKana,
      },
      {
        ruleId: 'no-insert-dropping-sa',
        rule: textlintRuleNoInsertDroppingSa,
      },
      {
        ruleId: 'no-mixed-zenkaku-and-hankaku-alphabet',
        rule: textlintRuleNoMixedZenkakuAndHankakuAlphabet,
      },
      {
        ruleId: 'no-synonyms',
        rule: textlintRuleNoSynonyms,
      },
      {
        ruleId: 'prefer-tari-tari',
        rule: textlintRulePreferTariTari,
      },
    ],
  });

export default lint;
