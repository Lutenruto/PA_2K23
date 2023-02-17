import IWalletInterface from "./IWalletInterface";

export default class WalletFactory {
	public static create(ClassName: { new (): IWalletInterface }): IWalletInterface {
		return new ClassName();
	}
}
