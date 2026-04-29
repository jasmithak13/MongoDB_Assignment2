// ============================================
// PROBLEM 5: E-Commerce Revenue Analytics
// Complex Aggregation Pipeline
// ============================================

// First, insert sample orders data
db.orders.insertMany([
  {
    order_id: "ORD001",
    product_id: "PROD001",
    customer_id: "CUST001",
    order_amount: 1999,
    order_date: new Date("2026-01-15"),
    delivery_status: "Delivered"
  },
  {
    order_id: "ORD002",
    product_id: "PROD001",
    customer_id: "CUST002",
    order_amount: 1999,
    order_date: new Date("2026-01-20"),
    delivery_status: "Delivered"
  },
  {
    order_id: "ORD003",
    product_id: "PROD002",
    customer_id: "CUST001",
    order_amount: 899,
    order_date: new Date("2026-02-01"),
    delivery_status: "Pending"
  },
  {
    order_id: "ORD004",
    product_id: "PROD003",
    customer_id: "CUST003",
    order_amount: 2500,
    order_date: new Date("2026-02-10"),
    delivery_status: "Delivered"
  },
  {
    order_id: "ORD005",
    product_id: "PROD002",
    customer_id: "CUST002",
    order_amount: 899,
    order_date: new Date("2026-02-15"),
    delivery_status: "Delivered"
  },
  {
    order_id: "ORD006",
    product_id: "PROD003",
    customer_id: "CUST001",
    order_amount: 2500,
    order_date: new Date("2026-03-01"),
    delivery_status: "Delivered"
  },
  {
    order_id: "ORD007",
    product_id: "PROD001",
    customer_id: "CUST003",
    order_amount: 1999,
    order_date: new Date("2026-03-10"),
    delivery_status: "Cancelled"
  },
  {
    order_id: "ORD008",
    product_id: "PROD004",
    customer_id: "CUST002",
    order_amount: 5000,
    order_date: new Date("2026-03-15"),
    delivery_status: "Delivered"
  }
]);

print("✅ Sample orders inserted.");

// ============================================
// AGGREGATION PIPELINE - Top Revenue Products
// ============================================

print("\n--- Top 10 Products by Revenue ---");

db.orders.aggregate([

  // STEP 1: Filter only "Delivered" orders
  {
    $match: {
      delivery_status: "Delivered"
    }
  },

  // STEP 2: Group by product_id and calculate total revenue
  {
    $group: {
      _id: "$product_id",
      total_revenue: { $sum: "$order_amount" },
      total_orders:  { $sum: 1 }
    }
  },

  // STEP 3: Project product_id and total revenue
  {
    $project: {
      _id: 0,
      product_id:    "$_id",
      total_revenue: 1,
      total_orders:  1
    }
  },

  // STEP 4: Sort by revenue in descending order
  {
    $sort: {
      total_revenue: -1
    }
  },

  // STEP 5: Limit to top 10 products
  {
    $limit: 10
  }

]).pretty();

// ============================================
// BONUS: Customer Purchase Trends
// ============================================

print("\n--- Customer Purchase Trends ---");

db.orders.aggregate([
  {
    $match: { delivery_status: "Delivered" }
  },
  {
    $group: {
      _id: "$customer_id",
      total_spent:  { $sum: "$order_amount" },
      total_orders: { $sum: 1 },
      avg_order:    { $avg: "$order_amount" }
    }
  },
  {
    $project: {
      _id: 0,
      customer_id:  "$_id",
      total_spent:  1,
      total_orders: 1,
      avg_order:    { $round: ["$avg_order", 2] }
    }
  },
  {
    $sort: { total_spent: -1 }
  }
]).pretty();
