// ============================================
// PROBLEM 2: Banking System
// 1-N Relationship with Transactions
// ============================================

// STEP 1: Design collections using references

// Customers Collection
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customer_id", "name", "email", "phone"],
      properties: {
        customer_id: { bsonType: "string" },
        name:        { bsonType: "string" },
        email:       { bsonType: "string" },
        phone:       { bsonType: "string" }
      }
    }
  }
});

// Accounts Collection (references customer_id)
db.createCollection("accounts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["account_id", "customer_id", "account_type", "balance"],
      properties: {
        account_id:   { bsonType: "string" },
        customer_id:  { bsonType: "string" },
        account_type: {
          bsonType: "string",
          enum: ["Savings", "Current", "Fixed"]
        },
        balance: {
          bsonType: "number",
          minimum: 0,   // Balance cannot go below 0
          description: "Balance must be greater than or equal to zero"
        }
      }
    }
  }
});

// Insert sample customers
db.customers.insertMany([
  {
    customer_id: "CUST001",
    name: "Priya Nair",
    email: "priya@email.com",
    phone: "9876543210"
  },
  {
    customer_id: "CUST002",
    name: "Arjun Mehta",
    email: "arjun@email.com",
    phone: "9123456789"
  }
]);

// Insert sample accounts (one customer has multiple accounts)
db.accounts.insertMany([
  {
    account_id: "ACC001",
    customer_id: "CUST001",
    account_type: "Savings",
    balance: 15000
  },
  {
    account_id: "ACC002",
    customer_id: "CUST001",
    account_type: "Current",
    balance: 50000
  },
  {
    account_id: "ACC003",
    customer_id: "CUST002",
    account_type: "Savings",
    balance: 8000
  }
]);

// ============================================
// STEP 2-5: Fund Transfer Transaction
// ============================================

// Transfer amount
const transferAmount = 3000;
const fromAccount = "ACC001";
const toAccount   = "ACC003";

// STEP 2: Start transaction session
const session = db.getMongo().startSession();

try {
  session.startTransaction();

  // Check sender balance before deducting
  const sender = db.accounts.findOne(
    { account_id: fromAccount },
    { session }
  );

  if (sender && sender.balance >= transferAmount) {

    // STEP 3: Deduct amount from sender using $inc
    db.accounts.updateOne(
      { account_id: fromAccount },
      { $inc: { balance: -transferAmount } },
      { session }
    );

    // STEP 4: Add amount to receiver within same transaction
    db.accounts.updateOne(
      { account_id: toAccount },
      { $inc: { balance: transferAmount } },
      { session }
    );

    // STEP 5: Commit transaction - balance validation passed
    session.commitTransaction();
    print("✅ Transfer Successful! ₹" + transferAmount + " transferred.");

  } else {
    // STEP 5: Abort - insufficient balance
    session.abortTransaction();
    print("❌ Transfer Failed! Insufficient balance in account " + fromAccount);
  }

} catch (error) {
  session.abortTransaction();
  print("❌ Transaction Error: " + error.message);

} finally {
  session.endSession();
}

// Verify updated balances
print("\n--- Updated Account Balances ---");
db.accounts.find().pretty();
