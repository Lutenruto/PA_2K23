import fr from "Configs/I18n/fr.json";
import en from "Configs/I18n/en.json";

export enum ELang {
    EN = "en",
}

type IVars = { [key: string]: string };

export type IKeyOfLng = keyof typeof fr;

export type ILngType = {
    [key in string]: string | ILngType;
};

const lngs: { [key: string]: ILngType } = {
    en,
};

export default class I18nStore {
    private static instance: I18nStore;
    private static readonly defaultLng = ELang.EN;
    private _assetDefault: ILngType = lngs[I18nStore.defaultLng]!;
    private _asset: ILngType = lngs[ELang.EN]!;
    private cache = new Map<string, any>();

    private constructor() {
        I18nStore.instance = this;
        this.autoDetectAndSetLanguage();
    }

    public static getInstance() {
        return I18nStore.instance ?? new this();
    }

    public get assetDefault() {
        return this._assetDefault;
    }

    public get asset() {
        return this._asset;
    }

    public get lang() {
        return localStorage.getItem("lang") ?? I18nStore.defaultLng;
    }

    public toggleTo(key: string) {
        this.switch(lngs[key]!, key);
        return this.asset;
    }

    public getTranslations(map: string | string[], vars?: IVars): string[] {
        const translations = [];

        if (typeof map === "string") {
            translations.push(this.translate(map, vars));
            return translations;
        }

        translations.push(
            ...map.map((key) => {
                return this.translate(key, vars);
            })
        );

        return translations;
    }

    public translate(key: string, vars: IVars = {}) {
        const cacheKey = key.concat(JSON.stringify(vars));

        const value = this.getCache(cacheKey);

        if (value !== undefined) return value;

        const assetValue: string | null =
            this.getFromObjectByKeyString(key, this.asset) ??
            this.getFromObjectByKeyString(key, this.assetDefault);

        if (!assetValue) return key;

        const resultWithVariables = Object.keys(vars).reduce(
            (str, key) => str.replaceAll(`{{${key}}}`, vars[key] ?? ""),
            assetValue
        );

        this.setCache(cacheKey, resultWithVariables);
        return resultWithVariables;
    }

    private switch(asset: ILngType, key: string) {
        this.storeLang(key);
        if (asset === this._asset) return;
        this._asset = asset;
        // whenever the application's language changes the localization cache is fully cleared:
        this.cache.clear();
    }

    private getFromObjectByKeyString(
        key: string,
        asset: { [key: string]: any }
    ) {
        const keys = key.split(".");

        return keys.reduce((asset, key) => asset?.[key] ?? null, asset) as any;
    }

    private getCache(key: string): string | undefined {
        return this.cache.get(key);
    }

    private setCache(key: string, value: string) {
        this.cache.set(key, value);
    }
    private autoDetectAndSetLanguage() {
        let lng: string =
            localStorage.getItem("lang") ??
            window.navigator.language.split("-")[0]!;
        if (!lngs[lng]) lng = I18nStore.defaultLng;
        this.toggleTo(lng);
    }
    private storeLang(key: string) {
        const lng = localStorage.getItem("lang");
        if (!lng || lng !== key) localStorage.setItem("lang", key);
    }
}
