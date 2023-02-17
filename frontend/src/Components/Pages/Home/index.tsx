import I18n from "Components/Materials/I18n";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import BasePage from "../BasePage";
import classes from "./classes.module.scss";
type IProps = {};
type IState = {};
export default class Home extends BasePage<IProps, IState> {
    override render() {
        return (
            <I18n
                map={"pages_title.home"}
                content={([title]) => (
                    <DefaultTemplate title={title!}>
                        <div className={classes["root"]}></div>
                    </DefaultTemplate>
                )}
            />
        );
    }
}
