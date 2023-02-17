export interface IWalletData {
	userAddress: string | null;
	balance: any | null;
	provider: any | null;
	chainId?: number | null;
}

export default interface IWalletInterface {
	getWalletData(): IWalletData;

	connect(): Promise<any>;

	connectTo(walletName: string, idpHint?: string): Promise<any>;

	disconnect(): Promise<void>;

	onChange(callback: (data: any) => void): () => void;

	autoConnect(): void;

	signMessage(message: string): Promise<string>;
}
