import { getProductItems } from "./product";
import { onOpen } from "./reserved-methods";

global.onOpen = (e) => onOpen(e);
global.getProductItems = () => getProductItems();
