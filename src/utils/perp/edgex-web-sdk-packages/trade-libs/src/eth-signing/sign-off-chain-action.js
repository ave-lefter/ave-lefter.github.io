import { keys, pick } from "@edgex/utils";
import BigNumber from "bignumber.js";
import * as ethers from "ethers";
import { soliditySha3 } from "../helpers";
import {
  addressesAreEqual,
  createTypedSignature,
  ecRecoverTypedSignature,
  EIP712_DOMAIN_STRING_NO_CONTRACT,
  EIP712_DOMAIN_STRUCT_NO_CONTRACT,
  hashString,
  SignatureTypes,
  SigningMethod,
  stripHexPrefix,
} from "./helpers";
import { Signer } from "./signer";

// IMPORTANT: The order of these params affects the message signed with SigningMethod.PERSONAL.
//            The message should not be changed at all since it's used to generated default keys.
const PERSONAL_SIGN_DOMAIN_PARAMS = ["name", "version", "chainId"];
export class SignOffChainAction extends Signer {
  networkId: any;
  actionStruct: any;
  domain: string;
  version: string;

  constructor(
    web3: any,
    networkId: any,
    actionStruct: any,
    { domain = "XXXX", version = "1.0" } = {},
  ) {
    super(web3);
    this.networkId = networkId;
    this.actionStruct = actionStruct;
    this.domain = domain;
    this.version = version;
  }
  getHash(message: any): any {
    // Implemented in subclass
    return null;
  }
  async sign(signer: any, signingMethod: any, message: any, way?: any) {
    // If the address is in the wallet, sign with it so we don't have to use the web3 provider.
    const walletAccount =
      // Hack: The TypeScript type incorrectly has index signature on number but not string.
      this.web3.eth.accounts.wallet[signer];
    switch (signingMethod) {
      case SigningMethod.Hash:
      case SigningMethod.UnsafeHash:
      case SigningMethod.Compatibility: {
        const hash = this.getHash(message);
        const rawSignature = walletAccount
          ? walletAccount.sign(hash).signature
          : await this.web3.eth.sign(hash, signer);
        const hashSig = createTypedSignature(rawSignature, SignatureTypes.DECIMAL);
        if (signingMethod === SigningMethod.Hash) {
          return hashSig;
        }
        const unsafeHashSig = createTypedSignature(rawSignature, SignatureTypes.NO_PREPEND);
        if (signingMethod === SigningMethod.UnsafeHash) {
          return unsafeHashSig;
        }
        if (this.verify(unsafeHashSig, signer, message)) {
          return unsafeHashSig;
        }
        return hashSig;
      }
      // @ts-ignore Fallthrough case in switch.
      case SigningMethod.TypedData:
        // If the private key is available locally, sign locally without using web3.
        if (walletAccount?.privateKey) {
          const wallet = new ethers.Wallet(walletAccount.privateKey);
          const rawSignature = await wallet._signTypedData(
            this.getDomainData(),
            { [this.domain]: this.actionStruct },
            message,
          );
          return createTypedSignature(rawSignature, SignatureTypes.NO_PREPEND);
        }
      /* falls through */
      case SigningMethod.MetaMask:
      case SigningMethod.MetaMaskLatest:
      case SigningMethod.CoinbaseWallet: {
        let data = {
          types: {
            EIP712Domain: EIP712_DOMAIN_STRUCT_NO_CONTRACT,
            [this.domain]: this.actionStruct,
          },
          domain: this.getDomainData(),
          primaryType: this.domain,
          message,
        };
        let msg = message;
        data.types[this.domain].length = 2;
        if (msg.nonce) {
          data.types[this.domain].push({ type: "string", name: "nonce" });
        }
        console.log("data", data);
        const signature = await this.ethSignTypedDataInternal(signer, data, signingMethod);
        return signature;
      }
      case SigningMethod.Personal: {
        const messageString = this.getPersonalSignMessage(message);
        const sig = this.ethSignPersonalInternal(signer, messageString);
        return sig;
      }
      case SigningMethod.Personal2: {
        let messageString = this.getPersonalSignMessage(message);
        // 生成starkKey 把chainId变更为envId
        const sig = this.ethSignPersonalInternal(signer, messageString.replace("chainId", "envId"));
        return sig;
      }
      default:
        throw new Error(`Invalid signing method ${signingMethod}`);
    }
  }
  verify(typedSignature: any, expectedSigner: any, message: any) {
    if (stripHexPrefix(typedSignature).length !== 66 * 2) {
      throw new Error(`Unable to verify signature with invalid length: ${typedSignature}`);
    }
    const sigType = parseInt(typedSignature.slice(-2), 16);
    let hashOrMessage;
    switch (sigType) {
      case SignatureTypes.NO_PREPEND:
      case SignatureTypes.DECIMAL:
      case SignatureTypes.HEXADECIMAL:
        hashOrMessage = this.getHash(message);
        break;
      case SignatureTypes.PERSONAL:
        hashOrMessage = this.getPersonalSignMessage(message);
        break;
      default:
        throw new Error(`Invalid signature type: ${sigType}`);
    }
    const signer = ecRecoverTypedSignature(hashOrMessage, typedSignature);
    return addressesAreEqual(signer, expectedSigner);
  }
  /**
   * Get the message string to be signed when using SignatureTypes.PERSONAL.
   *
   * This signing method may be used in cases where EIP-712 signing is not possible.
   */
  getPersonalSignMessage(message: any) {
    // Make sure the output is deterministic for a given input.
    const json = JSON.stringify(
      {
        ...pick(this.getDomainData(), PERSONAL_SIGN_DOMAIN_PARAMS as any[]),
        ...pick(message, keys(message).sort()),
      },
      null,
      2,
    );
    return json
      .replace("{\n", "")
      .replace("\n}", "")
      .replace(/"/g, "")
      .replace(/\s+/g, "")
      .replace(/:/g, `: `)
      .replace(/,/g, `\n`)
      .replace("L2Key", "L2 Key")
      .replace("https: //", "https://");
  }
  getDomainHash() {
    const hash = soliditySha3(
      { type: "bytes32", value: hashString(EIP712_DOMAIN_STRING_NO_CONTRACT) },
      { type: "bytes32", value: hashString(this.domain) },
      { type: "bytes32", value: hashString(this.version) },
      { type: "uint256", value: new BigNumber(this.networkId).toFixed(0) },
    );
    // Non-null assertion operator is safe, hash is null only on empty input.
    return hash;
  }
  getDomainData() {
    return {
      name: this.domain,
      version: this.version,
      chainId: this.networkId,
    };
  }
}
