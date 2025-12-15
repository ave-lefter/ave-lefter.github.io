import { soliditySha3 } from "../helpers";
import { hashString } from "./helpers";
import { SignOffChainAction } from "./sign-off-chain-action";

const EIP712_ETH_PRIVATE_ACTION_STRUCT = [
  { type: "string", name: "method" },
  { type: "string", name: "requestPath" },
  { type: "string", name: "body" },
  { type: "string", name: "timestamp" },
];
const EIP712_ETH_PRIVATE_ACTION_STRUCT_STRING =
  "xxxx(" + "string method," + "string requestPath," + "string body," + "string timestamp" + ")";
export class SignEthPrivateAction extends SignOffChainAction {
  constructor(web3: any, networkId: any) {
    super(web3, networkId, EIP712_ETH_PRIVATE_ACTION_STRUCT);
  }
  getHash(message: any) {
    const structHash = soliditySha3(
      { type: "bytes32", value: hashString(EIP712_ETH_PRIVATE_ACTION_STRUCT_STRING) },
      { type: "bytes32", value: hashString(message.method) },
      { type: "bytes32", value: hashString(message.requestPath) },
      { type: "bytes32", value: hashString(message.body) },
      { type: "bytes32", value: hashString(message.timestamp) },
    );
    // Non-null assertion operator is safe, hash is null only on empty input.
    return this.getEIP712Hash(structHash);
  }
}
