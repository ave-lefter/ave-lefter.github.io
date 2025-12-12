import { promisify } from "es6-promisify";
import { ethers } from "ethers";
import { soliditySha3 } from "../helpers";
import { createTypedSignature, SignatureTypes, SigningMethod, stripHexPrefix } from "./helpers";

export class Signer {
  web3: any;

  // ============ Constructor ============
  constructor(web3: any) {
    this.web3 = web3;
  }
  // ============ Functions ============
  /**
   * Returns a signable EIP712 Hash of a struct
   */
  getEIP712Hash(structHash: any): any {
    const hash = soliditySha3(
      { type: "bytes2", value: "0x1901" },
      { type: "bytes32", value: this.getDomainHash() },
      { type: "bytes32", value: structHash },
    );
    // Non-null assertion operator is safe, hash is null only on empty input.
    return hash;
  }
  getDomainHash(): any {
    // Implemented in subclass
    return null;
  }
  async ethSignTypedDataInternal(signer: any, data: any, signingMethod: any) {
    let rpcMethod;
    let rpcData;
    let provider = this.web3.currentProvider;
    if (provider === null) {
      throw new Error("Cannot sign since Web3 currentProvider is null");
    }
    if (typeof provider === "string") {
      throw new Error("Cannot sign since Web3 currentProvider is a string");
    }
    provider = provider;
    let sendAsync;
    switch (signingMethod) {
      case SigningMethod.TypedData:
        sendAsync = promisify(provider.send).bind(provider);
        rpcMethod = "eth_signTypedData";
        rpcData = data;
        break;
      case SigningMethod.MetaMask:
        sendAsync = promisify(provider.sendAsync).bind(provider);
        rpcMethod = "eth_signTypedData_v3";
        rpcData = JSON.stringify(data);
        break;
      case SigningMethod.MetaMaskLatest:
        sendAsync = promisify(provider.sendAsync).bind(provider);
        rpcMethod = "eth_signTypedData_v4";
        rpcData = JSON.stringify(data);
        break;
      case SigningMethod.CoinbaseWallet:
        sendAsync = promisify(provider.sendAsync).bind(provider);
        rpcMethod = "eth_signTypedData_v4";
        rpcData = data;
        break;
      default:
        throw new Error(`Invalid signing method ${signingMethod}`);
    }
    let response;
    if (provider?.isParticleNetwork) {
      response = await provider.request({
        method: "eth_signTypedData_v4_uniq",
        params: [signer, rpcData],
        jsonrpc: "2.0",
        id: Date.now(),
      });
    } else {
      response = await sendAsync({
        method: rpcMethod,
        params: [signer, rpcData],
        jsonrpc: "2.0",
        id: Date.now(),
      });
    }
    console.log("response", response);
    const res =
      typeof response == "string" ? { error: null, result: `${response}`.slice(2, 132) } : response;
    if (res.error) {
      throw new Error(res.error.message);
    }
    return `0x${stripHexPrefix(res.result)}0${SignatureTypes.NO_PREPEND}`;
  }
  /**
   * Sign a message with `personal_sign`.
   */
  async ethSignPersonalInternal(signer: any, message: any) {
    let provider = this.web3.currentProvider;
    if (provider === null) {
      throw new Error("Cannot sign since Web3 currentProvider is null");
    }
    if (typeof provider === "string") {
      throw new Error("Cannot sign since Web3 currentProvider is a string");
    }
    provider = provider;
    const sendAsync = promisify(provider.sendAsync || provider.send).bind(provider);
    const rpcMethod = "personal_sign";
    let response;
    try {
      if (provider?.isParticleNetwork) {
        // @ts-ignore
        const signature = provider?.auth?.userInfo()?.signature;
        if (!signature) {
          response = await provider?.request({
            method: "personal_sign_uniq",
            params: [
              `XXXX\naction: XXXX Onboarding\nonlySignOn: https://pro.xxxx.exchange`,
              signer,
            ],
            jsonrpc: "2.0",
            id: Date.now(),
          });
        } else {
          response = {
            result: signature,
          };
        }
      } else {
        response = await sendAsync({
          method: rpcMethod,
          params: [message, signer],
          jsonrpc: "2.0",
          id: Date.now(),
        });
      }
      console.log("response", response);
    } catch (e) {
      console.log("eee", e);
    }
    console.log("provider", provider);
    const signedMsg = response?.result ? response?.result : response;
    const verifiedAddress = ethers.utils.verifyMessage(message, signedMsg);
    let ifValid = false;
    if (provider.isParticleNetwork) {
      // todo 验证
      ifValid = true;
    } else {
      ifValid = verifiedAddress?.toLowerCase() === signer?.toLowerCase();
    }
    if (!ifValid) {
      throw new Error("Invalid signature");
    }
    const res =
      typeof response == "string" ? { error: null, result: `${response}`.slice(2, 132) } : response;
    console.log("res", res);
    if (res?.error) {
      throw new Error(res.error.message);
    }
    const kL2KeyHashProd = "0x3978602b67f89ae820dcc57869dfab215c0a48f7510d95baef4cef262ad38350";
    const kL2KeyHashTestnet = "0x0be1ca974483d76bfb1b0b934b192f880e1e64c4872bfe471402337a70736366";
    // const kL2KeyHash = isProd ? kL2KeyHashProd : kL2KeyHashTestnet;
    const kL2KeyHash = 1 ? kL2KeyHashProd : kL2KeyHashTestnet;
    const bytes = ethers.utils.toUtf8Bytes(message);
    const personalSignMessageHash = ethers.utils.sha256(bytes);
    if (
      !provider?.isParticleNetwork &&
      !ethers.BigNumber.from(personalSignMessageHash).eq(kL2KeyHash)
    ) {
      throw new Error("personal_sign content hash mismatch");
    }
    // Note: Using createTypedSignature() fixes the signature `v` value.
    return {
      value: createTypedSignature(res?.result, SignatureTypes.PERSONAL),
      l2KeyHash: personalSignMessageHash,
    };
  }
}
