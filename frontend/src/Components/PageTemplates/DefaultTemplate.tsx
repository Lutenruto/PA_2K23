import React from "react";
import classes from "./classes.module.scss";
import I18n from "Components/Materials/I18n";
import classNames from "classnames";

type IProps = {
    title?: string;
    children?: React.ReactChild | (React.ReactChild | null)[] | null;
    className?: string;
    padding?: boolean;
};
type IState = {};

export default class DefaultTemplate extends React.Component<IProps, IState> {
    static defaultProps: IProps = {
        title: "",
        padding: true,
    };

    public override render(): JSX.Element {
        return (
            <I18n>
                <div className={classNames(classes["root"])}>
                    <h1 className={classes["for-seo"]}>Tezos Marketplace</h1>
                    <h2 className={classes["for-seo"]}>Description</h2>
                    <div
                        className={classNames(
                            classes["content"],
                            this.props.className
                        )}
                        data-padding={this.props.padding}
                    >
                        {this.props.children}
                    </div>
                </div>
            </I18n>
        );
    }
}
