import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";

type IProps = {};

type IState = {};

export default class MainRoutes extends React.Component<IProps, IState> {
    public override render(): JSX.Element {
        return (
            <Router basename="/">
                <Routes>
                    <Route path="" element={<Home />} />
                </Routes>
            </Router>
        );
    }
}
