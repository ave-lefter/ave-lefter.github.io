import{a_ as t,b2 as e,b3 as i}from"#entry";import{c as r}from"./DExhYf3k.js";import"./YbxK9URj.js";import"./BmyCbnts.js";import"./Dh00O0bS.js";import"./BbkVj9z_.js";import"./CqsZNpmy.js";import"./DQliy7QU.js";import"./DJ4s7H4Z.js";import"./CVhMdH8L.js";import"./CQhv4qkZ.js";const o=t`
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
    `}};s.styles=o,s=function(t,e,i,r){var o,s=arguments.length,l=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(l=(s<3?o(l):s>3?o(e,i,l):o(e,i))||l);return s>3&&l&&Object.defineProperty(e,i,l),l}([r("w3m-transactions-view")],s);export{s as W3mTransactionsView};
