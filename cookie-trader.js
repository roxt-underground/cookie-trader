// ==UserScript==
// @name         Cookie Clicker helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       RoxT
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

class Trader {
    constructor() {
        this.underline = 20;
        this.upperline = 80;
        this.interval = null;
        this.autoSell = true;
        this.saleTrendLength = 3;
    }
    trade(_good) {
        let delta = _good.vals[0] - _good.vals[1];
        let max_stock = Game.Objects.Bank.minigame.getGoodMaxStock(_good);
        if (_good.stock == 0) {
            if (_good.val < this.underline && delta > 0) {
                Game.Objects.Bank.minigame.buyGood(_good.id, max_stock);
                console.log('buy ' + _good.name);
                Game.Objects.Bank.minigame.draw();
            }
        }
        else {
            if(_good.val >= this.upperline && delta < 0) {
                if (this.autoSell == true && this.calcTrend(_good.vals, this.saleTrendLength) < 0) {
                    console.log('sell ' + _good.name);
                    Game.Objects.Bank.minigame.sellGood(_good.id, _good.stock);
                    Game.Objects.Bank.minigame.draw();
                }
            }
        }
    }
    calcTrend(vals, n) {
        let deltas_sum = 0;
        // if short vals list
        if ((n + 1) > vals.lengh) {
            console.log('not enouth vals');
            return Infinity;
        }
        for (let i = 0; i < n; i++) {
            deltas_sum += (vals[n] - vals[n+1]);
        }
        return deltas_sum/n;
    }
    tradeAll() {
        let goods = Game.Objects.Bank.minigame.goodsById;
        let good_id;
        let _self = this;
        for (good_id in goods) {
            _self.trade(goods[good_id]);
        }
    }
    start() {
        this.interval = setInterval(function(trader){trader.tradeAll()}, 10000, this);
        console.log("Auto trader started");
    }
    stop() {
        this.clearInterval(this.interval);
        this.interval = null;
        console.log("Auto trader stoped");
    }
}


async function coockieClikHelpers(_game) {
    while (!_game.ready) {
        console.log('waiting game is ready');
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('/// load mods');
    _game.LoadMod('https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js');

    console.log('/// load autotrader');
    _game.trader = new Trader();
    _game.trader.start();
}

coockieClikHelpers(Game);
