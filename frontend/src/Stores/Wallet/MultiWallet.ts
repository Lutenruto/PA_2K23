import EventEmitter from "events";
import IWalletInterface from "Services/Wallet/IWalletInterface";
import TaquitoBeaconWallet from "Services/Wallet/Tezos/BeaconWallet";
import WalletFactory from "Services/Wallet/WalletFactory";
import { EWalletType } from "./Wallet";

export default class MultiWallet {
    private static ctx: MultiWallet;
    private readonly event = new EventEmitter();
    private instancies = {
        [EWalletType.BEACON]: WalletFactory.create(TaquitoBeaconWallet),
    };

    private constructor() {
        MultiWallet.ctx = this;
        this.listenWallets();
    }

    public static getInstance(walletName: EWalletType) {
        if (!this.ctx) new this();
        return this.ctx.instancies[walletName];
    }

    public onChange(callback: (wallet: IWalletInterface) => void) {
        this.event.on("change", callback);
        return () => {
            this.event.off("change", callback);
        };
    }

    private listenWallets() {
        Object.entries(this.instancies).map(([key, wallet]) =>
            wallet.onChange(() => this.event.emit("change", wallet))
        );
    }
}
