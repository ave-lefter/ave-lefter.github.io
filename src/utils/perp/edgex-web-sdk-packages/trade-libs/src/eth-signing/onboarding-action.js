/**
 * Signatures on static messages for onboarding.
 *
 * These are used during onboarding. The signature must be deterministic based on the Ethereum key
 * because the signatures will be used for key derivation, and the keys should be recoverable:
 *   - The onboarding signature is used to derive the default API credentials, on the server.
 *   - The key derivation signature is used by the frontend app to derive the STARK key pair.
 *     Programmatic traders may optionally derive their STARK key pair in the same way.
 */
import { soliditySha3 } from "../helpers";
import { hashString } from "./helpers";
import { SignOffChainAction } from "./sign-off-chain-action";

// On mainnet, include an extra onlySignOn parameter.
const EIP712_ONBOARDING_ACTION_STRUCT = [
  { type: "string", name: "action" },
  { type: "string", name: "onlySignOn" },
];
const EIP712_ONBOARDING_ACTION_STRUCT_STRING =
  "xxxx(" + "string action," + "string onlySignOn" + ")";
export class SignOnboardingAction extends SignOffChainAction {
  constructor(web3: any, networkId: any) {
    // On mainnet, include an extra onlySignOn parameter.
    const eip712Struct =
      networkId === 1 ? EIP712_ONBOARDING_ACTION_STRUCT : EIP712_ONBOARDING_ACTION_STRUCT;
    super(web3, networkId, eip712Struct);
  }
  getHash(message: any) {
    // On mainnet, include an extra onlySignOn parameter.
    const eip712StructString =
      this.networkId === 1
        ? EIP712_ONBOARDING_ACTION_STRUCT_STRING
        : EIP712_ONBOARDING_ACTION_STRUCT_STRING;
    const data = [
      { type: "bytes32", value: hashString(eip712StructString) },
      { type: "bytes32", value: hashString(message.action) },
    ];
    // On mainnet, include an extra onlySignOn parameter.
    if (this.networkId === 1) {
      if (!message.onlySignOn) {
        throw new Error("The onlySignOn is required when onboarding to mainnet");
      }
      data.push({ type: "bytes32", value: hashString(message.onlySignOn) });
    } else if (message.onlySignOn) {
      throw new Error("Unexpected onlySignOn when signing for non-mainnet network");
    }
    const structHash = soliditySha3(...data);
    // Non-null assertion operator is safe, hash is null only on empty input.
    return this.getEIP712Hash(structHash);
  }
}
