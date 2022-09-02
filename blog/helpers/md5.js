import md5 from "js-md5";
import config from "../config";
let app_secret = config.app_secret;

function sortSplit(params) {
    var connects = '';
    Object.keys(params).sort().map((key) => {
        connects += key + '=' + params[key] + '&'
    })
    let sign = md5(app_secret + connects.substr(0, connects.length - 1) + app_secret);
    return sign;
}

module.exports = {
    GetSign: function (params) {
        params.ti = Date.parse(new Date());
        let connects = sortSplit(params);
        params.sign = connects;
        return params;
    }
}