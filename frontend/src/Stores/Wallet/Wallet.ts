import IWalletInterface from "Services/Wallet/IWalletInterface";
import WalletFactory from "Services/Wallet/WalletFactory";
import BeaconWallet from "Services/Wallet/Tezos/BeaconWallet";

export enum EWalletType {
    BEACON = "beacon",
}

export default class Wallet {
    private static ctx: Wallet;
    private walletFactory: IWalletInterface;
    private walletType: EWalletType;
    private wallets = new Map<EWalletType, { new (): IWalletInterface }>();

    private constructor(walletType: EWalletType) {
        this.wallets.set(EWalletType.BEACON, BeaconWallet);
        this.walletFactory = WalletFactory.create(
            this.wallets.get(walletType)!
        );
        this.walletFactory.autoConnect();
        this.walletType = walletType;
        Wallet.ctx = this;
    }

    public static getInstance(walletType?: EWalletType) {
        if (walletType && this.ctx && this.ctx.walletType !== walletType)
            new this(walletType);
        if (!walletType && !this.ctx) new this("beacon" as EWalletType);
        return Wallet.ctx.walletFactory;
    }
}
