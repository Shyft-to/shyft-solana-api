import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { BalanceCheckDto, ResolveAddressDto, } from './dto/balance-check.dto';
import { SendSolDto } from './dto/send-sol.dto';
import { AccountUtils } from 'src/common/utils/account-utils';
import { TokenBalanceCheckDto } from './dto/token-balance-check.dto';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { RemoteDataFetcherService } from '../db/remote-data-fetcher/data-fetcher.service';
import { FetchAllNftDto } from '../db/remote-data-fetcher/dto/data-fetcher.dto';
import { getAllDomains, performReverseLookup, performReverseLookupBatch } from '@bonfida/spl-name-service';

@Injectable()
export class WalletService {
  constructor(private dataFetcher: RemoteDataFetcherService) { }
  async getBalance(balanceCheckDto: BalanceCheckDto): Promise<number> {
    try {
      const { wallet, network } = balanceCheckDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const balance = await connection.getBalance(new PublicKey(wallet));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTokenBalance(balanceCheckDto: TokenBalanceCheckDto): Promise<number> {
    try {
      const { wallet, network, token } = balanceCheckDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      let tokenAccount;
      try {
        tokenAccount = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(wallet),
          { mint: new PublicKey(token) },
        );
      } catch (error) {
        //Do nothing, if mint account isnt found in the wallet, just return 0
        console.log(error);
      } finally {
        return tokenAccount?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllTokensBalance(balanceCheckDto: BalanceCheckDto): Promise<Record<string, number>[]> {
    try {
      const { wallet, network } = balanceCheckDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const allTokenInfo = [];
      try {
        const parsedSplAccts = await connection.getParsedTokenAccountsByOwner(new PublicKey(wallet), { programId: TOKEN_PROGRAM_ID });
        parsedSplAccts.value.forEach((token) => {
          const amount = token.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
          const decimals = token.account?.data?.parsed?.info?.tokenAmount?.decimals;
          if (decimals > 0 && amount > 0) {
            const address = token.account?.data?.parsed?.info?.mint;
            allTokenInfo.push({ address: address, balance: amount });
          }
        });
        return allTokenInfo;
      } catch (error) {
        //Do nothing, if mint account isnt found in the wallet, just return 0
        console.log(error);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPortfolio(walletDto: BalanceCheckDto) {
    const portfolio = {};
    const promises = [];
    const amtPromise = this.getBalance(walletDto);
    amtPromise.then((amount) => {
      portfolio['sol_balance'] = amount;
    });

    promises.push(amtPromise);

    const tokenPromise = this.getAllTokensBalance(walletDto);
    tokenPromise.then((res) => {
      portfolio['num_tokens'] = Object.keys(res)?.length ?? 0;
      portfolio['tokens'] = res;
    });
    promises.push(tokenPromise);

    const nftpromise = this.dataFetcher.fetchAllNfts(new FetchAllNftDto(walletDto.network, walletDto.wallet))
    nftpromise.then((nfts) => {
      portfolio['num_nfts'] = nfts.length;
      portfolio['nfts'] = nfts;
    });

    promises.push(nftpromise);

    await Promise.allSettled(promises);
    return portfolio;
  }

  async getDomains(walletDto: BalanceCheckDto) {
    const connection = new Connection(clusterApiUrl(walletDto.network), 'confirmed');
    const domains = await getAllDomains(connection, new PublicKey(walletDto.wallet));

    const names = await performReverseLookupBatch(connection, domains);
    const resp = [];
    names.forEach((element, i) => {
      resp.push({ address: domains[i], name: `${element}.sol` });
    });

    return resp;
  }

  async resolveAddress(nameAddressDto: ResolveAddressDto) {
    try {
      const connection = new Connection(clusterApiUrl(nameAddressDto.network), 'confirmed');
      const name = await performReverseLookup(connection, new PublicKey(nameAddressDto.address));
      return { name: `${name}.sol` };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendSol(sendSolDto: SendSolDto): Promise<string> {
    try {
      const { network, from_private_key, to_address, amount } = sendSolDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');

      const from = AccountUtils.getKeypair(from_private_key);
      // Add transfer instruction to transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: new PublicKey(to_address),
          lamports: LAMPORTS_PER_SOL * amount,
        }),
      );

      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
      return signature;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
