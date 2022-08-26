import { HexString } from '@ckb-lumos/base';
import { Command, Option } from 'commander';
import { Network, networks } from '../config';
import { claimFaucetForCkbAddress } from '../faucet/faucet';
import { privateKeyToDerivedAccounts } from '../faucet/derived';
import { privateKeyToCkbAddress } from '../faucet/address';

export default function setupBatchClaimForL1(program: Command) {
  program
    .command('batch-claim-l1')
    .description('claim faucet for L1 derived accounts based on a private-key')
    .requiredOption('-p, --private-key <HEX_STRING>', 'ckb private key')
    .requiredOption('-c, --count <NUMBER>', 'deposit account count')
    .addOption(
      new Option('-n, --network <NETWORK>', 'network to use')
        .choices(Object.values(Network))
        .default(Network.TestnetV1)
    )
    .action(batchClaimForL1)
  ;
}

export async function batchClaimForL1(params: {
  privateKey: HexString;
  count: string;
  network: Network;
}) {
  const config = networks[params.network];
  const accounts = privateKeyToDerivedAccounts(params.privateKey, Number(params.count));

  await Promise.all(
    accounts.map((account) => {
      const ckbAddress = privateKeyToCkbAddress(config, account.privateKey);
      return claimFaucetForCkbAddress(ckbAddress);
    })
  );
}
