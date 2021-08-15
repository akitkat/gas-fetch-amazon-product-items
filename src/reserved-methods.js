
export const onOpen = (e) => {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem("商品情報取得", "getProductItems")
    // .addItem("フォーマットシート翻訳", "transFormatSheet")
    .addToUi();
};
