import{bq as t,bu as e,bv as i}from"./D6y-ViDA.js";import{c as r}from"./BqICjlzW.js";import"./XduSbf5i.js";import"./8ReBD8jy.js";import"./DheuQlak.js";import"./DbAB4eZS.js";import"./CevG08QP.js";import"./bcgGgrN2.js";import"./C1IbZtR7.js";import"./Bnk68-zm.js";import"./D6omKXlF.js";const o=t`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;let s=class extends e{render(){return i`
      <wui-flex flexDirection="column" .padding=${["0","m","m","m"]} gap="s">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};s.styles=o,s=function(t,e,i,r){var o,s=arguments.length,l=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(o=t[c])&&(l=(s<3?o(l):s>3?o(e,i,l):o(e,i))||l);return s>3&&l&&Object.defineProperty(e,i,l),l}([r("w3m-transactions-view")],s);export{s as W3mTransactionsView};
