import config from "../config";
let Sign = require('./md5');
let domain = config.domain;
module.exports = {
    url: "https://" + domain + "/wxapi/v1/g.c?",
    GetSignParams:function (params) {
        return Sign.GetSign(params);
    }
}