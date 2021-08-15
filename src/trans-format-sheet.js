export const transFormatSheet = () => {
  SpreadsheetApp.getActiveSpreadsheet().deleteSheet(
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("翻訳")
  );

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("대량등록 양식")
    .copyTo(SpreadsheetApp.getActiveSpreadsheet())
    .setName("翻訳");

  sheet
    .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues()
    .forEach((r, i) => {
      r.forEach((c, j) => {
        if (c) {
          console.log(c);
          console.log(LanguageApp.translate(c, "ko", "ja"));
          sheet
            .getRange(i + 1, j + 1)
            .setValue(LanguageApp.translate(c, "ko", "ja"));
          Utilities.sleep(1000);
        }
      });
    });
};
