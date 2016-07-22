export default class stcAdapter {
  constructor(options, config) {
    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let ld = this.config.tpl.ld[0];
    let rd = this.config.tpl.rd[0];

    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${ld} if http.userAgent() and http.userAgent().indexOf("MSIE ") == -1 and not http.cookie("${nlsCookie}") ${rd}`;
    data['else'] = `${ld} else ${rd}`;
    data['end'] = `${ld} endif ${rd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let ld = this.config.tpl.ld[0];
    let rd = this.config.tpl.rd[0];
    
    let configStr = JSON.stringify(appConfig);

    return `${ld} set stc_ls_config = JSON.parse(\'${configStr}\') ${rd}`;
  }

  getLsBaseCode() {
    let ld = this.config.tpl.ld[0];
    let rd = this.config.tpl.rd[0];
    
    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${ld} if not http_${name} ${rd}${ld} set http_${name} = true ${rd}`;
    data['end'] = `${ld} endif ${rd}`;

    return data;
  }

  getLsParseCookieCode() {
    let ld = this.config.tpl.ld[0];
    let rd = this.config.tpl.rd[0];
    
    let lsCookie = this.options.lsCookie;

    let content = [
      `${ld} set stcLsCookieFn = eval(\'think.stcLsCookie = function(http){`,
      `var stc_ls_cookie = http.cookie("${lsCookie}",`,
      `var stc_cookie_length = stc_ls_cookie.length;`,
      `var stc_ls_cookies = {};`,
      `for(var i = 0; i < stc_cookie_length;i += 2) {`,
      `stc_ls_cookies[stc_ls_cookie[i]] = stc_ls_cookie[i+1];`,
      `}`,
      `return stc_ls_cookies;`,
      `}\') ${rd}`,
      `${ld} set stc_ls_cookies = think.stcLsCookie(http) ${rd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let ld = this.config.tpl.ld[0];
    let rd = this.config.tpl.rd[0];

    let data = {};

    data['if'] = `${ld} if stc_ls_config["${lsValue}"] and stc_ls_cookies[stc_ls_config["${lsValue}"].key] and stc_ls_config["${lsValue}"].version == stc_ls_cookies[stc_ls_config["${lsValue}"].key] ${rd}`;
    data['else'] = `${ld} else ${rd}`;
    data['end'] = `${ld} endif ${rd}`;
    data['key'] = `{{ stc_ls_config["${lsValue}"]["key"] }}`;
    data['version'] = `{{ stc_ls_config["${lsValue}"]["version"] }}`;

    return data;
  }
};