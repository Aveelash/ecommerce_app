import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js';

// function for add product

const addProduct = async (req, res) => {
    try {
        console.log("Request Files:", req.files); // Log req.files to see its structure
        console.log("Request Body:", req.body); // Log req.body to ensure data is there

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Check if at least one image is uploaded, you can modify this check if required
        const images = [];
        if (req.files.image1) {
            images.push(req.files.image1[0]);
        }
        if (req.files.image2) {
            images.push(req.files.image2[0]);
        }
        if (req.files.image3) {
            images.push(req.files.image3[0]);
        }
        if (req.files.image4) {
            images.push(req.files.image4[0]);
        }

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: sizes.split(","),
            image: imagesUrl,
            date: Date.now(),
        };

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log("Error:", error);
        res.json({ success: false, message: error.message });
    }
};




// function for list product

const listProducts = async (req, res) => {

    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log("Error:", error);
        res.json({ success: false, message: error.message });
    }

}

// function for removing product

const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log("Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// function for single product info

const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log("Error:", error);
        res.json({ success: false, message: error.message });
    }

}

export { listProducts, addProduct, removeProduct, singleProduct }