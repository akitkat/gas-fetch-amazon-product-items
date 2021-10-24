export const onOpen = (e) => {
  SpreadsheetApp.getUi()
    .createMenu('Amazon')
    .addItem("商品情報取得", "getProductItems")
    .addToUi();
};
