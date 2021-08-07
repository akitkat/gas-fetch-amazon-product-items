/*
 * 日本円とウォンのレートを取得する.
 */
export const getRateJpyToKrw_ = () => {
  try {
    const url = "https://api.aoikujira.com/kawase/json/jpy";
    const json = UrlFetchApp.fetch(url).getContentText();
    const data = JSON.parse(json);
    return data["KRW"];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/*
 * 配列をchunkする.
 */
export const chunk_ = (arr, size) => {
  return arr.reduce(
    (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
    []
  );
};

export const uniq = (array) => {
  return [...new Set(array)];
}

/**
 * トリガーを削除する.
 */
export const deleteTrigger = (functionName) => {
  const triggers = ScriptApp.getProjectTriggers()
  for (let i in triggers) {
    if (triggers[i].getHandlerFunction() == functionName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

/**
 * スクリプト終了有無を判定する.
 */
export const isStop = (startTime) => {
  const currentTime = new Date();
  //5分を超えたらGASの自動停止を回避するべく終了処理に移行する.
  return 5 <= (currentTime.getTime() - startTime.getTime()) / (1000 * 60)
}

/**
 * 1分後に指定関数のトリガーを設定する.
 */
export const setTrigger = (functionName) => {
  ScriptApp
    .newTrigger(functionName)
    .timeBased()
    .after(60 * 1000)
    .create()
}

export const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
export const spreadSheetId = spreadSheet.getId()

// sheet name
export const sheetNameProductItemList = "Amazon商品リスト";
export const sheetName11stCategoryList = '11stカテゴリ管理'

// sheet object
export const sheetProductList = spreadSheet.getSheetByName(
  sheetNameProductItemList
);
