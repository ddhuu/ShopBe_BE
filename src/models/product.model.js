"use strict";

const { model, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String, //
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },


  //more
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1,'Rating must above 1.0'],
    max: [5,'Rating must be less than or equal 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublished:{
    type: Boolean,
    default: false,
    index: true,
    select: false
  }
},
   
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// define the product type => Clothing

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

// define the product type => Electronic

const electronicSchema = new Schema(
  {
    manufacturor: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "furnitures",
    timestamps: true,
  }
);

// create index for search
productSchema.index({
  product_name: 'text',
  product_description: 'text'
})

// Document middleware: run before .save() and .create()...
productSchema.pre('save',function(next){
  this.product_slug = slugify(this.product_name,{lower: true})
  next()
})
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furnitures", furnitureSchema),
};
