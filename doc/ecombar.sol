pragma solidity >=0.7.0 <0.9.0;
contract Ecombar {
    struct Store {
        bytes30 id;
        address smartContractAddress;
        uint coinType;
        uint taxRate;
        uint shippingTaxRate;
    }

    struct Product {
        bytes30 id;
        bytes30 store_id;
        uint price;
    }

    struct OrderItem {
        bytes30 product_id;
        uint quantity;
    }

    struct Order {
        bytes30 id;
        OrderItem[] items;
        uint shippingPrice;
    }

    mapping(address => Store[]) storesByAddress;
    mapping(bytes30 => Store) storesById;

    mapping(bytes30 => Product[]) productsByStoreId;
    mapping(bytes30 => Product) productById;

    function createStore(bytes30 id, address smartContractAddress, uint coinType, uint taxRate, uint shippingTaxRate) public {
        Store memory newStore = Store(id, smartContractAddress, coinType, taxRate, shippingTaxRate);  
        storesByAddress[msg.sender].push(newStore);
        storesById[id] = newStore;
    }

    function getStoresByAddress(address owner) public view returns (Store[] memory) {
        return storesByAddress[owner];
    }    

    function getStoreById(bytes30 id) public view returns (Store memory) {
        return storesById[id];
    }   

    function createProduct(bytes30 id, bytes30 store_id, uint price) public {
        Product memory newProduct = Product(id, store_id, price);  
        productsByStoreId[store_id].push(newProduct);
        productById[id] = newProduct;
    }

    function getProductsByStoreId(bytes30 store_id) public view returns (Product[] memory) {
        return productsByStoreId[store_id];
    }    

    function getProductById(bytes30 id) public view returns (Product memory) {
        return productById[id];
    }           
}