import{aH as t,b3 as e,b7 as i,b8 as r,b4 as n,bj as a,jd as s,bl as o,bc as u,dO as l,bg as c,bh as d,bi as p}from"./DvO0AinD.js";import{n as h,r as f}from"./B_ot7u58.js";import{U as g,c as m}from"./Bo-PKsy5.js";import"./DCLEmx3U.js";import"./DUIMwiBp.js";import{o as v}from"./4RH0AGma.js";import"./1TgTHKeV.js";import"./BRI2zjzy.js";import"./DNhRgnSN.js";var y,w={exports:{}};const x=t((y||(y=1,w.exports=function(){var t=1e3,e=6e4,i=36e5,r="millisecond",n="second",a="minute",s="hour",o="day",u="week",l="month",c="quarter",d="year",p="date",h="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,g=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],i=t%100;return"["+t+(e[(i-20)%10]||e[i]||e[0])+"]"}},v=function(t,e,i){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(i)+t},y={s:v,z:function(t){var e=-t.utcOffset(),i=Math.abs(e),r=Math.floor(i/60),n=i%60;return(e<=0?"+":"-")+v(r,2,"0")+":"+v(n,2,"0")},m:function t(e,i){if(e.date()<i.date())return-t(i,e);var r=12*(i.year()-e.year())+(i.month()-e.month()),n=e.clone().add(r,l),a=i-n<0,s=e.clone().add(r+(a?-1:1),l);return+(-(r+(i-n)/(a?n-s:s-n))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:l,y:d,w:u,d:o,D:p,h:s,m:a,s:n,ms:r,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},w="en",x={};x[w]=m;var b="$isDayjsObject",$=function(t){return t instanceof S||!(!t||!t[b])},T=function t(e,i,r){var n;if(!e)return w;if("string"==typeof e){var a=e.toLowerCase();x[a]&&(n=a),i&&(x[a]=i,n=a);var s=e.split("-");if(!n&&s.length>1)return t(s[0])}else{var o=e.name;x[o]=e,n=o}return!r&&n&&(w=n),n||!r&&w},D=function(t,e){if($(t))return t.clone();var i="object"==typeof e?e:{};return i.date=t,i.args=arguments,new S(i)},M=y;M.l=T,M.i=$,M.w=function(t,e){return D(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function m(t){this.$L=T(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[b]=!0}var v=m.prototype;return v.parse=function(t){this.$d=function(t){var e=t.date,i=t.utc;if(null===e)return new Date(NaN);if(M.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(f);if(r){var n=r[2]-1||0,a=(r[7]||"0").substring(0,3);return i?new Date(Date.UTC(r[1],n,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)):new Date(r[1],n,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)}}return new Date(e)}(t),this.init()},v.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},v.$utils=function(){return M},v.isValid=function(){return!(this.$d.toString()===h)},v.isSame=function(t,e){var i=D(t);return this.startOf(e)<=i&&i<=this.endOf(e)},v.isAfter=function(t,e){return D(t)<this.startOf(e)},v.isBefore=function(t,e){return this.endOf(e)<D(t)},v.$g=function(t,e,i){return M.u(t)?this[e]:this.set(i,t)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(t,e){var i=this,r=!!M.u(e)||e,c=M.p(t),h=function(t,e){var n=M.w(i.$u?Date.UTC(i.$y,e,t):new Date(i.$y,e,t),i);return r?n:n.endOf(o)},f=function(t,e){return M.w(i.toDate()[t].apply(i.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),i)},g=this.$W,m=this.$M,v=this.$D,y="set"+(this.$u?"UTC":"");switch(c){case d:return r?h(1,0):h(31,11);case l:return r?h(1,m):h(0,m+1);case u:var w=this.$locale().weekStart||0,x=(g<w?g+7:g)-w;return h(r?v-x:v+(6-x),m);case o:case p:return f(y+"Hours",0);case s:return f(y+"Minutes",1);case a:return f(y+"Seconds",2);case n:return f(y+"Milliseconds",3);default:return this.clone()}},v.endOf=function(t){return this.startOf(t,!1)},v.$set=function(t,e){var i,u=M.p(t),c="set"+(this.$u?"UTC":""),h=(i={},i[o]=c+"Date",i[p]=c+"Date",i[l]=c+"Month",i[d]=c+"FullYear",i[s]=c+"Hours",i[a]=c+"Minutes",i[n]=c+"Seconds",i[r]=c+"Milliseconds",i)[u],f=u===o?this.$D+(e-this.$W):e;if(u===l||u===d){var g=this.clone().set(p,1);g.$d[h](f),g.init(),this.$d=g.set(p,Math.min(this.$D,g.daysInMonth())).$d}else h&&this.$d[h](f);return this.init(),this},v.set=function(t,e){return this.clone().$set(t,e)},v.get=function(t){return this[M.p(t)]()},v.add=function(r,c){var p,h=this;r=Number(r);var f=M.p(c),g=function(t){var e=D(h);return M.w(e.date(e.date()+Math.round(t*r)),h)};if(f===l)return this.set(l,this.$M+r);if(f===d)return this.set(d,this.$y+r);if(f===o)return g(1);if(f===u)return g(7);var m=(p={},p[a]=e,p[s]=i,p[n]=t,p)[f]||1,v=this.$d.getTime()+r*m;return M.w(v,this)},v.subtract=function(t,e){return this.add(-1*t,e)},v.format=function(t){var e=this,i=this.$locale();if(!this.isValid())return i.invalidDate||h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",n=M.z(this),a=this.$H,s=this.$m,o=this.$M,u=i.weekdays,l=i.months,c=i.meridiem,d=function(t,i,n,a){return t&&(t[i]||t(e,r))||n[i].slice(0,a)},p=function(t){return M.s(a%12||12,t,"0")},f=c||function(t,e,i){var r=t<12?"AM":"PM";return i?r.toLowerCase():r};return r.replace(g,function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return M.s(e.$y,4,"0");case"M":return o+1;case"MM":return M.s(o+1,2,"0");case"MMM":return d(i.monthsShort,o,l,3);case"MMMM":return d(l,o);case"D":return e.$D;case"DD":return M.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return d(i.weekdaysMin,e.$W,u,2);case"ddd":return d(i.weekdaysShort,e.$W,u,3);case"dddd":return u[e.$W];case"H":return String(a);case"HH":return M.s(a,2,"0");case"h":return p(1);case"hh":return p(2);case"a":return f(a,s,!0);case"A":return f(a,s,!1);case"m":return String(s);case"mm":return M.s(s,2,"0");case"s":return String(e.$s);case"ss":return M.s(e.$s,2,"0");case"SSS":return M.s(e.$ms,3,"0");case"Z":return n}return null}(t)||n.replace(":","")})},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(r,p,h){var f,g=this,m=M.p(p),v=D(r),y=(v.utcOffset()-this.utcOffset())*e,w=this-v,x=function(){return M.m(g,v)};switch(m){case d:f=x()/12;break;case l:f=x();break;case c:f=x()/3;break;case u:f=(w-y)/6048e5;break;case o:f=(w-y)/864e5;break;case s:f=w/i;break;case a:f=w/e;break;case n:f=w/t;break;default:f=w}return h?f:M.a(f)},v.daysInMonth=function(){return this.endOf(l).$D},v.$locale=function(){return x[this.$L]},v.locale=function(t,e){if(!t)return this.$L;var i=this.clone(),r=T(t,e,!0);return r&&(i.$L=r),i},v.clone=function(){return M.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},m}(),O=S.prototype;return D.prototype=O,[["$ms",r],["$s",n],["$m",a],["$H",s],["$W",o],["$M",l],["$y",d],["$D",p]].forEach(function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}}),D.extend=function(t,e){return t.$i||(t(e,S,D),t.$i=!0),D},D.locale=T,D.isDayjs=$,D.unix=function(t){return D(1e3*t)},D.en=x[w],D.Ls=x,D.p={},D}()),w.exports));var b,$={exports:{}};const T=t(b?$.exports:(b=1,$.exports={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],i=t%100;return"["+t+(e[(i-20)%10]||e[i]||e[0])+"]"}}));var D,M={exports:{}};const S=t(D?M.exports:(D=1,M.exports=function(t,e,i){t=t||{};var r=e.prototype,n={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function a(t,e,i,n){return r.fromToBase(t,e,i,n)}i.en.relativeTime=n,r.fromToBase=function(e,r,a,s,o){for(var u,l,c,d=a.$locale().relativeTime||n,p=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],h=p.length,f=0;f<h;f+=1){var g=p[f];g.d&&(u=s?i(e).diff(a,g.d,!0):a.diff(e,g.d,!0));var m=(t.rounding||Math.round)(Math.abs(u));if(c=u>0,m<=g.r||!g.r){m<=1&&f>0&&(g=p[f-1]);var v=d[g.l];o&&(m=o(""+m)),l="string"==typeof v?v.replace("%d",m):v(m,r,g.l,c);break}}if(r)return l;var y=c?d.future:d.past;return"function"==typeof y?y(l):y.replace("%s",l)},r.to=function(t,e){return a(t,e,this,!0)},r.from=function(t,e){return a(t,e,this)};var s=function(t){return t.$u?i.utc():i()};r.toNow=function(t){return this.to(s(this),t)},r.fromNow=function(t){return this.from(s(this),t)}}));var O,_={exports:{}};const A=t(O?_.exports:(O=1,_.exports=function(t,e,i){i.updateLocale=function(t,e){var r=i.Ls[t];if(r)return(e?Object.keys(e):[]).forEach(function(t){r[t]=e[t]}),r}}));x.extend(S),x.extend(A);const I={...T,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},k=["January","February","March","April","May","June","July","August","September","October","November","December"];x.locale("en-web3-modal",I);const C={getMonthNameByIndex:t=>k[t],getYear:(t=(new Date).toISOString())=>x(t).year(),getRelativeDateFromNow:t=>x(t).locale("en-web3-modal").fromNow(!0),formatDate:(t,e="DD MMM")=>x(t).format(e)},j=["receive","deposit","borrow","claim"],R=["withdraw","repay","burn"],B={getTransactionGroupTitle(t,e){const i=C.getYear(),r=C.getMonthNameByIndex(e);return t===i?r:`${r} ${t}`},getTransactionImages(t){const[e,i]=t,r=Boolean(e)&&(null==t?void 0:t.every(t=>Boolean(t.nft_info))),n=(null==t?void 0:t.length)>1;return 2===(null==t?void 0:t.length)&&!r?[this.getTransactionImage(i),this.getTransactionImage(e)]:n?t.map(t=>this.getTransactionImage(t)):[this.getTransactionImage(e)]},getTransactionImage:t=>({type:B.getTransactionTransferTokenType(t),url:B.getTransactionImageURL(t)}),getTransactionImageURL(t){var e,i,r,n,a;let s;const o=Boolean(null==t?void 0:t.nft_info),u=Boolean(null==t?void 0:t.fungible_info);return t&&o?s=null==(r=null==(i=null==(e=null==t?void 0:t.nft_info)?void 0:e.content)?void 0:i.preview)?void 0:r.url:t&&u&&(s=null==(a=null==(n=null==t?void 0:t.fungible_info)?void 0:n.icon)?void 0:a.url),s},getTransactionTransferTokenType:t=>(null==t?void 0:t.fungible_info)?"FUNGIBLE":(null==t?void 0:t.nft_info)?"NFT":void 0,getTransactionDescriptions(t){var e,i,r;const n=null==(e=null==t?void 0:t.metadata)?void 0:e.operationType,a=null==t?void 0:t.transfers,s=(null==(i=null==t?void 0:t.transfers)?void 0:i.length)>0,o=(null==(r=null==t?void 0:t.transfers)?void 0:r.length)>1,u=s&&(null==a?void 0:a.every(t=>Boolean(null==t?void 0:t.fungible_info))),[l,c]=a;let d=this.getTransferDescription(l),p=this.getTransferDescription(c);if(!s){return("send"===n||"receive"===n)&&u?(d=g.getTruncateString({string:null==t?void 0:t.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),p=g.getTruncateString({string:null==t?void 0:t.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[d,p]):[t.metadata.status]}if(o)return a.map(t=>this.getTransferDescription(t)).reverse();let h="";return j.includes(n)?h="+":R.includes(n)&&(h="-"),d=h.concat(d),[d]},getTransferDescription(t){var e;let i="";return t?((null==t?void 0:t.nft_info)?i=(null==(e=null==t?void 0:t.nft_info)?void 0:e.name)||"-":(null==t?void 0:t.fungible_info)&&(i=this.getFungibleTransferDescription(t)||"-"),i):i},getFungibleTransferDescription(t){var e;if(!t)return null;return[this.getQuantityFixedValue(null==t?void 0:t.quantity.numeric),null==(e=null==t?void 0:t.fungible_info)?void 0:e.symbol].join(" ").trim()},getQuantityFixedValue(t){if(!t)return null;return parseFloat(t).toFixed(3)}};var N,Y;(Y=N||(N={})).approve="approved",Y.bought="bought",Y.borrow="borrowed",Y.burn="burnt",Y.cancel="canceled",Y.claim="claimed",Y.deploy="deployed",Y.deposit="deposited",Y.execute="executed",Y.mint="minted",Y.receive="received",Y.repay="repaid",Y.send="sent",Y.sell="sold",Y.stake="staked",Y.trade="swapped",Y.unstake="unstaked",Y.withdraw="withdrawn";const F=e`
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
`;var P=function(t,e,i,r){var n,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(s=(a<3?n(s):a>3?n(e,i,s):n(e,i))||s);return a>3&&s&&Object.defineProperty(e,i,s),s};let L=class extends i{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,e]=this.images,i="NFT"===(null==t?void 0:t.type),n=i?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",a=((null==e?void 0:e.url)?"NFT"===e.type:i)?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`\n    --local-left-border-radius: ${n};\n    --local-right-border-radius: ${a};\n    `,r`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,e]=this.images,i=null==t?void 0:t.type;return 2===this.images.length&&((null==t?void 0:t.url)||(null==e?void 0:e.url))?r`<div class="swap-images-container">
        ${(null==t?void 0:t.url)?r`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${(null==e?void 0:e.url)?r`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
      </div>`:(null==t?void 0:t.url)?r`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:"NFT"===i?r`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:r`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t,e="accent-100";return t=this.getIcon(),this.status&&(e=this.getStatusColor()),t?r`
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
`;var z=function(t,e,i,r){var n,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(s=(a<3?n(s):a>3?n(e,i,s):n(e,i))||s);return a>3&&s&&Object.defineProperty(e,i,s),s};let U=class extends i{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return r`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${v(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${v(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${N[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){var t;const e=null==(t=this.descriptions)?void 0:t[0];return e?r`
          <wui-text variant="small-500" color="fg-200">
            <span>${e}</span>
          </wui-text>
        `:null}templateSecondDescription(){var t;const e=null==(t=this.descriptions)?void 0:t[1];return e?r`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${e}</span>
          </wui-text>
        `:null}};U.styles=[n,H],z([h()],U.prototype,"type",void 0),z([h({type:Array})],U.prototype,"descriptions",void 0),z([h()],U.prototype,"date",void 0),z([h({type:Boolean})],U.prototype,"onlyDirectionIcon",void 0),z([h()],U.prototype,"status",void 0),z([h()],U.prototype,"direction",void 0),z([h({type:Array})],U.prototype,"images",void 0),z([h({type:Array})],U.prototype,"price",void 0),z([h({type:Array})],U.prototype,"amount",void 0),z([h({type:Array})],U.prototype,"symbol",void 0),U=z([m("wui-transaction-list-item")],U);const E=e`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;let W=class extends i{render(){return r`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};W.styles=[n,E],W=function(t,e,i,r){var n,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(s=(a<3?n(s):a>3?n(e,i,s):n(e,i))||s);return a>3&&s&&Object.defineProperty(e,i,s),s}([m("wui-transaction-list-item-loader")],W);const J=e`
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
`;var V=function(t,e,i,r){var n,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(s=(a<3?n(s):a>3?n(e,i,s):n(e,i))||s);return a>3&&s&&Object.defineProperty(e,i,s),s};const q="last-transaction";let G=class extends i{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=a.state.activeCaipAddress,this.transactionsByYear=s.state.transactionsByYear,this.loading=s.state.loading,this.empty=s.state.empty,this.next=s.state.next,s.clearCursor(),this.unsubscribe.push(a.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(s.resetTransactions(),s.fetchTransactions(t)),this.caipAddress=t}),a.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),s.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return r` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){s.resetTransactions(),this.caipAddress&&s.fetchTransactions(o.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(t=>{const e=parseInt(t,10),i=new Array(12).fill(null).map((t,i)=>{var r;return{groupTitle:B.getTransactionGroupTitle(e,i),transactions:null==(r=this.transactionsByYear[e])?void 0:r[i]}}).filter(({transactions:t})=>t).reverse();return i.map(({groupTitle:t,transactions:e},n)=>{const a=n===i.length-1;return e?r`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${a?"true":"false"}"
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
              ${this.templateTransactions(e,a)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,e){const{date:i,descriptions:n,direction:a,isAllNFT:s,images:o,status:u,transfers:l,type:c}=this.getTransactionListItemProps(t),d=(null==l?void 0:l.length)>1;return 2===(null==l?void 0:l.length)&&!s?r`
        <wui-transaction-list-item
          date=${i}
          .direction=${a}
          id=${e&&this.next?q:""}
          status=${u}
          type=${c}
          .images=${o}
          .descriptions=${n}
        ></wui-transaction-list-item>
      `:d?l.map((t,n)=>{const a=B.getTransferDescription(t),s=e&&n===l.length-1;return r` <wui-transaction-list-item
          date=${i}
          direction=${t.direction}
          id=${s&&this.next?q:""}
          status=${u}
          type=${c}
          .onlyDirectionIcon=${!0}
          .images=${[o[n]]}
          .descriptions=${[a]}
        ></wui-transaction-list-item>`}):r`
      <wui-transaction-list-item
        date=${i}
        .direction=${a}
        id=${e&&this.next?q:""}
        status=${u}
        type=${c}
        .images=${o}
        .descriptions=${n}
      ></wui-transaction-list-item>
    `}templateTransactions(t,e){return t.map((i,n)=>{const a=e&&n===t.length-1;return r`${this.templateRenderTransaction(i,a)}`})}emptyStateActivity(){return r`<wui-flex
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
    </wui-flex>`}emptyStateAccount(){return r`<wui-flex
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
    </wui-flex>`}templateEmpty(){return"account"===this.page?r`${this.emptyStateAccount()}`:r`${this.emptyStateActivity()}`}templateLoading(){return"activity"===this.page?Array(7).fill(r` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){u.push("WalletReceive")}createPaginationObserver(){const{projectId:t}=l.state;this.paginationObserver=new IntersectionObserver(([e])=>{(null==e?void 0:e.isIntersecting)&&!this.loading&&(s.fetchTransactions(o.getPlainAddress(this.caipAddress)),c.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:o.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:d(a.state.activeChain)===p.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){var t,e,i;null==(t=this.paginationObserver)||t.disconnect();const r=null==(e=this.shadowRoot)?void 0:e.querySelector(`#${q}`);r&&(null==(i=this.paginationObserver)||i.observe(r))}getTransactionListItemProps(t){var e,i,r,n,a;const s=C.formatDate(null==(e=null==t?void 0:t.metadata)?void 0:e.minedAt),o=B.getTransactionDescriptions(t),u=null==t?void 0:t.transfers,l=null==(i=null==t?void 0:t.transfers)?void 0:i[0],c=Boolean(l)&&(null==(r=null==t?void 0:t.transfers)?void 0:r.every(t=>Boolean(t.nft_info))),d=B.getTransactionImages(u);return{date:s,direction:null==l?void 0:l.direction,descriptions:o,isAllNFT:c,images:d,status:null==(n=t.metadata)?void 0:n.status,transfers:u,type:null==(a=t.metadata)?void 0:a.operationType}}};G.styles=J,V([h()],G.prototype,"page",void 0),V([f()],G.prototype,"caipAddress",void 0),V([f()],G.prototype,"transactionsByYear",void 0),V([f()],G.prototype,"loading",void 0),V([f()],G.prototype,"empty",void 0),V([f()],G.prototype,"next",void 0),G=V([m("w3m-activity-list")],G);
