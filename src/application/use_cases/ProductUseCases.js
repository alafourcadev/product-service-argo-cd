class ProductUseCases {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(data) {
        try {
            return await this.productRepository.createProduct(data);
        } catch (error) {
            throw new Error('Error creating product');
        }
    }

    async getProductById(id) {
        try {
            const product = await this.productRepository.getProductById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error fetching product');
        }
    }

    async getAllProducts() {
        try {
            return await this.productRepository.getAllProducts();
        } catch (error) {
            throw new Error('Error fetching products');
        }
    }

    async updateProduct(id, data) {
        try {
            const product = await this.productRepository.updateProduct(id, data);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error updating product');
        }
    }

    async deleteProduct(id) {
        try {
            const success = await this.productRepository.deleteProduct(id);
            if (!success) {
                throw new Error('Product not found');
            }
            return success;
        } catch (error) {
            throw new Error('Error deleting product');
        }
    }
}

module.exports = ProductUseCases;
