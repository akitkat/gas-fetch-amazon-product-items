import {
  deleteTrigger,
  isStop,
  setTrigger,
  sheet11stCategoryList,
  sheetName11stCategoryList,
  sheetProductList,
  spreadSheetId
} from "./utils";

/**
 * カテゴリ大分類の選択肢生成.
 */
export const setLargeCategoryRules = () => {
  const sql11stCategoryList = SpreadSheetsSQL.open(
    spreadSheetId,
    sheetName11stCategoryList
  );

  const values = sql11stCategoryList
    .select([
      "No.",
      "大分類_name_ja",
      "中分類_name_ja",
      "小分類_name_ja",
      "細分類_name_ja",
    ])
    .filter("中分類_name_ja = - AND 小分類_name_ja = - AND 細分類_name_ja = -")
    .result()
    .map((e) => `${e["No."]}:${e["大分類_name_ja"]}`);

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values)
    .build();

  sheetProductList
    .getRange(2, 9, sheetProductList.getLastRow(), 1)
    .setDataValidation(rule);
};

/**
 * 選択肢用で使用する子カテゴリリストをあらかじめ計算しておく.
 */
export const setChildCategory = () => {
  deleteTrigger('setChildCategory');
  const startTime = new Date();
  const sql11stCategoryList = SpreadSheetsSQL.open(
    spreadSheetId,
    sheetName11stCategoryList
  );

  try {
    // 細分類がある行は「選択肢用子カテゴリ」を「-」にする.
    // 大量のデータを扱うためsqlを使用しない.
    // const rows = sheet11stCategoryList
    //   .getRange(2, 1, sheet11stCategoryList.getLastRow(), 14)
    //   .getValues()
    //   .map(e => {
    //     return [
    //       e[4] !== '-' ? '-' : ''
    //     ]
    //   })

    // // update
    // sheet11stCategoryList
    //   .getRange(2, 14, sheet11stCategoryList.getLastRow(), 1)
    //   .setValues(rows)

    // // 大分類における選択肢の中分類文字列を作成.
    // const largeCategoryList = sql11stCategoryList
    //   .select([
    //     "No.",
    //     "大分類_id",
    //     "中分類_id",
    //     "小分類_id",
    //     "細分類_id",
    //     "選択肢用子カテゴリ",
    //   ])
    //   .filter("中分類_id = - AND 小分類_id = - AND 細分類_id = - AND 選択肢用子カテゴリ = NULL")
    //   .result()

    // for (let i in largeCategoryList) {
    //   if (isStop(startTime)) {
    //     throw '実行上限時間が近いため正常終了.'
    //   }

    //   console.log('----------')
    //   console.log(`No.: ${largeCategoryList[i]['No.']}`)
    //   console.log(`大分類: ${largeCategoryList[i]['大分類_id']}`)

    //   const childCategoryStr = sql11stCategoryList
    //     .select([
    //       "No.",
    //       "大分類_id",
    //       "中分類_id",
    //       "小分類_id",
    //       "細分類_id",
    //       "中分類_name_ja",
    //     ])
    //     .filter(
    //       `大分類_id = ${largeCategoryList[i]["大分類_id"]} AND 小分類_id = - AND 細分類_id = -`
    //     )
    //     .result()
    //     .filter((e) => e["中分類_id"] !== "-")
    //     .map((e) => `${e["No."]}:${e["中分類_name_ja"]}`)
    //     .join(",");

    //   console.log(`選択肢用子カテゴリ: ${childCategoryStr}`)

    //   sql11stCategoryList.updateRows(
    //     {
    //       "選択肢用子カテゴリ": childCategoryStr,
    //     },
    //     `No. = ${largeCategoryList[i]["No."]}`
    //   );
    // }

    // // 中分類における選択肢の小分類文字列を作成.
    // const middleCategoryList = sql11stCategoryList
    //   .select([
    //     "No.",
    //     "中分類_id",
    //     "小分類_id",
    //     "細分類_id",
    //     "選択肢用子カテゴリ",
    //   ])
    //   .filter("小分類_id = - AND 細分類_id = - AND 選択肢用子カテゴリ = NULL")
    //   .result()

    // for (let i in middleCategoryList) {
    //   if (isStop(startTime)) {
    //     throw '実行上限時間が近いため正常終了.'
    //   }

    //   console.log('----------')
    //   console.log(`No.: ${middleCategoryList[i]['No.']}`)
    //   console.log(`中分類: ${middleCategoryList[i]['中分類_id']}`)

    //   const childCategoryStr = sql11stCategoryList
    //     .select([
    //       "No.",
    //       "中分類_id",
    //       "小分類_id",
    //       "細分類_id",
    //       "小分類_name_ja",
    //     ])
    //     .filter(
    //       `中分類_id = ${middleCategoryList[i]["中分類_id"]} AND 細分類_id = -`
    //     )
    //     .result()
    //     .filter((e) => e["小分類_id"] !== "-")
    //     .map((e) => `${e["No."]}:${e["小分類_name_ja"]}`)
    //     .join(",");

    //   console.log(`選択肢用子カテゴリ: ${childCategoryStr}`)

    //   sql11stCategoryList.updateRows(
    //     {
    //       "選択肢用子カテゴリ": childCategoryStr,
    //     },
    //     `No. = ${middleCategoryList[i]["No."]}`
    //   );
    // }

    // 小分類における選択肢の細分類文字列を作成.
    const smafllCategoryList = sql11stCategoryList
      .select([
        "No.",
        "小分類_id",
        "細分類_id",
        "選択肢用子カテゴリ",
      ])
      .filter("小分類_id != - AND 細分類_id = - AND 選択肢用子カテゴリ = NULL")
      .result()

    for (let i in smallCategoryList) {
      if (isStop(startTime)) {
        throw '実行上限時間が近いため正常終了.'
      }

      console.log('----------')
      console.log(`No.: ${smallCategoryList[i]['No.']}`)
      console.log(`小分類: ${smallCategoryList[i]['小分類_id']}`)

      let childCategoryStr = sql11stCategoryList
        .select([
          "No.",
          "小分類_id",
          "細分類_id",
          "細分類_name_ja",
        ])
        .filter(
          `小分類_id = ${smallCategoryList[i]["小分類_id"]}`
        )
        .result()
        .filter((e) => e["細分類_id"] !== "-")
        .map((e) => `${e["No."]}:${e["細分類_name_ja"]}`)
        .join(",");

      console.log(`選択肢用子カテゴリ: ${childCategoryStr}`)

      sql11stCategoryList.updateRows(
        {
          "選択肢用子カテゴリ": childCategoryStr,
        },
        `No. = ${smallCategoryList[i]["No."]}`
      );
    }
  } catch (e) {
    // 未処理件数があるためトリガーセット．
    console.error(e)
    setTrigger('setChildCategory')
  }
};
