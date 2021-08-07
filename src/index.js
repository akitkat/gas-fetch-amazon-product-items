import { onEdit, onOpen } from "./reserved-methods";
import { setChildCategory, setRule11stCategoryCells } from "./category";

import { getProductItems } from "./product";

// global.onEdit = (e) => onEdit(e);
global.onOpen = (e) => onOpen(e);
global.getProductItems = () => getProductItems();
global.setChildCategory = () => setChildCategory();
global.setRule11stCategoryCells = () => setRule11stCategoryCells();
