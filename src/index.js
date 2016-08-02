export default class stcAdapter {
  constructor(options, config) {
    this.blockStart = options.blockStart || config.tpl.ld[0];
    this.blockEnd = options.blockStart || config.tpl.rd[0];

    this.variableStart = options.variableStart || config.tpl.ld[1];
    this.variableEnd = options.variableEnd || config.tpl.rd[1];

    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { blockStart, blockEnd } = this;

    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${blockStart} if http.userAgent() and http.userAgent().indexOf("MSIE ") == -1 and not http.cookie("${nlsCookie}") ${blockEnd}`;
    data['else'] = `${blockStart} else ${blockEnd}`;
    data['end'] = `${blockStart} endif ${blockEnd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { blockStart, blockEnd } = this;
    
    let configStr = JSON.stringify(appConfig);

    return `${blockStart} set stc_ls_config = JSON.parse(\'${configStr}\') ${blockEnd}`;
  }

  getLsBaseCode() {
    let { blockStart, blockEnd } = this;
    
    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${blockStart} if not http_${name} ${blockEnd}${blockStart} set http_${name} = true ${blockEnd}`;
    data['end'] = `${blockStart} endif ${blockEnd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { blockStart, blockEnd } = this;
    
    let lsCookie = this.options.lsCookie;

    let content = [
      `${blockStart} set stcLsCookieFn = eval(\'think.stcLsCookie = function(http){`,
      `var stc_ls_cookie = http.cookie("${lsCookie}");`,
      `var stc_cookie_length = stc_ls_cookie.length;`,
      `var stc_ls_cookies = {};`,
      `for(var i = 0; i < stc_cookie_length;i += 2) {`,
      `stc_ls_cookies[stc_ls_cookie[i]] = stc_ls_cookie[i+1];`,
      `}`,
      `return stc_ls_cookies;`,
      `}\') ${blockEnd}`,
      `${blockStart} set stc_ls_cookies = think.stcLsCookie(http) ${blockEnd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { blockStart, blockEnd, variableStart, variableEnd } = this;

    let data = {};

    data['if'] = `${blockStart} if stc_ls_config["${lsValue}"] and stc_ls_cookies[stc_ls_config["${lsValue}"].key] and stc_ls_config["${lsValue}"].version == stc_ls_cookies[stc_ls_config["${lsValue}"].key] ${blockEnd}`;
    data['else'] = `${blockStart} else ${blockEnd}`;
    data['end'] = `${blockStart} endif ${blockEnd}`;
    data['key'] = `${variableStart} stc_ls_config["${lsValue}"]["key"] ${variableEnd}`;
    data['version'] = `${variableStart} stc_ls_config["${lsValue}"]["version"] ${variableEnd}`;

    return data;
  }
};