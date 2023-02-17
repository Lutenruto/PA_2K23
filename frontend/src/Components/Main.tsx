import React from "react";
import GlobalContext, { defaultContext } from "./GlobalContext";
import MainRoutes from "./MainRoutes";

type IProps = {};

type IState = {};

export default class Main extends React.Component<IProps, IState> {
    public override render(): JSX.Element {
        return (
            <GlobalContext.Provider value={defaultContext}>
                <MainRoutes />
            </GlobalContext.Provider>
        );
    }
}
