import React from "react";
import I18nStore from "Components/Materials/I18n/I18nStore";

type IVars = { [key: string]: string };

type IProps = {
    map?: string | string[];
    vars?: IVars;
    content?: (trads: string[]) => React.ReactNode;
};

type IState = {
    asset: { [key: string]: string | any };
};

/**
 * @example: usage <I18n map="menu_status.bla" vars={{myStringValue: this.state.myStringValue}}/>
 */
export default class I18n extends React.PureComponent<IProps, IState> {
    private removeOnChange = () => {};

    public override render(): React.ReactNode {
        if (this.props.children) {
            return this.props.children;
        }

        const trads = this.props.map
            ? I18nStore.getInstance().getTranslations(
                  this.props.map,
                  this.props.vars
              )
            : [];

        if (this.props.content) {
            return this.props.content(trads);
        }

        return trads.join(" ");
    }

    public override componentWillUnmount() {
        this.removeOnChange();
    }

    public static translate(map: string) {
        return I18nStore.getInstance().translate(map);
    }

    public static getLang() {
        return I18nStore.getInstance().lang;
    }
}
