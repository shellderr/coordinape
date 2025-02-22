import { BigNumber, Wallet } from 'ethers';

import { COSOUL_SIGNER_ADDR_PK } from '../../../../api-lib/config';
import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../chains';
import { Contracts } from '../contracts';

const PGIVE_SLOT = 0;
export const PGIVE_SYNC_DURATION_DAYS = 30;

function getCoSoulContract() {
  // this is the preferred optimism chain id
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  return contracts.cosoul;
}

function getSignedCoSoulContract() {
  // this is the preferred optimism chain id
  const signerWallet = new Wallet(COSOUL_SIGNER_ADDR_PK);
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  const signer = signerWallet.connect(provider);
  return contracts.cosoul.connect(signer);
}

// get the cosoul token id for a given address
export const getTokenId = async (address: string) => {
  const contract = getCoSoulContract();

  // see if they have any CoSoul tokens
  const balanceOfBN = await contract.balanceOf(address);
  const balanceOf = balanceOfBN.toNumber();

  // if they don't have a balance there is nothing more to do
  if (balanceOf === 0) {
    return undefined;
  }

  // fetch their first token because they can only have one per the contract
  return (
    await contract.tokenOfOwnerByIndex(address, BigNumber.from(0))
  ).toNumber();
};

// get the on-chain PGIVE balance for a given token
export const getOnChainPGIVE = async (tokenId: number) => {
  const contract = getCoSoulContract();
  return (await contract.getSlot(PGIVE_SLOT, tokenId)).toNumber();
};

// set the on-chain PGIVE balance for a given token
export const setOnChainPGIVE = async (tokenId: number, amt: number) => {
  const contract = getSignedCoSoulContract();
  const amount = Math.floor(amt);
  // eslint-disable-next-line no-console
  console.log(
    'setting on chain PGIVE for tokenId: ' + tokenId + ' to ' + amount
  );
  return await contract.setSlot(PGIVE_SLOT, amount, tokenId);
};
