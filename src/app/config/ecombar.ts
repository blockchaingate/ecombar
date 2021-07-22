export var ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "feeChargerSmartContractAddr",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "_coinType",
				"type": "uint32"
			},
			{
				"internalType": "uint8",
				"name": "taxrate",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes30",
				"name": "_objectID",
				"type": "bytes30"
			}
		],
		"name": "CreateProduct",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "objectId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "cancelRefundRequestWithSig",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "changeFeeChargerSmartContractAddr",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "bytes30[]",
				"name": "productObjectIds",
				"type": "bytes30[]"
			},
			{
				"internalType": "uint8[]",
				"name": "quantities",
				"type": "uint8[]"
			},
			{
				"internalType": "uint256",
				"name": "total",
				"type": "uint256"
			}
		],
		"name": "createOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "bytes30",
				"name": "order_id",
				"type": "bytes30"
			}
		],
		"name": "createShipping",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeChargerInstance",
		"outputs": [
			{
				"internalType": "contract FeeChargerInterface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "uint256",
				"name": "fullfilmentFee",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "getChargePayOrderParams",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "id",
				"type": "bytes30"
			}
		],
		"name": "getOrderById",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes30",
						"name": "id",
						"type": "bytes30"
					},
					{
						"internalType": "bytes30[]",
						"name": "productObjectIds",
						"type": "bytes30[]"
					},
					{
						"internalType": "uint8[]",
						"name": "quantities",
						"type": "uint8[]"
					},
					{
						"internalType": "uint256",
						"name": "total",
						"type": "uint256"
					}
				],
				"internalType": "struct Ecombar.Order",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "id",
				"type": "bytes30"
			}
		],
		"name": "getProductById",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes30",
						"name": "id",
						"type": "bytes30"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct Ecombar.Product",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "idDockInstance",
		"outputs": [
			{
				"internalType": "contract IdDockInterface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "id",
				"type": "bytes30"
			}
		],
		"name": "isPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "bytes30",
				"name": "id",
				"type": "bytes30"
			},
			{
				"internalType": "uint256",
				"name": "total",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "uint256",
				"name": "fullfilmentFee",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			},
			{
				"internalType": "address[]",
				"name": "_rewardBeneficiary",
				"type": "address[]"
			}
		],
		"name": "payOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "bytes30",
				"name": "id",
				"type": "bytes30"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "objectId",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "refundWithSig",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes30",
				"name": "objectId",
				"type": "bytes30"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "requestRefundWithSig",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export var Bytecode = "60806040523480156200001157600080fd5b5060405162002cb238038062002cb28339818101604052810190620000379190620001bd565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a382600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260146101000a81548163ffffffff021916908363ffffffff16021790555080600260186101000a81548160ff021916908360ff160217905550505050620002b2565b600081519050620001898162000264565b92915050565b600081519050620001a0816200027e565b92915050565b600081519050620001b78162000298565b92915050565b600080600060608486031215620001d357600080fd5b6000620001e38682870162000178565b9350506020620001f6868287016200018f565b92505060406200020986828701620001a6565b9150509250925092565b6000620002208262000227565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600063ffffffff82169050919050565b600060ff82169050919050565b6200026f8162000213565b81146200027b57600080fd5b50565b620002898162000247565b81146200029557600080fd5b50565b620002a38162000257565b8114620002af57600080fd5b50565b6129f080620002c26000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806393572570116100ad578063b92b8af911610071578063b92b8af91461035d578063d4917f781461038d578063db0aa608146103ab578063ee728622146103db578063f2fde38b146103f75761012c565b8063935725701461027a578063a44495c8146102aa578063a6847448146102e0578063a85c38ef14610310578063abf4222f146103415761012c565b8063729b0d72116100f4578063729b0d72146101d35780637acc0b20146101ef5780638da5cb5b146102205780638f32d59b1461023e5780639006a5cc1461025c5761012c565b80632fce0cd61461013157806351e11974146101615780635c17051f1461017d578063715018a614610199578063723e55b9146101a3575b600080fd5b61014b60048036038101906101469190611d82565b610413565b604051610158919061242e565b60405180910390f35b61017b60048036038101906101769190611e8c565b6104da565b005b61019760048036038101906101929190611ec8565b610631565b005b6101a16107ba565b005b6101bd60048036038101906101b89190612043565b6108f2565b6040516101ca919061242e565b60405180910390f35b6101ed60048036038101906101e89190611f8d565b6109b4565b005b6102096004803603810190610204919061211d565b610bec565b604051610217929190612464565b60405180910390f35b610228610c2d565b6040516102359190612413565b60405180910390f35b610246610c56565b604051610253919061242e565b60405180910390f35b610264610cad565b6040516102719190612634565b60405180910390f35b610294600480360381019061028f9190611d59565b610cd3565b6040516102a19190612671565b60405180910390f35b6102c460048036038101906102bf9190611f04565b610d35565b6040516102d7979695949392919061248d565b60405180910390f35b6102fa60048036038101906102f59190611d59565b610ed6565b604051610307919061264f565b60405180910390f35b61032a6004803603810190610325919061211d565b611020565b604051610338929190612464565b60405180910390f35b61035b60048036038101906103569190611df9565b611061565b005b61037760048036038101906103729190611d59565b6111f2565b604051610384919061242e565b60405180910390f35b610395611450565b6040516103a29190612619565b60405180910390f35b6103c560048036038101906103c091906120ba565b611476565b6040516103d2919061242e565b60405180910390f35b6103f560048036038101906103f09190611c69565b6115af565b005b610411600480360381019061040c9190611c69565b6115f3565b005b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636f252d4c8761ffff1916878787876040518663ffffffff1660e01b815260040161047d959493929190612581565b602060405180830381600087803b15801561049757600080fd5b505af11580156104ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104cf9190611d30565b905095945050505050565b6104e2610c56565b610554576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600061055f826111f2565b90508061056b57600080fd5b600060405180604001604052808561ffff191681526020018461ffff1916815250905080600760008661ffff191661ffff1916815260200190815260200160002060008201518160000160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c021790555060208201518160010160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c021790555090505050505050565b610639610c56565b6106ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600081116106b857600080fd5b600060405180604001604052808461ffff19168152602001838152509050600381908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c021790555060208201518160010155505080600560008561ffff191661ffff1916815260200190815260200160002060008201518160000160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c021790555060208201518160010155905050505050565b6107c2610c56565b610834576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663723e55b987878787876040518663ffffffff1660e01b8152600401610957959493929190612581565b602060405180830381600087803b15801561097157600080fd5b505af1158015610985573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109a99190611d30565b905095945050505050565b6000600660008961ffff191661ffff191681526020019081526020016000206040518060800160405290816000820160009054906101000a900460101b61ffff191661ffff1916815260200160018201805480602002602001604051908101604052809291908181526020018280548015610a6057602002820191906000526020600020905b8160009054906101000a900460101b61ffff191681526020019060010190808311610a3a575b5050505050815260200160028201805480602002602001604051908101604052809291908181526020018280548015610ade57602002820191906000526020600020906000905b82829054906101000a900460ff1660ff1681526020019060010190602082600001049283019260010382029150808411610aa75790505b5050505050815260200160038201548152505090506000610b0c88836060015161167990919063ffffffff16565b9050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635b4e52d98a61ffff191689600260149054906101000a900463ffffffff16858b8b8b8b6040518963ffffffff1660e01b8152600401610b8e9897969594939291906124fc565b602060405180830381600087803b158015610ba857600080fd5b505af1158015610bbc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610be09190611d30565b50505050505050505050565b60038181548110610bfc57600080fd5b90600052602060002090600202016000915090508060000160009054906101000a900460101b908060010154905082565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610cdb611844565b600560008361ffff191661ffff191681526020019081526020016000206040518060400160405290816000820160009054906101000a900460101b61ffff191661ffff191681526020016001820154815250509050919050565b600080600080600080600080600660008f61ffff191661ffff191681526020019081526020016000206040518060800160405290816000820160009054906101000a900460101b61ffff191661ffff1916815260200160018201805480602002602001604051908101604052809291908181526020018280548015610deb57602002820191906000526020600020905b8160009054906101000a900460101b61ffff191681526020019060010190808311610dc5575b5050505050815260200160028201805480602002602001604051908101604052809291908181526020018280548015610e6957602002820191906000526020600020906000905b82829054906101000a900460ff1660ff1681526020019060010190602082600001049283019260010382029150808411610e325790505b5050505050815260200160038201548152505090506000610e978e836060015161167990919063ffffffff16565b90508e61ffff19168d600260149054906101000a900463ffffffff16838f8f8f9850985098509850985098509850505096509650965096509650965096565b610ede611863565b600660008361ffff191661ffff191681526020019081526020016000206040518060800160405290816000820160009054906101000a900460101b61ffff191661ffff1916815260200160018201805480602002602001604051908101604052809291908181526020018280548015610f8857602002820191906000526020600020905b8160009054906101000a900460101b61ffff191681526020019060010190808311610f62575b505050505081526020016002820180548060200260200160405190810160405280929190818152602001828054801561100657602002820191906000526020600020906000905b82829054906101000a900460ff1660ff1681526020019060010190602082600001049283019260010382029150808411610fcf5790505b505050505081526020016003820154815250509050919050565b6004818154811061103057600080fd5b90600052602060002090600402016000915090508060000160009054906101000a900460101b908060030154905082565b6000811161106e57600080fd5b600060405180608001604052808661ffff19168152602001858152602001848152602001838152509050600481908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c0217905550602082015181600101908051906020019061111e929190611890565b50604082015181600201908051906020019061113b929190611911565b5060608201518160030155505080600660008761ffff191661ffff1916815260200190815260200160002060008201518160000160006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c021790555060208201518160010190805190602001906111c0929190611890565b5060408201518160020190805190602001906111dd929190611911565b50606082015181600301559050505050505050565b600080600080600080600080600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663768c6ec08a6040518263ffffffff1660e01b81526004016112599190612449565b60e06040518083038186803b15801561127157600080fd5b505afa158015611285573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112a99190611c92565b9650965096509650965096509650600082850190506000600660008c61ffff191661ffff191681526020019081526020016000206040518060800160405290816000820160009054906101000a900460101b61ffff191661ffff191681526020016001820180548060200260200160405190810160405280929190818152602001828054801561136a57602002820191906000526020600020905b8160009054906101000a900460101b61ffff191681526020019060010190808311611344575b50505050508152602001600282018054806020026020016040519081016040528092919081815260200182805480156113e857602002820191906000526020600020906000905b82829054906101000a900460ff1660ff16815260200190600101906020826000010492830192600103820291508084116113b15790505b50505050508152602001600382015481525050905081816060015114801561142657506001600381111561141857fe5b83600381111561142457fe5b145b1561143d576001995050505050505050505061144b565b600099505050505050505050505b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000611480610c56565b6114f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663db0aa608868686866040518563ffffffff1660e01b815260040161155394939291906125d4565b602060405180830381600087803b15801561156d57600080fd5b505af1158015611581573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a59190611d30565b9050949350505050565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6115fb610c56565b61166d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b61167681611701565b50565b6000808284019050838110156116f7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611787576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001806129956026913960400191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6040518060400160405280600061ffff19168152602001600081525090565b6040518060800160405280600061ffff191681526020016060815260200160608152602001600081525090565b828054828255906000526020600020908101928215611900579160200282015b828111156118ff5782518260006101000a8154817dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff021916908360101c0217905550916020019190600101906118b0565b5b50905061190d91906119b8565b5090565b82805482825590600052602060002090601f016020900481019282156119a75791602002820160005b8382111561197857835183826101000a81548160ff021916908360ff160217905550926020019260010160208160000104928301926001030261193a565b80156119a55782816101000a81549060ff0219169055600101602081600001049283019260010302611978565b505b5090506119b491906119b8565b5090565b5b808211156119d15760008160009055506001016119b9565b5090565b60006119e86119e3846126bd565b61268c565b90508083825260208201905082856020860282011115611a0757600080fd5b60005b85811015611a375781611a1d8882611b19565b845260208401935060208301925050600181019050611a0a565b5050509392505050565b6000611a54611a4f846126e9565b61268c565b90508083825260208201905082856020860282011115611a7357600080fd5b60005b85811015611aa35781611a898882611bd6565b845260208401935060208301925050600181019050611a76565b5050509392505050565b6000611ac0611abb84612715565b61268c565b90508083825260208201905082856020860282011115611adf57600080fd5b60005b85811015611b0f5781611af58882611c54565b845260208401935060208301925050600181019050611ae2565b5050509392505050565b600081359050611b28816128e3565b92915050565b600081519050611b3d816128e3565b92915050565b600082601f830112611b5457600080fd5b8135611b648482602086016119d5565b91505092915050565b600082601f830112611b7e57600080fd5b8135611b8e848260208601611a41565b91505092915050565b600082601f830112611ba857600080fd5b8135611bb8848260208601611aad565b91505092915050565b600081519050611bd0816128fa565b92915050565b600081359050611be581612911565b92915050565b600081359050611bfa81612928565b92915050565b600081519050611c0f8161293f565b92915050565b600081359050611c248161294f565b92915050565b600081519050611c398161294f565b92915050565b600081519050611c4e81612966565b92915050565b600081359050611c638161297d565b92915050565b600060208284031215611c7b57600080fd5b6000611c8984828501611b19565b91505092915050565b600080600080600080600060e0888a031215611cad57600080fd5b6000611cbb8a828b01611b2e565b9750506020611ccc8a828b01611c3f565b9650506040611cdd8a828b01611b2e565b9550506060611cee8a828b01611c2a565b9450506080611cff8a828b01611b2e565b93505060a0611d108a828b01611c2a565b92505060c0611d218a828b01611c00565b91505092959891949750929550565b600060208284031215611d4257600080fd5b6000611d5084828501611bc1565b91505092915050565b600060208284031215611d6b57600080fd5b6000611d7984828501611bd6565b91505092915050565b600080600080600060a08688031215611d9a57600080fd5b6000611da888828901611bd6565b9550506020611db988828901611b19565b9450506040611dca88828901611c54565b9350506060611ddb88828901611beb565b9250506080611dec88828901611beb565b9150509295509295909350565b60008060008060808587031215611e0f57600080fd5b6000611e1d87828801611bd6565b945050602085013567ffffffffffffffff811115611e3a57600080fd5b611e4687828801611b6d565b935050604085013567ffffffffffffffff811115611e6357600080fd5b611e6f87828801611b97565b9250506060611e8087828801611c15565b91505092959194509250565b60008060408385031215611e9f57600080fd5b6000611ead85828601611bd6565b9250506020611ebe85828601611bd6565b9150509250929050565b60008060408385031215611edb57600080fd5b6000611ee985828601611bd6565b9250506020611efa85828601611c15565b9150509250929050565b60008060008060008060c08789031215611f1d57600080fd5b6000611f2b89828a01611bd6565b9650506020611f3c89828a01611c15565b9550506040611f4d89828a01611b19565b9450506060611f5e89828a01611c54565b9350506080611f6f89828a01611beb565b92505060a0611f8089828a01611beb565b9150509295509295509295565b600080600080600080600060e0888a031215611fa857600080fd5b6000611fb68a828b01611bd6565b9750506020611fc78a828b01611c15565b9650506040611fd88a828b01611b19565b9550506060611fe98a828b01611c54565b9450506080611ffa8a828b01611beb565b93505060a061200b8a828b01611beb565b92505060c088013567ffffffffffffffff81111561202857600080fd5b6120348a828b01611b43565b91505092959891949750929550565b600080600080600060a0868803121561205b57600080fd5b600061206988828901611beb565b955050602061207a88828901611b19565b945050604061208b88828901611c54565b935050606061209c88828901611beb565b92505060806120ad88828901611beb565b9150509295509295909350565b600080600080608085870312156120d057600080fd5b60006120de87828801611beb565b94505060206120ef87828801611c54565b935050604061210087828801611beb565b925050606061211187828801611beb565b91505092959194509250565b60006020828403121561212f57600080fd5b600061213d84828501611c15565b91505092915050565b6000612152838361218e565b60208301905092915050565b600061216a83836122d5565b60208301905092915050565b600061218283836123f5565b60208301905092915050565b612197816127ec565b82525050565b6121a6816127ec565b82525050565b60006121b782612771565b6121c181856127b9565b93506121cc83612741565b8060005b838110156121fd5781516121e48882612146565b97506121ef83612792565b9250506001810190506121d0565b5085935050505092915050565b60006122158261277c565b61221f81856127ca565b935061222a83612751565b8060005b8381101561225b578151612242888261215e565b975061224d8361279f565b92505060018101905061222e565b5085935050505092915050565b600061227382612787565b61227d81856127db565b935061228883612761565b8060005b838110156122b95781516122a08882612176565b97506122ab836127ac565b92505060018101905061228c565b5085935050505092915050565b6122cf816127fe565b82525050565b6122de8161280a565b82525050565b6122ed8161280a565b82525050565b6122fc81612887565b82525050565b61230b81612836565b82525050565b61231a81612899565b82525050565b612329816128bd565b82525050565b600060808301600083015161234760008601826122d5565b506020830151848203602086015261235f828261220a565b915050604083015184820360408601526123798282612268565b915050606083015161238e60608601826123c8565b508091505092915050565b6040820160008201516123af60008501826122d5565b5060208201516123c260208501826123c8565b50505050565b6123d181612860565b82525050565b6123e081612860565b82525050565b6123ef8161286a565b82525050565b6123fe8161287a565b82525050565b61240d8161287a565b82525050565b6000602082019050612428600083018461219d565b92915050565b600060208201905061244360008301846122c6565b92915050565b600060208201905061245e60008301846122f3565b92915050565b600060408201905061247960008301856122e4565b61248660208301846123d7565b9392505050565b600060e0820190506124a2600083018a612302565b6124af602083018961219d565b6124bc60408301886123e6565b6124c960608301876123d7565b6124d66080830186612404565b6124e360a0830185612302565b6124f060c0830184612302565b98975050505050505050565b600061010082019050612512600083018b612302565b61251f602083018a61219d565b61252c60408301896123e6565b61253960608301886123d7565b6125466080830187612404565b61255360a0830186612302565b61256060c0830185612302565b81810360e083015261257281846121ac565b90509998505050505050505050565b600060a0820190506125966000830188612302565b6125a3602083018761219d565b6125b06040830186612404565b6125bd6060830185612302565b6125ca6080830184612302565b9695505050505050565b60006080820190506125e96000830187612302565b6125f66020830186612404565b6126036040830185612302565b6126106060830184612302565b95945050505050565b600060208201905061262e6000830184612311565b92915050565b60006020820190506126496000830184612320565b92915050565b60006020820190508181036000830152612669818461232f565b905092915050565b60006040820190506126866000830184612399565b92915050565b6000604051905081810181811067ffffffffffffffff821117156126b3576126b26128e1565b5b8060405250919050565b600067ffffffffffffffff8211156126d8576126d76128e1565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612704576127036128e1565b5b602082029050602081019050919050565b600067ffffffffffffffff8211156127305761272f6128e1565b5b602082029050602081019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b60006127f782612840565b9050919050565b60008115159050919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000082169050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600063ffffffff82169050919050565b600060ff82169050919050565b60006128928261280a565b9050919050565b60006128a4826128ab565b9050919050565b60006128b682612840565b9050919050565b60006128c8826128cf565b9050919050565b60006128da82612840565b9050919050565bfe5b6128ec816127ec565b81146128f757600080fd5b50565b612903816127fe565b811461290e57600080fd5b50565b61291a8161280a565b811461292557600080fd5b50565b61293181612836565b811461293c57600080fd5b50565b6004811061294c57600080fd5b50565b61295881612860565b811461296357600080fd5b50565b61296f8161286a565b811461297a57600080fd5b50565b6129868161287a565b811461299157600080fd5b5056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373a26469706673582212204dc28d3e03922ef9b099b563b883c7526906fae07ca47c89fe0dd3bca66bb06f64736f6c63430007060033";
