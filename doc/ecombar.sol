pragma solidity ^0.7.6;
pragma abicoder v2;
import "./SafeMath.sol";
import "./ownable.sol";
import "./enum-status.sol";
interface IdDockInterface {
    function createID(bytes2 _type, bytes32 _hashData) external returns (bytes30);
}

interface FeeChargerInterface {
    
    function getOrderInfo(bytes32 _orderID) external view 
        returns (
            address _customer,
            uint32 _coinType,
            address _merchantRecipient,
            uint256 _merchantGet,
            address _exchangilyRecipient,
            uint256 _exchangilyGet,
            Status _orderStatus);

    function chargeFundsWithFeeWithSig(
        bytes32 _orderID,
        address _user,
        uint32 _coinType,
        uint256 _totalAmount,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address[] memory _rewardBeneficiary)
        external 
        returns (bool); 

    function requestRefundWithSig(bytes32 _orderID, address _user, uint8 v, bytes32 r, bytes32 s) 
    external returns (bool);
    function cancelRefundRequest(bytes32 _orderID, address _user, uint8 v, bytes32 r, bytes32 s) 
    external returns (bool);
    function refundWithSig(bytes32 _orderID, uint8 v, bytes32 r, bytes32 s) 
    external returns (bool);
}

contract Ecombar is Ownable {
    using SafeMath for uint256;
    IdDockInterface public idDockInstance; 
    FeeChargerInterface public feeChargerInstance;

    struct Product {
        bytes30 id;
        uint price;
    }

    struct OrderItem {
        bytes30 product_id;
        uint quantity;
    }

    struct Order {
        bytes30 id;
        bytes30[] productObjectIds;
        uint8[] quantities;
        uint256 total;
    }

    struct Shipping {
        bytes30 id;
        bytes30 order_id;
    }

    //address iddockSmartContractAddress;
    uint32 coinType;
    uint8 taxRate;

    Product[] public products;
    Order[] public orders;
    mapping(bytes30 => Product) productById;
    mapping(bytes30 => Order) orderById;

    mapping(bytes30 => Shipping) shippingById;
    event CreateProduct(bytes30 _objectID);
    constructor(
        address feeChargerSmartContractAddr, 
        uint32 _coinType, 
        uint8 taxrate) {
        //iddockSmartContractAddress = iddockSmartContractAddr;  
        feeChargerInstance = FeeChargerInterface(feeChargerSmartContractAddr);
        coinType = _coinType;
        taxRate = taxrate;
    }
 
    function changeFeeChargerSmartContractAddr(address addr) public{
        feeChargerInstance = FeeChargerInterface(addr);
    }

    function createProduct(bytes30 objectId, uint price) public onlyOwner {
        require(price > 0);
        Product memory newProduct = Product(objectId, price);  
        products.push(newProduct);
        productById[objectId] = newProduct;
    }

    function getProductById(bytes30 id) public view returns (Product memory) {
        return productById[id];
    }           

    function getOrderById(bytes30 id) public view returns (Order memory) {
        return orderById[id];
    }   


    function createOrder(bytes30 objectId, bytes30[] memory productObjectIds, uint8[] memory quantities, uint256 total) public {
        require(total > 0);
        Order memory order = Order(objectId, productObjectIds, quantities, total);
        orders.push(order);
        orderById[objectId] = order;
    }

    function payOrder(bytes30 objectId, 
        uint256 fullfilmentFee,
        address _user,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address[] memory _rewardBeneficiary) public {
        Order memory order = orderById[objectId];
        uint256 total = order.total.add(fullfilmentFee);
        feeChargerInstance.chargeFundsWithFeeWithSig(
        bytes32(objectId),
        _user,
        coinType,
        total,
        v,
        r,
        s,
        _rewardBeneficiary);
    }

    function requestRefundWithSig(bytes30 objectId, address _user, uint8 v, bytes32 r, bytes32 s) 
    public returns (bool) {
        return feeChargerInstance.requestRefundWithSig(bytes32(objectId), _user, v, r, s);
    }

    function cancelRefundRequest(bytes32 objectId, address _user, uint8 v, bytes32 r, bytes32 s) 
    public returns (bool) {
        return feeChargerInstance.cancelRefundRequest(bytes32(objectId), _user, v, r, s);
    }

    function refundWithSig(bytes32 objectId, uint8 v, bytes32 r, bytes32 s) 
    public onlyOwner returns (bool) {
        return feeChargerInstance.refundWithSig(bytes32(objectId), v, r, s);
    }

    function getChargePayOrderParams(bytes30 objectId, 
        uint256 fullfilmentFee,
        address _user,
        uint8 v,
        bytes32 r,
        bytes32 s) public view returns (bytes32, address, uint32, uint256, uint8, bytes32, bytes32){
        Order memory order = orderById[objectId];
        uint256 total = order.total.add(fullfilmentFee);
        return (
            bytes32(objectId),
            _user,
            coinType,
            total,
            v,
            r,
            s            
        );
    }

    function isPaid(bytes30 id) public view returns (bool) {
        (
            address _customer,
            uint32 _coinType,
            address _merchantRecipient,
            uint256 _merchantGet,
            address _exchangilyRecipient,
            uint256 _exchangilyGet,
            Status _orderStatus) = feeChargerInstance.getOrderInfo(id);
        uint256 total = _merchantGet + _exchangilyGet;

        Order memory order = orderById[id];
        if(order.total == total && _orderStatus == Status.TRANSFERRED) {
            return true;
        }
        return false;
    }


    function createShipping(bytes30 objectId, bytes30 order_id) public onlyOwner {
        bool orderPaid = isPaid(order_id);
        require(orderPaid);
        Shipping memory shipping = Shipping(objectId, order_id);
        shippingById[objectId] = shipping;
    }
}