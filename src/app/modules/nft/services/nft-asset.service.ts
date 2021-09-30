import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from '../../shared/services/web3.service';
import { KanbanService } from '../../shared/services/kanban.service';

@Injectable({ providedIn: 'root' })
export class NftAssetService {

  constructor(
    private http: HttpClient, 
    private web3Serv: Web3Service, 
    private kanbanServ: KanbanService) { }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/create';
    return this.http.post(url, data);
  }

  update(smartContractAddress: string, tokenId: string, data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/' + smartContractAddress + '/' + tokenId + '/update';
    return this.http.post(url, data);
  }

  getAll() {
    const url = environment.endpoints.blockchaingate + 'nft-asset';
    return this.http.get(url);           
  }

  reveal(data: any) {
    const url = environment.endpoints.blockchaingate  + 'nft-asset/reveal';
    return this.http.post(url, data);    
  }
  
  getAllByOwner(address: string) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/owner/' + address;
    return this.http.get(url);   
  }

  getBySlug(slug: string) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/slug/' + slug;
    return this.http.get(url);    
  }

  getBySmartContract(smartContractAddress: string) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/smartContractAddress/' + smartContractAddress;
    return this.http.get(url);    
  }

  transfer(smartContractAddress: string, tokenId: string, from: string, to: string, quantity: number, txhex: string) {
    const url = environment.endpoints.blockchaingate  + 'nft-asset/smartContractAddressTokenId/' 
    + smartContractAddress + '/' + tokenId + '/transfer';
    const data = {
      from,
      to,
      quantity,
      txhex
    };

    return this.http.post(url, data);
  }

  getBySmartContractTokenId(smartContractAddress: string, tokenId: string) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/smartContractAddressTokenId/' 
    + smartContractAddress + '/' + tokenId;
    console.log('url===', url);
    return this.http.get(url);      
  }

  getOwner(smartContractAddress: string, tokenId: string) {
    const args = [tokenId];
    const abi = {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    };

    const abiEncoded = this.web3Serv.getGeneralFunctionABI(abi, args);
    return this.kanbanServ.kanbanCall(smartContractAddress, abiEncoded);
  }

  getBalanceOf(address: string, smartContractAddress: string, tokenId: string) {
    const args = [address, tokenId];
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    };

    const abiEncoded = this.web3Serv.getGeneralFunctionABI(abi, args);
    return this.kanbanServ.kanbanCall(smartContractAddress, abiEncoded);
  }
}
