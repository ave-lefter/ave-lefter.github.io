// TODO: Get rid of this file.
import { Buffer } from "buffer";
import * as uuid from "uuid";

const UUID_NAMESPACE = "0f9da948-a6fb-4c45-9edc-4685c3f3317d";
export function getUserId(address) {
  return uuid.v5(Buffer.from(address.toLowerCase()), UUID_NAMESPACE);
}
export function getAccountId({ address, accountNumber = "0" }) {
  return uuid.v5(Buffer.from(`${getUserId(address)}${accountNumber}`), UUID_NAMESPACE);
}
