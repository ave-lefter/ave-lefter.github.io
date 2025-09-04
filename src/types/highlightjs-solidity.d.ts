declare module 'highlightjs-solidity' {
  import { HLJSApi, Language } from 'highlight.js'

  /**
   * Solidity language definition for Highlight.js
   *
   * Example usage:
   *
   * ```ts
   * import hljs from "highlight.js/lib/core";
   * import solidity from "highlightjs-solidity";
   *
   * hljs.registerLanguage("solidity", solidity);
   * ```
   */
  export default function hljsDefineSolidity(hljs: HLJSApi): Language
}
