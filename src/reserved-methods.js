import {
  onEdit11stCategoryLarge,
  onEdit11stCategoryMiddle,
  onEdit11stCategorySmall,
} from "./on-edit";

export const onOpen = (e) => {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem("商品情報取得", "getProductItems")
    .addItem("選択肢用子カテゴリ生成", "setChildCategory")
    .addToUi();
};

export const onEdit = (e) => {
  switch (true) {
    case e.source.getSheetName() === "Amazon商品リスト" &&
      1 < e.range.getRow() && // 2行目以降
      e.range.getColumn() === 9: // I列
      onEdit11stCategoryLarge(e);
      break;
    case e.source.getSheetName() === "Amazon商品リスト" &&
      1 < e.range.getRow() && // 2行目以降
      e.range.getColumn() === 10: // J列
      onEdit11stCategoryMiddle(e);
      break;
    case e.source.getSheetName() === "Amazon商品リスト" &&
      1 < e.range.getRow() && // 2行目以降
      e.range.getColumn() === 11: // K列
      onEdit11stCategorySmall(e);
      break;
  }
};
