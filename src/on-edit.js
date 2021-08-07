import { setMiddleCategoryRule, setSmallCategoryRule } from "./category";

import { sheetProductList } from "./utils";

export const onEdit11stCategoryLarge = (e) => {
  // 当該行のJ-L列を削除
  sheetProductList.getRange(e.range.getRow(), 10, e.range.getRow(), 3).clear();

  // J列のカテゴリの選択肢を設定.
  setMiddleCategoryRule(e.range.getValue(), e.range.getRow())
};

export const onEdit11stCategoryMiddle = (e) => {
  // 当該行のK-L列を削除
  sheetProductList.getRange(e.range.getRow(), 11, e.range.getRow(), 2).clear();

  // K列のカテゴリの選択肢を設定.
  setSmallCategoryRule(e.range.getValue(), e.range.getRow())
};

export const onEdit11stCategorySmall = (e) => {
  // 当該行のK-L列を削除
  sheetProductList.getRange(e.range.getRow(), 12).clear();
};
