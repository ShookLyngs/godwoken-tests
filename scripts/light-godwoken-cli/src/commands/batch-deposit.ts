import { Command, Option } from 'commander';
import { Network } from '../config';
import { deposit } from './deposit';
import { privateKeyToDerivedAccounts } from '../utils/account';

export default function setupBatchDeposit(program: Command) {
  program
    .command('batch-deposit')
    .requiredOption('-p, --private-key <HEX_STRING>', 'account private key')
    .requiredOption('-c, --capacity <STRING>', 'deposit capacity (1:1CKB)')
    .option('-sl, --sudt-lock-args <HEX_STRING>', 'deposit sudt L1 lock_args')
    .option('-sa, --sudt-amount <STRING>', 'deposit sudt amount')
    .option('-sd, --sudt-decimals <STRING>', 'sudt decimals')
    .addOption(
      new Option('-n, --network <NETWORK>', 'network to use')
        .choices(Object.values(Network))
        .default(Network.TestnetV1)
    )
    .action(batchDeposit)
  ;
}

export async function batchDeposit(params: {
  privateKey: string;
  network: Network;
  capacity: string;
  sudtLockArgs?: string;
  sudtAmount?: string;
  sudtDecimals?: string;
}) {
  const accounts = privateKeyToDerivedAccounts(params.privateKey, 10);
  const promises = accounts.map(async (account) => {
    return deposit({
      ...params,
      privateKey: account.privateKey,
    });
  });

  await Promise.all(promises);
}
