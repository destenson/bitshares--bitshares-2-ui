import alt from 'alt-instance';
import SettingsActions from 'actions/SettingsActions';
import IntlActions from 'actions/IntlActions';
import Immutable from 'immutable';
import {merge} from 'lodash';
import ls from 'common/localStorage';
import {Apis} from 'bitsharesjs-ws';
import {settingsAPIs} from 'api/apiConfig';

const CORE_ASSET = "BTS"; // Setting this to BTS to prevent loading issues when used with BTS chain which is the most usual case currently

const STORAGE_KEY = "__graphene__";
let ss = new ls(STORAGE_KEY);

class SettingsStore {
    constructor() {
        this.exportPublicMethods({init: this.init.bind(this), getSetting: this.getSetting.bind(this)});

        this.bindListeners({
            onChangeSetting: SettingsActions.changeSetting,
            onChangeViewSetting: SettingsActions.changeViewSetting,
            onChangeMarketDirection: SettingsActions.changeMarketDirection,
            onAddStarMarket: SettingsActions.addStarMarket,
            onRemoveStarMarket: SettingsActions.removeStarMarket,
            onAddStarAccount: SettingsActions.addStarAccount,
            onRemoveStarAccount: SettingsActions.removeStarAccount,
            onAddWS: SettingsActions.addWS,
            onRemoveWS: SettingsActions.removeWS,
            onHideAsset: SettingsActions.hideAsset,
            onClearSettings: SettingsActions.clearSettings,
            onSwitchLocale: IntlActions.switchLocale,
            onSetUserMarket: SettingsActions.setUserMarket
        });

        this.initDone = false;
        this.defaultSettings = Immutable.Map({
            locale: "en",
            apiServer: settingsAPIs.DEFAULT_WS_NODE,
            faucet_address: settingsAPIs.DEFAULT_FAUCET,
            unit: CORE_ASSET,
            showSettles: false,
            showAssetPercent: false,
            walletLockTimeout: 60 * 10,
            themes: "darkTheme",
            disableChat: false,
            passwordLogin: false
        });

/*        this.marketDirections = Immutable.Map({

        });

        this.hiddenAssets = Immutable.List([]);

        this.preferredBases = Immutable.List([CORE_ASSET, "BTC", "USD", "OPEN.ETH", "DAI", "MKR"]);
        this.baseOptions = [CORE_ASSET, "BTC", "USD", "CNY", "OPEN.BTC", "OPEN.USD"];

        this.starredMarkets = Immutable.Map([

            // BTS BASE
            ["OPEN.MUSE_"+ CORE_ASSET, {"quote": "OPEN.MUSE","base": CORE_ASSET}],
            ["OPEN.EMC_"+ CORE_ASSET, {"quote": "OPEN.EMC","base": CORE_ASSET}],
            ["TRADE.MUSE_"+ CORE_ASSET, {"quote": "TRADE.MUSE","base": CORE_ASSET}],
            ["OPEN.BTC_"+ CORE_ASSET, {"quote": "OPEN.BTC","base": CORE_ASSET}],
            ["USD_"+ CORE_ASSET, {"quote": "USD","base": CORE_ASSET}],
            ["BTC_"+ CORE_ASSET, {"quote": "BTC","base": CORE_ASSET}],
            ["CNY_"+ CORE_ASSET, {"quote": "CNY","base": CORE_ASSET}],
            ["EUR_"+ CORE_ASSET, {"quote": "EUR","base": CORE_ASSET}],
            ["GOLD_"+ CORE_ASSET, {"quote": "GOLD","base": CORE_ASSET}],
            ["SILVER_"+ CORE_ASSET, {"quote": "SILVER","base": CORE_ASSET}],
            ["METAEX.BTC_"+ CORE_ASSET, {"quote": "METAEX.BTC","base": CORE_ASSET}],
            ["METAEX.ETH_"+ CORE_ASSET, {"quote": "METAEX.ETH","base": CORE_ASSET}],
            ["METAFEES_"+ CORE_ASSET, {"quote": "METAFEES","base": CORE_ASSET}],
            ["OBITS_"+ CORE_ASSET, {"quote": "OBITS","base": CORE_ASSET}],
            ["OPEN.ETH_"+ CORE_ASSET, {"quote": "OPEN.ETH","base": CORE_ASSET}],
            ["MKR_"+ CORE_ASSET, {"quote": "MKR","base": CORE_ASSET}],

            // BTC BASE
            ["TRADE.BTC_BTC", {"quote":"TRADE.BTC","base": "BTC"} ],
            ["METAEX.BTC_BTC", {"quote":"METAEX.BTC","base": "BTC"} ],
            ["OPEN.BTC_BTC", {"quote":"OPEN.BTC","base": "BTC"} ],
            ["OPEN.STEEM_BTC", {"quote":"OPEN.STEEM","base": "BTC"} ],
            ["OPEN.ETH_BTC", {"quote":"OPEN.ETH","base": "BTC"} ],
            ["USD_BTC", {"quote":"USD","base": "BTC"} ],
            [CORE_ASSET + "_BTC", {"quote": CORE_ASSET,"base": "BTC"}],

            // USD BASE
            ["OPEN.USD_USD", {"quote": "OPEN.USD","base": "USD"}],
            [CORE_ASSET + "_USD", {"quote": CORE_ASSET,"base": "USD"}],

            // CNY BASE
            ["TCNY_CNY", {"quote": "TCNY","base": "CNY"}],
            ["BOTSCNY_CNY", {"quote": "BOTSCNY","base": "CNY"}],
            ["OPEN.CNY_CNY", {"quote": "OPEN.CNY","base": "CNY"}],
            [CORE_ASSET + "_CNY", {"quote": CORE_ASSET,"base": "CNY"}],

            // OTHERS
            ["OPEN.EUR_EUR", {"quote": "OPEN.EUR","base": "EUR"}],
            ["METAEX.ETH_OPEN.ETH", {"quote": "METAEX.ETH","base": "OPEN.ETH"}]
            ["MKR_OPEN.BTC", {"quote": "MKR","base": "OPEN.BTC"}]

        ]);

        this.starredAccounts = Immutable.Map();
*/
        // If you want a default value to be translated, add the translation to settings in locale-xx.js
        // and use an object {translate: key} in the defaults array
        let apiServer = settingsAPIs.WS_NODE_LIST;

        let defaults = {
            locale: [
                "en",
                "cn",
                "fr",
                "ko",
                "de",
                "es",
                "tr",
                "ru"
            ],
            apiServer: [],
            unit: [
                CORE_ASSET,
                "USD",
                "CNY",
                "BTC",
                "BTS",
                "EUR",
                "GBP"
            ],
            showSettles: [
                {translate: "yes"},
                {translate: "no"}
            ],
            showAssetPercent: [
                {translate: "yes"},
                {translate: "no"}
            ],
            disableChat: [
                {translate: "yes"},
                {translate: "no"}
            ],
            themes: [
                "darkTheme",
                "lightTheme",
                "olDarkTheme"
            ],
            passwordLogin: [
                {translate: "yes"},
                {translate: "no"}
            ]
            // confirmMarketOrder: [
            //     {translate: "confirm_yes"},
            //     {translate: "confirm_no"}
            // ]
        };

        this.settings = Immutable.Map(merge(this.defaultSettings.toJS(), ss.get("settings_v3")));

        let savedDefaults = ss.get("defaults_v1", {});
        this.defaults = merge({}, defaults, savedDefaults);

        (savedDefaults.apiServer || []).forEach(api => {
            let hasApi = false;
            if (typeof api === "string") {
                api = {url: api, location: null};
            }
            this.defaults.apiServer.forEach(server => {
                if (server.url === api.url) {
                    hasApi = true;
                }
            });

            if (!hasApi) {
                this.defaults.apiServer.push(api);
            }
        });

        if (!savedDefaults || (savedDefaults && (!savedDefaults.apiServer || !savedDefaults.apiServer.length))) {
            for (let i = apiServer.length - 1; i >= 0; i--) {
                let hasApi = false;
                this.defaults.apiServer.forEach(api => {
                    if (api.url === apiServer[i].url) {
                        hasApi = true;
                    }
                });
                if (!hasApi) {
                    this.defaults.apiServer.unshift(apiServer[i]);
                }
            }
        }

        this.viewSettings = Immutable.Map(ss.get("viewSettings_v1"));

        this.marketDirections = Immutable.Map(ss.get("marketDirections"));

        this.hiddenAssets = Immutable.List(ss.get("hiddenAssets", []));

        this.apiLatencies = ss.get("apiLatencies", {});
    }

    init() {
        return new Promise((resolve) => {
            if (this.initDone) resolve();
            this.starredKey = this._getChainKey("markets");
            this.marketsKey = this._getChainKey("userMarkets");
            // Default markets setup
            let topMarkets = {
                markets_4018d784: [ // BTS MAIN NET
                    "OPEN.MKR", "MKR", "BTS", "OPEN.ETH", "ICOO", "BTC", "BKT",
                    "OPEN.STEEM", "OPEN.GAME", "OCT", "USD", "CNY", "BTSR", "OBITS",
                    "OPEN.DGD", "EUR", "GOLD", "SILVER", "IOU.CNY", "OPEN.DASH",
                    "OPEN.ARDR", "OPEN.BKS", "OPEN.DCT", "OPEN.ETP", "OPEN.EXCL", "OPEN.NSR",
                    "OPEN.HEAT", "OPEN.LISK", "OPEN.LTC", "OPEN.MAID", "OPEN.MUSE", "OPEN.NBT",
                    "OPEN.NXC", "OPEN.OMNI", "OPEN.SBD", "OPEN.STEEM", "OPEN.USD", "OPEN.WAVES",
                    "OPEN.USDT", "OPEN.EURT", "OPEN.BTC", "CADASTRAL", "BLOCKPAY", "BTWTY",
                    "OPEN.INCNT", "KAPITAL", "OPEN.MAID", "OPEN.SBD", "OPEN.GRC",
                    "YOYOW", "HERO", "RUBLE"
                ],
                markets_39f5e2ed: [ // TESTNET
                    "PEG.FAKEUSD", "BTWTY"
                ]
            };

            let bases = {
                markets_4018d784: [ // BTS MAIN NET
                    "USD", "OPEN.BTC", "BTS", "BTC", "MKR", "CNY", "ICOO", "OPEN.ETH", "OPEN.MKR"
                ],
                markets_39f5e2ed: [ // TESTNET
                    "TEST"
                ]
            };

            let coreAssets = {markets_4018d784: "BTS", markets_39f5e2ed: "TEST"};
            let coreAsset = coreAssets[this.starredKey] || "BTS";
            this.defaults.unit[0] = coreAsset;

            let chainBases = bases[this.starredKey] || bases.markets_4018d784;
            this.preferredBases = Immutable.List(chainBases);

            function addMarkets(target, base, markets) {
                markets.filter(a => {
                    return a !== base;
                }).forEach(market => {
                    target.push([`${market}_${base}`, {"quote": market,"base": base}]);
                });
            }

            let defaultMarkets = [];
            let chainMarkets = topMarkets[this.starredKey] || [];
            this.preferredBases.forEach(base => {
                addMarkets(defaultMarkets, base, chainMarkets);
            });

            this.defaultMarkets = Immutable.Map(defaultMarkets);
            this.starredMarkets = Immutable.Map(ss.get(this.starredKey, []));
            this.userMarkets = Immutable.Map(ss.get(this.marketsKey, {}));
            this.starredAccounts = Immutable.Map(ss.get(this._getChainKey("starredAccounts")));

            this.initDone = true;
            resolve();
        });
    }

    getSetting(setting) {
        return this.settings.get(setting);
    }

    onChangeSetting(payload) {
        this.settings = this.settings.set(
            payload.setting,
            payload.value
        );

        ss.set("settings_v3", this.settings.toJS());
        if (payload.setting === "walletLockTimeout") {
            ss.set("lockTimeout", payload.value);
        }
    }

    onChangeViewSetting(payload) {
        for (let key in payload) {
            this.viewSettings = this.viewSettings.set(key, payload[key]);
        }

        ss.set("viewSettings_v1", this.viewSettings.toJS());
    }

    onChangeMarketDirection(payload) {
        for (let key in payload) {
            this.marketDirections = this.marketDirections.set(key, payload[key]);
        }

        ss.set("marketDirections", this.marketDirections.toJS());
    }

    onHideAsset(payload) {
        if (payload.id) {
            if (!payload.status) {
                this.hiddenAssets = this.hiddenAssets.delete(this.hiddenAssets.indexOf(payload.id));
            } else {
                this.hiddenAssets = this.hiddenAssets.push(payload.id);
            }
        }

        ss.set("hiddenAssets", this.hiddenAssets.toJS());
    }

    onAddStarMarket(market) {
        let marketID = market.quote + "_" + market.base;
        if (!this.starredMarkets.has(marketID)) {
            this.starredMarkets = this.starredMarkets.set(marketID, {quote: market.quote, base: market.base});

            ss.set(this.starredKey, this.starredMarkets.toJS());
        } else {
            return false;
        }
    }

    onSetUserMarket(payload) {
        let marketID = payload.quote + "_" + payload.base;
        if (payload.value) {
            this.userMarkets = this.userMarkets.set(marketID, {quote: payload.quote, base: payload.base});
        } else {
            this.userMarkets = this.userMarkets.delete(marketID);
        }
        ss.set(this.marketsKey, this.userMarkets.toJS());
    }

    onRemoveStarMarket(market) {
        let marketID = market.quote + "_" + market.base;

        this.starredMarkets = this.starredMarkets.delete(marketID);

        ss.set(this.starredKey, this.starredMarkets.toJS());
    }

    onAddStarAccount(account) {
        if (!this.starredAccounts.has(account)) {
            this.starredAccounts = this.starredAccounts.set(account, {name: account});

            ss.set(this._getChainKey("starredAccounts"), this.starredAccounts.toJS());
        } else {
            return false;
        }
    }

    onRemoveStarAccount(account) {

        this.starredAccounts = this.starredAccounts.delete(account);

        ss.set(this._getChainKey("starredAccounts"), this.starredAccounts.toJS());
    }

    onAddWS(ws) {
        if (typeof ws === "string") {
            ws = {url: ws, location: null};
        }
        this.defaults.apiServer.push(ws);
        ss.set("defaults_v1", this.defaults);
    }

    onRemoveWS(index) {
        if (index !== 0) { // Prevent removing the default apiServer
            this.defaults.apiServer.splice(index, 1);
            ss.set("defaults_v1", this.defaults);
        }
    }

    onClearSettings(resolve) {
        ss.remove("settings_v3");
        this.settings = this.defaultSettings;

        ss.set("settings_v3", this.settings.toJS());

        if (resolve) {
            resolve();
        }
    }

    onSwitchLocale({locale}) {
        this.onChangeSetting({setting: "locale", value: locale});
    }

    _getChainKey(key) {
        const chainId = Apis.instance().chain_id;
        return key + (chainId ? `_${chainId.substr(0, 8)}` : "");
    }
}

export default alt.createStore(SettingsStore, "SettingsStore");
