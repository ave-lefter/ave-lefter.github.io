import { keccak256 } from "ethereum-cryptography/keccak";
import { _asEcKeyPair, _asSimpleKeyPair } from "./helpers";
import { hexToBn, randomBuffer } from "./lib/util";
/**
 * Generate a pseudorandom StarkEx key pair. NOT FOR USE IN PRODUCTION.
 */
export function generateKeyPairUnsafe() {
  return _keyPairFromData(randomBuffer(32));
}
/**
 * Generate a STARK key pair deterministically from a Buffer.
 */
export function _keyPairFromData(data) {
  if (data.length === 0) {
    throw new Error("keyPairFromData: Empty buffer");
  }
  const hashedData = keccak256(data);
  const hashBN = hexToBn(hashedData.toString("hex"));
  const privateKey = hashBN.iushrn(5).toString("hex"); // Remove the last five bits.
  return _asSimpleKeyPair(_asEcKeyPair(privateKey));
}
