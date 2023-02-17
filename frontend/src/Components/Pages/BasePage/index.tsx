import GlobalContext from "Components/GlobalContext";
import React from "react";

type _IProps = {};
type _IState = {};

export default class BasePage<IProps = _IProps, IState = _IState> extends React.Component<IProps, IState> {
	static override contextType = GlobalContext;
	public override context!: React.ContextType<typeof GlobalContext>;

	public translate(key: string) {
		return this.context.I18nStore.translate(key);
	}
}
