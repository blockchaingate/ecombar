pragma solidity ^0.7.6;
pragma abicoder v2;
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
}

contract Ecombar is Ownable {
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
        uint256 total;
    }

    struct Shipping {
        bytes30 id;
        bytes30 order_id;
    }

    //address iddockSmartContractAddress;
    uint coinType;
    uint taxRate;

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
        Product memory newProduct = Product(objectId, price);  
        products.push(newProduct);
        productById[objectId] = newProduct;
    }

    function getProductById(bytes30 id) public view returns (Product memory) {
        return productById[id];
    }           

    function createOrder(bytes30 objectId, OrderItem[] memory items, uint itemsCount, uint fullfilmentFee) public {

        //bytes30 id = idDockInstance.createID(0x0202, _hashData);
        uint total = fullfilmentFee; 
        for(uint i = 0; i < itemsCount; i++) {
            OrderItem memory item = items[i];
            bytes30 product_id = item.product_id;
            Product memory itemProduct = productById[product_id];
            total += (itemProduct.price * item.quantity);
        }
        Order memory order = Order(objectId, total);
        orders.push(order);
        orderById[objectId] = order;
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