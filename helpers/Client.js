const axios = require('axios');

class Client {
    constructor(url) {
        this.url = url;
    }

    async get(productId) {
        try {
            const { data } = await axios.get(`${this.url}/api/v0/produit/${productId}.json`);
            return data;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    async getProduct(productId) {
        try {
            const data = await this.get(productId);
            return {
                _id: data.code,
                name: data.product.product_name,
                quantity: data.product.product_quantity ? data.product.product_quantity : data.product.quantity,
                image_url: data.product.image_url,
                brand: data.product.brands,
                satured_fat: data.product.nutriments['saturated-fat_value'],
                fat: data.product.nutriments.fat,
                proteins: data.product.nutriments.proteins,
                sugars: data.product.nutriments.sugars,
                energy: data.product.nutriments.energy,
                salt: data.product.nutriments.salt_100g,
                fiber: data.product.nutriments.fiber,
                carbohydrates: data.product.nutriments.carbohydrates,
                sodium: data.product.nutriments.sodium,
                nutrient_levels: JSON.stringify(data.product.nutrient_levels),
                nutrition_grade: data.product.nutrition_grade_fr
            };
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = {
    openFoodFactsClient: new Client('https://fr.openfoodfacts.org'),
    openBeautyFactsClient: new Client('https://fr.openbeautyfacts.org')
};