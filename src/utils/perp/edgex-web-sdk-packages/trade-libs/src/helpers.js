import { Buffer } from "buffer";
import { isNil } from "@edgex/utils";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import { ethers } from "ethers";
import queryString from "query-string";
import { starkEc } from "./lib/starkware";

/**
 * 将 Web3.utils.soliditySha3 参数转换为 Ethers.js 的格式
 *
 * @param {...Object} args 包含类型和值的对象数组
 * @return {String} 返回 keccak256 哈希值
 */
export function soliditySha3(...args) {
  const types = args.map((arg) => arg.type);
  const values = args.map((arg) => {
    const value = arg.value;
    if (arg.type === "uint256" && BigNumber.isBigNumber(value)) {
      // BigNumber 格式化为十进制字符串
      return value.toFixed();
    } else if (arg.type === "bytes32" && typeof value === "string") {
      // 如果是字符串，确保它是十六进制格式
      return ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(value)), 32);
    }
    return value;
  });
  console.log("soliditySha3, ", args, types, values);

  // ethers
  const packed = ethers.utils.solidityPack(types, values);
  return ethers.utils.keccak256(packed);
}

/**
 * Normalize to a lowercase 32-byte hex string without 0x prefix.
 */
function normalizeHex32(hex) {
  const paddedHex = stripHexPrefix(hex).toLowerCase().padStart(64, "0");
  if (paddedHex.length !== 64) {
    throw new Error("normalizeHex32: Input does not fit in 32 bytes");
  }
  return paddedHex;
}
export function bnToHex32(bn) {
  return normalizeHex32(bn.toString(16));
}
export function asSimpleKeyPair(ecKeyPair) {
  const ecPrivateKey = ecKeyPair.getPrivate();
  if (isNil(ecPrivateKey)) {
    throw new Error("asSimpleKeyPair: Key pair has no private key");
  }
  const ecPublicKey = ecKeyPair.getPublic();
  return {
    publicKey: bnToHex32(ecPublicKey.getX()),
    publicKeyYCoordinate: bnToHex32(ecPublicKey.getY()),
    privateKey: bnToHex32(ecPrivateKey),
  };
}
export function hexToBn(hex) {
  return new BN(stripHexPrefix(hex), 16);
}

export function asEcKeyPair(privateKeyOrKeyPair) {
  const privateKey =
    typeof privateKeyOrKeyPair === "string" ? privateKeyOrKeyPair : privateKeyOrKeyPair.privateKey;
  return starkEc.keyFromPrivate(normalizeHex32(privateKey));
}
export function stripHexPrefix(input) {
  if (input.indexOf("0x") === 0) {
    return input.substr(2);
  }
  return input;
}
export function keyPairFromData(data) {
  if (data.length === 0) {
    throw new Error("keyPairFromData: Empty buffer");
  }
  const hashedData = keccak256(data);
  const hashBN = hexToBn(Buffer.from(hashedData).toString("hex"));
  const privateKey = hashBN.iushrn(5).toString("hex"); // Remove the last five bits.
  return asSimpleKeyPair(asEcKeyPair(privateKey));
}
// export function soliditySha3(str) {
//   if (!str) {
//     throw new Error("soliditySha3: Empty string");
//   }
//   const hash = soliditySha3({ t: "string", v: str });
//   return hash;
// }
export function fixRawSignature(signature) {
  const stripped = stripHexPrefix(signature);
  if (stripped.length !== 130) {
    throw new Error(`Invalid raw signature: ${signature}`);
  }
  const rs = stripped.substr(0, 128);
  const v = stripped.substr(128, 2);
  switch (v) {
    case "00":
      return `0x${rs}1b`;
    case "01":
      return `0x${rs}1c`;
    case "1b":
    case "1c":
      return `0x${stripped}`;
    default:
      throw new Error(`Invalid v value: ${v}`);
  }
}
export function generateQueryPath(url, params) {
  const definedEntries = Object.entries(params).filter(([_key, value]) => value !== undefined);
  if (!definedEntries.length) {
    return url;
  }
  const paramsString = Object.keys(params).length ? queryString.stringify(params) : "";
  return paramsString ? `${url}?${paramsString}` : url;
}
export function keccak256Buffer(input) {
  if (input.length === 0) {
    throw new Error("keccak256Buffer: Expected a Buffer with non-zero length");
  }
  return Buffer.from(stripHexPrefix(soliditySha3(input)), "hex");
}
export function generateRandomClientId() {
  return Math.random().toString().slice(2).replace(/^0+/, "");
}
export function bignumberableToUint256(amount) {
  const result = BigNumber(amount);
  // Solidity only takes integers.
  if (!result.isInteger()) {
    throw new Error(`Amount cannot be used in contract call: ${result.toFixed()}`);
  }
  return result.toFixed(0);
}
export function humanTokenAmountToUint256(humanAmount, decimals) {
  return bignumberableToUint256(BigNumber(humanAmount).shiftedBy(+decimals));
}
export function getTransferErc20Fact({
  recipient,
  tokenAddress,
  tokenDecimals,
  humanAmount,
  salt,
}) {
  const result = soliditySha3(
    { type: "address", value: recipient },
    {
      type: "uint256",
      value: humanTokenAmountToUint256(humanAmount, tokenDecimals),
    },
    { type: "address", value: tokenAddress },
    { type: "uint256", value: bignumberableToUint256(salt) },
  );
  return result;
}
