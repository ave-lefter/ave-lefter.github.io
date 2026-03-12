import{aA as t,bq as e,bu as r,bv as i,br as n,bF as s,h3 as a,bH as o,by as c,dL as u,bC as l,bD as d,bE as p}from"./D6y-ViDA.js";import{n as h,r as f}from"./8ReBD8jy.js";import{U as g,c as m}from"./BqICjlzW.js";import"./DheuQlak.js";import"./bcgGgrN2.js";import{o as y}from"./C1IbZtR7.js";import"./DbAB4eZS.js";import"./Bnk68-zm.js";import"./D6omKXlF.js";var w,x={exports:{}};const v=t((w||(w=1,x.exports=function(){var t=1e3,e=6e4,r=36e5,i="millisecond",n="second",s="minute",a="hour",o="day",c="week",u="month",l="quarter",d="year",p="date",h="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,g=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"}},y=function(t,e,r){var i=String(t);return!i||i.length>=e?t:""+Array(e+1-i.length).join(r)+t},w={s:y,z:function(t){var e=-t.utcOffset(),r=Math.abs(e),i=Math.floor(r/60),n=r%60;return(e<=0?"+":"-")+y(i,2,"0")+":"+y(n,2,"0")},m:function t(e,r){if(e.date()<r.date())return-t(r,e);var i=12*(r.year()-e.year())+(r.month()-e.month()),n=e.clone().add(i,u),s=r-n<0,a=e.clone().add(i+(s?-1:1),u);return+(-(i+(r-n)/(s?n-a:a-n))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:d,w:c,d:o,D:p,h:a,m:s,s:n,ms:i,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},x="en",v={};v[x]=m;var b="$isDayjsObject",$=function(t){return t instanceof S||!(!t||!t[b])},T=function t(e,r,i){var n;if(!e)return x;if("string"==typeof e){var s=e.toLowerCase();v[s]&&(n=s),r&&(v[s]=r,n=s);var a=e.split("-");if(!n&&a.length>1)return t(a[0])}else{var o=e.name;v[o]=e,n=o}return!i&&n&&(x=n),n||!i&&x},D=function(t,e){if($(t))return t.clone();var r="object"==typeof e?e:{};return r.date=t,r.args=arguments,new S(r)},M=w;M.l=T,M.i=$,M.w=function(t,e){return D(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function m(t){this.$L=T(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[b]=!0}var y=m.prototype;return y.parse=function(t){this.$d=function(t){var e=t.date,r=t.utc;if(null===e)return new Date(NaN);if(M.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var i=e.match(f);if(i){var n=i[2]-1||0,s=(i[7]||"0").substring(0,3);return r?new Date(Date.UTC(i[1],n,i[3]||1,i[4]||0,i[5]||0,i[6]||0,s)):new Date(i[1],n,i[3]||1,i[4]||0,i[5]||0,i[6]||0,s)}}return new Date(e)}(t),this.init()},y.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},y.$utils=function(){return M},y.isValid=function(){return!(this.$d.toString()===h)},y.isSame=function(t,e){var r=D(t);return this.startOf(e)<=r&&r<=this.endOf(e)},y.isAfter=function(t,e){return D(t)<this.startOf(e)},y.isBefore=function(t,e){return this.endOf(e)<D(t)},y.$g=function(t,e,r){return M.u(t)?this[e]:this.set(r,t)},y.unix=function(){return Math.floor(this.valueOf()/1e3)},y.valueOf=function(){return this.$d.getTime()},y.startOf=function(t,e){var r=this,i=!!M.u(e)||e,l=M.p(t),h=function(t,e){var n=M.w(r.$u?Date.UTC(r.$y,e,t):new Date(r.$y,e,t),r);return i?n:n.endOf(o)},f=function(t,e){return M.w(r.toDate()[t].apply(r.toDate("s"),(i?[0,0,0,0]:[23,59,59,999]).slice(e)),r)},g=this.$W,m=this.$M,y=this.$D,w="set"+(this.$u?"UTC":"");switch(l){case d:return i?h(1,0):h(31,11);case u:return i?h(1,m):h(0,m+1);case c:var x=this.$locale().weekStart||0,v=(g<x?g+7:g)-x;return h(i?y-v:y+(6-v),m);case o:case p:return f(w+"Hours",0);case a:return f(w+"Minutes",1);case s:return f(w+"Seconds",2);case n:return f(w+"Milliseconds",3);default:return this.clone()}},y.endOf=function(t){return this.startOf(t,!1)},y.$set=function(t,e){var r,c=M.p(t),l="set"+(this.$u?"UTC":""),h=(r={},r[o]=l+"Date",r[p]=l+"Date",r[u]=l+"Month",r[d]=l+"FullYear",r[a]=l+"Hours",r[s]=l+"Minutes",r[n]=l+"Seconds",r[i]=l+"Milliseconds",r)[c],f=c===o?this.$D+(e-this.$W):e;if(c===u||c===d){var g=this.clone().set(p,1);g.$d[h](f),g.init(),this.$d=g.set(p,Math.min(this.$D,g.daysInMonth())).$d}else h&&this.$d[h](f);return this.init(),this},y.set=function(t,e){return this.clone().$set(t,e)},y.get=function(t){return this[M.p(t)]()},y.add=function(i,l){var p,h=this;i=Number(i);var f=M.p(l),g=function(t){var e=D(h);return M.w(e.date(e.date()+Math.round(t*i)),h)};if(f===u)return this.set(u,this.$M+i);if(f===d)return this.set(d,this.$y+i);if(f===o)return g(1);if(f===c)return g(7);var m=(p={},p[s]=e,p[a]=r,p[n]=t,p)[f]||1,y=this.$d.getTime()+i*m;return M.w(y,this)},y.subtract=function(t,e){return this.add(-1*t,e)},y.format=function(t){var e=this,r=this.$locale();if(!this.isValid())return r.invalidDate||h;var i=t||"YYYY-MM-DDTHH:mm:ssZ",n=M.z(this),s=this.$H,a=this.$m,o=this.$M,c=r.weekdays,u=r.months,l=r.meridiem,d=function(t,r,n,s){return t&&(t[r]||t(e,i))||n[r].slice(0,s)},p=function(t){return M.s(s%12||12,t,"0")},f=l||function(t,e,r){var i=t<12?"AM":"PM";return r?i.toLowerCase():i};return i.replace(g,function(t,i){return i||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return M.s(e.$y,4,"0");case"M":return o+1;case"MM":return M.s(o+1,2,"0");case"MMM":return d(r.monthsShort,o,u,3);case"MMMM":return d(u,o);case"D":return e.$D;case"DD":return M.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return d(r.weekdaysMin,e.$W,c,2);case"ddd":return d(r.weekdaysShort,e.$W,c,3);case"dddd":return c[e.$W];case"H":return String(s);case"HH":return M.s(s,2,"0");case"h":return p(1);case"hh":return p(2);case"a":return f(s,a,!0);case"A":return f(s,a,!1);case"m":return String(a);case"mm":return M.s(a,2,"0");case"s":return String(e.$s);case"ss":return M.s(e.$s,2,"0");case"SSS":return M.s(e.$ms,3,"0");case"Z":return n}return null}(t)||n.replace(":","")})},y.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},y.diff=function(i,p,h){var f,g=this,m=M.p(p),y=D(i),w=(y.utcOffset()-this.utcOffset())*e,x=this-y,v=function(){return M.m(g,y)};switch(m){case d:f=v()/12;break;case u:f=v();break;case l:f=v()/3;break;case c:f=(x-w)/6048e5;break;case o:f=(x-w)/864e5;break;case a:f=x/r;break;case s:f=x/e;break;case n:f=x/t;break;default:f=x}return h?f:M.a(f)},y.daysInMonth=function(){return this.endOf(u).$D},y.$locale=function(){return v[this.$L]},y.locale=function(t,e){if(!t)return this.$L;var r=this.clone(),i=T(t,e,!0);return i&&(r.$L=i),r},y.clone=function(){return M.w(this.$d,this)},y.toDate=function(){return new Date(this.valueOf())},y.toJSON=function(){return this.isValid()?this.toISOString():null},y.toISOString=function(){return this.$d.toISOString()},y.toString=function(){return this.$d.toUTCString()},m}(),O=S.prototype;return D.prototype=O,[["$ms",i],["$s",n],["$m",s],["$H",a],["$W",o],["$M",u],["$y",d],["$D",p]].forEach(function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}}),D.extend=function(t,e){return t.$i||(t(e,S,D),t.$i=!0),D},D.locale=T,D.isDayjs=$,D.unix=function(t){return D(1e3*t)},D.en=v[x],D.Ls=v,D.p={},D}()),x.exports));var b,$={exports:{}};const T=t(b?$.exports:(b=1,$.exports={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"}}));var D,M={exports:{}};const S=t(D?M.exports:(D=1,M.exports=function(t,e,r){t=t||{};var i=e.prototype,n={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function s(t,e,r,n){return i.fromToBase(t,e,r,n)}r.en.relativeTime=n,i.fromToBase=function(e,i,s,a,o){for(var c,u,l,d=s.$locale().relativeTime||n,p=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],h=p.length,f=0;f<h;f+=1){var g=p[f];g.d&&(c=a?r(e).diff(s,g.d,!0):s.diff(e,g.d,!0));var m=(t.rounding||Math.round)(Math.abs(c));if(l=c>0,m<=g.r||!g.r){m<=1&&f>0&&(g=p[f-1]);var y=d[g.l];o&&(m=o(""+m)),u="string"==typeof y?y.replace("%d",m):y(m,i,g.l,l);break}}if(i)return u;var w=l?d.future:d.past;return"function"==typeof w?w(u):w.replace("%s",u)},i.to=function(t,e){return s(t,e,this,!0)},i.from=function(t,e){return s(t,e,this)};var a=function(t){return t.$u?r.utc():r()};i.toNow=function(t){return this.to(a(this),t)},i.fromNow=function(t){return this.from(a(this),t)}}));var O,_={exports:{}};const A=t(O?_.exports:(O=1,_.exports=function(t,e,r){r.updateLocale=function(t,e){var i=r.Ls[t];if(i)return(e?Object.keys(e):[]).forEach(function(t){i[t]=e[t]}),i}}));v.extend(S),v.extend(A);const I={...T,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},k=["January","February","March","April","May","June","July","August","September","October","November","December"];v.locale("en-web3-modal",I);const C={getMonthNameByIndex:t=>k[t],getYear:(t=(new Date).toISOString())=>v(t).year(),getRelativeDateFromNow:t=>v(t).locale("en-web3-modal").fromNow(!0),formatDate:(t,e="DD MMM")=>v(t).format(e)},j=["receive","deposit","borrow","claim"],R=["withdraw","repay","burn"],N={getTransactionGroupTitle(t,e){const r=C.getYear(),i=C.getMonthNameByIndex(e);return t===r?i:`${i} ${t}`},getTransactionImages(t){const[e,r]=t,i=Boolean(e)&&t?.every(t=>Boolean(t.nft_info)),n=t?.length>1;return 2===t?.length&&!i?[this.getTransactionImage(r),this.getTransactionImage(e)]:n?t.map(t=>this.getTransactionImage(t)):[this.getTransactionImage(e)]},getTransactionImage:t=>({type:N.getTransactionTransferTokenType(t),url:N.getTransactionImageURL(t)}),getTransactionImageURL(t){let e;const r=Boolean(t?.nft_info),i=Boolean(t?.fungible_info);return t&&r?e=t?.nft_info?.content?.preview?.url:t&&i&&(e=t?.fungible_info?.icon?.url),e},getTransactionTransferTokenType:t=>t?.fungible_info?"FUNGIBLE":t?.nft_info?"NFT":void 0,getTransactionDescriptions(t){const e=t?.metadata?.operationType,r=t?.transfers,i=t?.transfers?.length>0,n=t?.transfers?.length>1,s=i&&r?.every(t=>Boolean(t?.fungible_info)),[a,o]=r;let c=this.getTransferDescription(a),u=this.getTransferDescription(o);if(!i){return("send"===e||"receive"===e)&&s?(c=g.getTruncateString({string:t?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),u=g.getTruncateString({string:t?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[c,u]):[t.metadata.status]}if(n)return r.map(t=>this.getTransferDescription(t)).reverse();let l="";return j.includes(e)?l="+":R.includes(e)&&(l="-"),c=l.concat(c),[c]},getTransferDescription(t){let e="";return t?(t?.nft_info?e=t?.nft_info?.name||"-":t?.fungible_info&&(e=this.getFungibleTransferDescription(t)||"-"),e):e},getFungibleTransferDescription(t){if(!t)return null;return[this.getQuantityFixedValue(t?.quantity.numeric),t?.fungible_info?.symbol].join(" ").trim()},getQuantityFixedValue(t){if(!t)return null;return parseFloat(t).toFixed(3)}};var B,Y;(Y=B||(B={})).approve="approved",Y.bought="bought",Y.borrow="borrowed",Y.burn="burnt",Y.cancel="canceled",Y.claim="claimed",Y.deploy="deployed",Y.deposit="deposited",Y.execute="executed",Y.mint="minted",Y.receive="received",Y.repay="repaid",Y.send="sent",Y.sell="sold",Y.stake="staked",Y.trade="swapped",Y.unstake="unstaked",Y.withdraw="withdrawn";const F=e`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var P=function(t,e,r,i){var n,s=arguments.length,a=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(s<3?n(a):s>3?n(e,r,a):n(e,r))||a);return s>3&&a&&Object.defineProperty(e,r,a),a};let L=class extends r{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,e]=this.images,r="NFT"===t?.type,n=r?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",s=(e?.url?"NFT"===e.type:r)?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`\n    --local-left-border-radius: ${n};\n    --local-right-border-radius: ${s};\n    `,i`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,e]=this.images,r=t?.type;return 2===this.images.length&&(t?.url||e?.url)?i`<div class="swap-images-container">
        ${t?.url?i`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${e?.url?i`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?i`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:"NFT"===r?i`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:i`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t,e="accent-100";return t=this.getIcon(),this.status&&(e=this.getStatusColor()),t?i`
      <wui-icon-box
        size="xxs"
        iconColor=${e}
        backgroundColor=${e}
        background="opaque"
        icon=${t}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():"trade"===this.type?"swapHorizontalBold":"approve"===this.type?"checkmark":"cancel"===this.type?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};L.styles=[F],P([h()],L.prototype,"type",void 0),P([h()],L.prototype,"status",void 0),P([h()],L.prototype,"direction",void 0),P([h({type:Boolean})],L.prototype,"onlyDirectionIcon",void 0),P([h({type:Array})],L.prototype,"images",void 0),P([h({type:Object})],L.prototype,"secondImage",void 0),L=P([m("wui-transaction-visual")],L);const H=e`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var z=function(t,e,r,i){var n,s=arguments.length,a=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(s<3?n(a):s>3?n(e,r,a):n(e,r))||a);return s>3&&a&&Object.defineProperty(e,r,a),a};let E=class extends r{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return i`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${y(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${y(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${B[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){const t=this.descriptions?.[0];return t?i`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){const t=this.descriptions?.[1];return t?i`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};E.styles=[n,H],z([h()],E.prototype,"type",void 0),z([h({type:Array})],E.prototype,"descriptions",void 0),z([h()],E.prototype,"date",void 0),z([h({type:Boolean})],E.prototype,"onlyDirectionIcon",void 0),z([h()],E.prototype,"status",void 0),z([h()],E.prototype,"direction",void 0),z([h({type:Array})],E.prototype,"images",void 0),z([h({type:Array})],E.prototype,"price",void 0),z([h({type:Array})],E.prototype,"amount",void 0),z([h({type:Array})],E.prototype,"symbol",void 0),E=z([m("wui-transaction-list-item")],E);const U=e`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;let W=class extends r{render(){return i`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};W.styles=[n,U],W=function(t,e,r,i){var n,s=arguments.length,a=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(s<3?n(a):s>3?n(e,r,a):n(e,r))||a);return s>3&&a&&Object.defineProperty(e,r,a),a}([m("wui-transaction-list-item-loader")],W);const J=e`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var V=function(t,e,r,i){var n,s=arguments.length,a=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(s<3?n(a):s>3?n(e,r,a):n(e,r))||a);return s>3&&a&&Object.defineProperty(e,r,a),a};const q="last-transaction";let G=class extends r{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=s.state.activeCaipAddress,this.transactionsByYear=a.state.transactionsByYear,this.loading=a.state.loading,this.empty=a.state.empty,this.next=a.state.next,a.clearCursor(),this.unsubscribe.push(s.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(a.resetTransactions(),a.fetchTransactions(t)),this.caipAddress=t}),s.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),a.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return i` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){a.resetTransactions(),this.caipAddress&&a.fetchTransactions(o.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(t=>{const e=parseInt(t,10),r=new Array(12).fill(null).map((t,r)=>{const i=N.getTransactionGroupTitle(e,r),n=this.transactionsByYear[e]?.[r];return{groupTitle:i,transactions:n}}).filter(({transactions:t})=>t).reverse();return r.map(({groupTitle:t,transactions:e},n)=>{const s=n===r.length-1;return e?i`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${s?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${t}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(e,s)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,e){const{date:r,descriptions:n,direction:s,isAllNFT:a,images:o,status:c,transfers:u,type:l}=this.getTransactionListItemProps(t),d=u?.length>1;return 2===u?.length&&!a?i`
        <wui-transaction-list-item
          date=${r}
          .direction=${s}
          id=${e&&this.next?q:""}
          status=${c}
          type=${l}
          .images=${o}
          .descriptions=${n}
        ></wui-transaction-list-item>
      `:d?u.map((t,n)=>{const s=N.getTransferDescription(t),a=e&&n===u.length-1;return i` <wui-transaction-list-item
          date=${r}
          direction=${t.direction}
          id=${a&&this.next?q:""}
          status=${c}
          type=${l}
          .onlyDirectionIcon=${!0}
          .images=${[o[n]]}
          .descriptions=${[s]}
        ></wui-transaction-list-item>`}):i`
      <wui-transaction-list-item
        date=${r}
        .direction=${s}
        id=${e&&this.next?q:""}
        status=${c}
        type=${l}
        .images=${o}
        .descriptions=${n}
      ></wui-transaction-list-item>
    `}templateTransactions(t,e){return t.map((r,n)=>{const s=e&&n===t.length-1;return i`${this.templateRenderTransaction(r,s)}`})}emptyStateActivity(){return i`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return i`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return"account"===this.page?i`${this.emptyStateAccount()}`:i`${this.emptyStateActivity()}`}templateLoading(){return"activity"===this.page?Array(7).fill(i` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){c.push("WalletReceive")}createPaginationObserver(){const{projectId:t}=u.state;this.paginationObserver=new IntersectionObserver(([e])=>{e?.isIntersecting&&!this.loading&&(a.fetchTransactions(o.getPlainAddress(this.caipAddress)),l.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:o.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:d(s.state.activeChain)===p.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();const t=this.shadowRoot?.querySelector(`#${q}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){const e=C.formatDate(t?.metadata?.minedAt),r=N.getTransactionDescriptions(t),i=t?.transfers,n=t?.transfers?.[0],s=Boolean(n)&&t?.transfers?.every(t=>Boolean(t.nft_info)),a=N.getTransactionImages(i);return{date:e,direction:n?.direction,descriptions:r,isAllNFT:s,images:a,status:t.metadata?.status,transfers:i,type:t.metadata?.operationType}}};G.styles=J,V([h()],G.prototype,"page",void 0),V([f()],G.prototype,"caipAddress",void 0),V([f()],G.prototype,"transactionsByYear",void 0),V([f()],G.prototype,"loading",void 0),V([f()],G.prototype,"empty",void 0),V([f()],G.prototype,"next",void 0),G=V([m("w3m-activity-list")],G);
