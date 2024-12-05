import { AppInterface } from "./types";
import { mqData } from "@js/helpers/media";

export const app: AppInterface = {
  bodyBlock( isBlock = true ) {
    document.body.style.overflowY = isBlock ? 'hidden' : 'auto';
  },
  initDependencies() {
    const { isDevice } = mqData();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if ( scrollbarWidth && isDevice.pc ) {
      document.body.style.paddingRight = `${ scrollbarWidth }px`;
    }
  },
};