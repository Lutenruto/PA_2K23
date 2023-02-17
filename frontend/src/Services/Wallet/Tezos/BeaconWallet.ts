import {
    ColorMode,
    DAppClientOptions,
    NetworkType,
    PermissionScope,
    RequestPermissionInput,
    SigningType,
} from "@airgap/beacon-sdk";
import { BeaconWallet as BeaconWalletLib } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import BigNumberJs from "bignumber.js";
import { EventEmitter } from "events";
import IWalletInterface, {
    IWalletData,
} from "Services/Wallet/IWalletInterface";

export default class BeaconWallet implements IWalletInterface {
    private static wallet: BeaconWalletLib;
    private removeEvents = () => {};

    private walletData: IWalletData | null = null;
    private readonly event = new EventEmitter();

    public getWalletData(): IWalletData {
        return (
            this.walletData ?? {
                userAddress: null,
                balance: null,
                provider: null,
            }
        );
    }

    public async connect(): Promise<BeaconWallet> {
        try {
            const provider =
                this.walletData?.provider ??
                new TezosToolkit("https://ghostnet.smartpy.io");
            const instance = await BeaconWallet.getBeaconWallet();
            await provider.setWalletProvider(instance);
            if (!(await instance.client.getActiveAccount())) {
                await instance.requestPermissions(
                    BeaconWallet.getPermissions()
                );
            }

            this.initEvents(instance, provider);
            if (!provider) throw new Error("provider not found");
            await this.changed(provider);
        } catch (err) {
            console.error(err);
        }

        return this;
    }

    public connectTo(walletName: string): Promise<any> {
        throw new Error("Not supported");
    }

    public async disconnect(): Promise<void> {
        try {
            this.walletData = null;
            BeaconWallet.getBeaconWallet().clearActiveAccount();
            this.changed(null);
            this.removeEvents();
            return;
        } catch (e) {
            console.warn(e);
        }
    }

    public onChange(
        callback: (beaconWalletData: IWalletData) => void
    ): () => void {
        this.event.on("change", callback);
        return () => {
            this.event.off("change", callback);
        };
    }

    public autoConnect(): void {
        const storage = localStorage.getItem("beacon:active-account");
        if (storage && storage !== "undefined") {
            this.connect();
        }
    }

    private async changed(provider: TezosToolkit | null) {
        const userAddress: string | null =
            (await provider?.wallet.pkh()) ?? null;
        const bigNumber: BigNumberJs | null = userAddress
            ? (await provider?.tz.getBalance(userAddress)) ?? null
            : null;

        const balance = bigNumber ? bigNumber : null;
        const beaconEvent: IWalletData = {
            userAddress: userAddress,
            balance: balance,
            provider: provider,
        };
        this.walletData = beaconEvent;
        this.event.emit("change", beaconEvent);
    }

    private static newBeaconWallet() {
        const wallet = new BeaconWalletLib(BeaconWallet.getWalletOptions());
        return wallet;
    }

    private static getBeaconWallet() {
        if (BeaconWallet.wallet) return BeaconWallet.wallet;
        BeaconWallet.wallet = BeaconWallet.newBeaconWallet();

        return BeaconWallet.wallet;
    }

    private initEvents(
        instance: any | null,
        provider: TezosToolkit | null
    ): void {
        this.removeEvents();
    }

    private static getPermissions(): RequestPermissionInput {
        return {
            network: {
                type: "ghostnet" as NetworkType,
            },
            scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN],
        };
    }

    private static getWalletOptions(): DAppClientOptions {
        return {
            name: "Marketplace",
            colorMode: "dark" as ColorMode,
            preferredNetwork: "ghostnet" as NetworkType,
        };
    }

    public async signMessage(message: string): Promise<string> {
        try {
            if (!this.getWalletData().userAddress) {
                Promise.reject("User connected");
            }

            const signedMessage =
                await this.getWalletData().provider.wallet.walletProvider.client.requestSignPayload(
                    {
                        signingType: SigningType.MICHELINE,
                        payload: message,
                    }
                );

            return signedMessage.signature;
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
