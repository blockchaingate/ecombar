import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoinService } from './coin.service';
import { KanbanService } from './kanban.service';
import { UtilService } from './util.service';
import Common from 'ethereumjs-common';
import KanbanTxService from './kanban.tx.service';
import { Web3Service } from './web3.service';

@Injectable({ providedIn: 'root' })
export class KanbanSmartContractService {
    baseUrl = environment.endpoints.kanban;

    constructor(
        private coinServ: CoinService,
        private web3Serv: Web3Service,
        private kanbanServ: KanbanService,
        private utilServ: UtilService,
        ) {

    }

    getTransactionReceipt(txid: string) {
        return this.kanbanServ.getTransactionReceipt(txid);
    }

    formCreateKanbanSmartContractABI(abi, bytecode, args) {
        return this.web3Serv.formCreateSmartContractABI(abi, bytecode, args);
    }

    formExecKanbanSmartContractABI(abi, args) {
        return this.web3Serv.getGeneralFunctionABI(abi, args);
    }

    async getExecSmartContractHex(seed: Buffer, smartContractAddress: string, abi: any, args: any) {
      const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      let gasPrice = environment.chains.KANBAN.gasPrice;
      let gasLimit = 8000000;
      const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
  
      let kanbanValue = 0;
  
      const kanbanData = this.formExecKanbanSmartContractABI(abi, args);
      const txObject = {
          nonce: nonce,
          to: smartContractAddress,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          value: kanbanValue,
          data: '0x' + this.utilServ.stripHexPrefix(kanbanData)          
      };
  
      let privKey: any = keyPairsKanban.privateKeyBuffer;
  
      if(!Buffer.isBuffer(privKey)) {
        privKey = privKey.privateKey;
      }
      
      let txhex = '';
  
  
      const customCommon = Common.forCustomChain(
        environment.chains.ETH.chain,
        {
          name: environment.chains.KANBAN.chain.name,
          networkId: environment.chains.KANBAN.chain.networkId,
          chainId: environment.chains.KANBAN.chain.chainId
        },
        environment.chains.ETH.hardfork,
      );
      const tx = new KanbanTxService(txObject, { common: customCommon });
  
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      txhex = '0x' + serializedTx.toString('hex');     
      return txhex; 
    }
    
    async execSmartContract(seed: Buffer, smartContractAddress: string, abi: any, args: any) {

      const txhex = await this.getExecSmartContractHex(seed, smartContractAddress, abi, args);
        const res = await this.kanbanServ.sendRawSignedTransactionPromise(txhex);
        return res;
    }

    async deploySmartContract(seed: Buffer, abi: any, bytecode: any, args: any) {
        const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        let gasPrice = environment.chains.KANBAN.gasPrice;
        let gasLimit = 8000000;
        const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
    
        let kanbanValue = 0;
    
        const kanbanData = this.formCreateKanbanSmartContractABI(abi, bytecode, args);
        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            value: kanbanValue,
            data: '0x' + this.utilServ.stripHexPrefix(kanbanData)          
        };
    
        let privKey: any = keyPairsKanban.privateKeyBuffer;
    
        if(!Buffer.isBuffer(privKey)) {
          privKey = privKey.privateKey;
        }
        
        let txhex = '';
    
    
        const customCommon = Common.forCustomChain(
          environment.chains.ETH.chain,
          {
            name: environment.chains.KANBAN.chain.name,
            networkId: environment.chains.KANBAN.chain.networkId,
            chainId: environment.chains.KANBAN.chain.chainId
          },
          environment.chains.ETH.hardfork,
        );
        const tx = new KanbanTxService(txObject, { common: customCommon });
    
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        txhex = '0x' + serializedTx.toString('hex');
    
        const res = await this.kanbanServ.sendRawSignedTransactionPromise(txhex);
        return res;
        //console.log('res==', res);
    }    
}