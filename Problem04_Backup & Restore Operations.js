// ============================================
// PROBLEM 4: Backup & Restore
// Using mongodump and mongorestore (Run in Terminal)
// ============================================

// -------------------------------------------------
// STEP 1: Full database backup using mongodump
// Run this in your terminal/command prompt:
// -------------------------------------------------
// mongodump --db=myDatabase --out=/backup/fullbackup

// Example with authentication:
// mongodump --uri="mongodb://localhost:27017" --db=myDatabase --out=/backup/fullbackup

// -------------------------------------------------
// STEP 2: Restore backup to a new database
// -------------------------------------------------
// mongorestore --db=myDatabase_restored /backup/fullbackup/myDatabase

// -------------------------------------------------
// STEP 3: Backup a specific collection only
// -------------------------------------------------
// mongodump --db=myDatabase --collection=products --out=/backup/collection_backup

// -------------------------------------------------
// STEP 4: Restore a specific collection from backup
// -------------------------------------------------
// mongorestore --db=myDatabase_restored --collection=products /backup/collection_backup/myDatabase/products.bson

// ============================================
// MongoDB Shell Commands for Verification
// ============================================

// STEP 5: Verify restored data - count documents
// Switch to restored database
use myDatabase_restored;

// Count documents in restored collection
const count = db.products.countDocuments();
print("Total documents in restored products collection: " + count);

// Verify by listing all documents
print("\n--- Restored Products ---");
db.products.find().pretty();

// Count all collections in the restored database
print("\n--- Collections in Restored Database ---");
db.getCollectionNames().forEach(col => {
  print(col + " → " + db[col].countDocuments() + " documents");
});
