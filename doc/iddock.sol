pragma solidity >=0.4.25 <0.6.0;

contract IDDock {
    // user => internalID(8)
    mapping(address => uint64) private internalIDOf;
    
    // objectID(30) => sequenceIDNonce(2)
    mapping(bytes30 => uint16) private sequenceIDNonceOf;
    
    // objectID => owner
    mapping(bytes30 => address) private objectIDOwner;
    
    // objectID => (coordinator => bool)
    mapping(bytes30 => mapping(address => bool)) private objectIDCoordinators;
    
    // sequenceID => hashData
    mapping(bytes32 => bytes32) private hashDataOfSequenceID;
    
    // events
    event CreateID(bytes30 _objectID, bytes32 _sequenceID, bytes32 _hashData);
    event UpdateID(bytes30 _objectID, bytes32 _sequenceID, bytes32 _hashData);
    event ChangeOwner(bytes30 _objectID, address _newOwner);
    event AddCoordinator(bytes30 _objectID, address _coordinator);
    event RemoveCoordinator(bytes30 _objectID, address _coordinator);
    
    function createID(bytes2 _type, bytes32 _hashData) external returns (bytes30){
        // generate objectID: creator’s address(20 bytes) + type(2 bytes) + internal ID(8 bytes)
        bytes32 objectID32;
        objectID32 = (((objectID32 | bytes8(internalIDOf[msg.sender])) >> 16) | _type) >> 160 | bytes20(msg.sender);
        bytes30 objectID = bytes30(objectID32);
        internalIDOf[msg.sender] += 1;

        // generate sequenceID: objectID + nonce(2 bytes)
        bytes32 sequenceID;
        sequenceID = ((sequenceID | bytes2(sequenceIDNonceOf[objectID])) >> 240) | objectID32;
        sequenceIDNonceOf[objectID] += 1;

        // store sequenceID, _hashData
        objectIDOwner[objectID] = msg.sender;
        hashDataOfSequenceID[sequenceID] = _hashData;
        
        emit CreateID(objectID, sequenceID, _hashData);
        return objectID;
    }
    
    function updateID(bytes30 _objectID, bytes32 _hashData) public {
        require(msg.sender == objectIDOwner[_objectID] || objectIDCoordinators[_objectID][msg.sender] == true, "invalid sender");
        
        // generate new sequence ID
        bytes32 objectID32 = objectID32 | bytes32(_objectID);
        bytes32 newNonce = newNonce | bytes2(sequenceIDNonceOf[_objectID]);
        sequenceIDNonceOf[_objectID] += 1;
        bytes32 newSequenceID = objectID32 | (newNonce >> 240);
        
        // store sequenceID, _hashData
        hashDataOfSequenceID[newSequenceID] = _hashData;
        
        emit UpdateID(_objectID, newSequenceID, _hashData);
    }
    
    function changeOwner(bytes30 _objectID, address _newOwner) public {
        require(msg.sender == objectIDOwner[_objectID], "invalid sender");
        objectIDOwner[_objectID] = _newOwner;
        
        emit ChangeOwner(_objectID, _newOwner);
    }
    
    function addCoordinator(bytes30 _objectID, address _coordinator) public {
        require(msg.sender == objectIDOwner[_objectID], "invalid sender");
        objectIDCoordinators[_objectID][_coordinator] = true;
        
        emit AddCoordinator(_objectID, _coordinator);
    }
    
    function removeCoordinator(bytes30 _objectID, address _coordinator) public {
        require(msg.sender == objectIDOwner[_objectID], "invalid sender");
        objectIDCoordinators[_objectID][_coordinator] = false;
        
        emit RemoveCoordinator(_objectID, _coordinator);
    }
    
    function getHashDataBySequenceID(bytes32 _sequenceID) public view returns (bytes32) {
        return hashDataOfSequenceID[_sequenceID];
    }
} 