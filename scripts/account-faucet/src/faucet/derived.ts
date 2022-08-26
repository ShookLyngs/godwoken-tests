import keccak256 from 'keccak256';
import { HexString, Address } from '@ckb-lumos/base';
import { utils } from 'ethers';

export interface DerivedAccount {
  privateKey: HexString;
  ethAddress: Address;
}
export function privateKeyToDerivedAccounts(privateKey: HexString, count: number): DerivedAccount[] {
  const keys: HexString[] = [];
  for (let i = 0; i < count; i++) {
    const newKey = '0x' + keccak256(keys[keys.length - 1]).toString('hex');
    keys.push(newKey);
  }

  return keys.map((privateKey) => ({
    privateKey: privateKey,
    ethAddress: utils.computeAddress(privateKey),
  }));
}
