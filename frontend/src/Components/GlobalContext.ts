import React from "react";
import I18nStore from "./Materials/I18n/I18nStore";

export type IGlobalContext = {
	I18nStore: I18nStore;
};

export const defaultContext: IGlobalContext = {
	I18nStore: I18nStore.getInstance(),
};

export default React.createContext(defaultContext);

