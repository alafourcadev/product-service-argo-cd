const Product = require('../models/Product');

class ProductRepository {
    async createProduct(data) {
        return await Product.create(data);
    }

    async getProductById(id) {
        return await Product.findByPk(id);
    }

    async getAllProducts() {
        return await Product.findAll();
    }

    async updateProduct(id, data) {
        const product = await Product.findByPk(id);
        if (product) {
            return await product.update(data);
        }
        return null;
    }

    async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new ProductRepository();
