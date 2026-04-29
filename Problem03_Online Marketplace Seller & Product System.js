// ============================================
// PROBLEM 3: Online Marketplace
// Embedding vs Referencing + Validation
// ============================================

// STEP 1: Design schema using references

// Sellers Collection
db.createCollection("sellers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["seller_id", "seller_name", "email", "city"],
      properties: {
        seller_id:   { bsonType: "string" },
        seller_name: { bsonType: "string" },
        email:       { bsonType: "string" },
        city:        { bsonType: "string" }
      }
    }
  }
});

// Products Collection with validation (references seller_id)
// STEP 3: Validation rule - price must be greater than zero
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "seller_id", "product_name", "product_price", "categories"],
      properties: {
        product_id:    { bsonType: "string" },
        seller_id:     { bsonType: "string" },
        product_name:  { bsonType: "string" },
        product_price: {
          bsonType: "number",
          minimum: 1,  // Price must be greater than zero
          description: "Product price must be greater than zero"
        },
        categories: {
          bsonType: "array",
          minItems: 1,  // Category list must not be empty
          description: "At least one category is required"
        },
        tags: {
          bsonType: "array"
        }
      }
    }
  }
});

// Insert sample sellers
db.sellers.insertMany([
  {
    seller_id: "SEL001",
    seller_name: "TechZone India",
    email: "techzone@shop.com",
    city: "Mumbai"
  },
  {
    seller_id: "SEL002",
    seller_name: "FashionHub",
    email: "fashion@shop.com",
    city: "Delhi"
  }
]);

// STEP 2: Insert product documents referencing seller_id
db.products.insertMany([
  {
    product_id: "PROD001",
    seller_id: "SEL001",       // Reference to seller
    product_name: "Wireless Earbuds",
    product_price: 1999,
    categories: ["Electronics", "Audio"],
    tags: ["wireless", "bluetooth", "earbuds"],
    stock: 50
  },
  {
    product_id: "PROD002",
    seller_id: "SEL001",
    product_name: "USB-C Hub",
    product_price: 899,
    categories: ["Electronics", "Accessories"],
    tags: ["usb", "hub", "laptop"],
    stock: 30
  },
  {
    product_id: "PROD003",
    seller_id: "SEL002",
    product_name: "Cotton Kurta",
    product_price: 599,
    categories: ["Fashion", "Men"],
    tags: ["cotton", "ethnic", "traditional"],
    stock: 100
  }
]);

// STEP 4: Update product category using $set
db.products.updateOne(
  { product_id: "PROD001" },
  {
    $set: {
      categories: ["Electronics", "Audio", "Premium"],
      tags: ["wireless", "bluetooth", "earbuds", "noise-cancelling"]
    }
  }
);
print("✅ Product category updated.");

// STEP 5: Retrieve all products by a specific seller
print("\n--- All Products by Seller SEL001 ---");
db.products.find(
  { seller_id: "SEL001" },
  { product_name: 1, product_price: 1, categories: 1, _id: 0 }
).pretty();

// Bonus: Join seller info using $lookup
print("\n--- Products with Seller Details (Lookup) ---");
db.products.aggregate([
  {
    $lookup: {
      from: "sellers",
      localField: "seller_id",
      foreignField: "seller_id",
      as: "seller_info"
    }
  },
  {
    $project: {
      product_name: 1,
      product_price: 1,
      categories: 1,
      "seller_info.seller_name": 1,
      "seller_info.city": 1
    }
  }
]).pretty();
