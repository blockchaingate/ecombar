pragma solidity >=0.7.0 <0.9.0;

interface IdDockInterface {
    //function checkValidity(address _walletAddr) external view returns (bool);

    function createID(bytes2 _type, bytes32 _hashData) external returns (bytes30);
}

contract Ecombar {
    IdDockInterface public idDockInstance; 
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
        uint total;
    }

    //address iddockSmartContractAddress;
    uint coinType;
    uint taxRate;
    address owner;

    Product[] public products;
    Order[] public orders;
    mapping(bytes30 => Product) productById;
    mapping(bytes30 => Order) orderById;

    event CreateProduct(bytes30 _objectID);
    constructor(address iddockSmartContractAddr, uint coinId, uint taxrate) {
        //iddockSmartContractAddress = iddockSmartContractAddr;  
        idDockInstance = IdDockInterface(iddockSmartContractAddr);
        coinType = coinId;
        taxRate = taxrate;
        owner = msg.sender;
    }
 
    function createProduct(bytes2 _type, bytes32 _hashData, uint price) public {
        bytes30 id = idDockInstance.createID(_type, _hashData);
        Product memory newProduct = Product(id, price);  
        products.push(newProduct);
        productById[id] = newProduct;
    }

    function getProductById(bytes30 id) public view returns (Product memory) {
        return productById[id];
    }           

    function createOrder(bytes2 _type, bytes32 _hashData, OrderItem[] memory items, uint itemsCount, uint fullfilmentFee) public {
        bytes30 id = idDockInstance.createID(_type, _hashData);
        uint total = fullfilmentFee; 
        for(uint i = 0; i < itemsCount; i++) {
            OrderItem memory item = items[i];
            bytes30 product_id = item.product_id;
            Product memory itemProduct = productById[product_id];
            total += (itemProduct.price * item.quantity);
        }
        Order memory order = Order(id, total);
        orders.push(order);
        orderById[id] = order;
    }
}