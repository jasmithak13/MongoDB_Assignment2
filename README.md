# MongoDB_Assignment2

## 📚 About This Assignment
This assignment covers advanced MongoDB concepts including Transactions,
Schema Validation, Schema Design (Embedding vs Referencing),
Backup & Restore Operations, and Complex Aggregation Pipelines.

---

## 📁 File Structure
mongodb-advanced-assignment/
├── problem1_airline_reservation.js
├── problem2_banking_system.js
├── problem3_online_marketplace.js
├── problem4_backup_restore.js
├── problem4_backup_restore.sh
├── problem5_ecommerce_analytics.js
└── README.md

## 🛠️ Advanced Topics Covered
- MongoDB Transactions (startTransaction, commitTransaction, abortTransaction)
- Schema Validation using $jsonSchema
- One-to-Many Relationships using References
- Embedding vs Referencing Schema Design
- mongodump and mongorestore for Backup & Restore
- Aggregation Pipeline ($match, $group, $project, $sort, $limit)
- Atomic Operations using $set and $inc

## ⚙️ How to Run

### Prerequisites
- MongoDB 6.0 or above (Transactions require Replica Set)
- MongoDB Shell (mongosh)
- Terminal / Command Prompt

### Run JavaScript Files
mongosh < problem1_airline_reservation.js

### Run Backup Commands (Terminal)
bash problem4_backup_restore.sh

---

## 📝 Problem Summary

| No. | Problem Name | Key Concepts Used |
|-----|-------------|-------------------|
| 1 | Airline Reservation System | Validation, Transactions, Commit/Abort |
| 2 | Banking Account System | 1-N References, $inc, Fund Transfer |
| 3 | Online Marketplace | Schema Design, $lookup, $set, Validation |
| 4 | Backup & Restore | mongodump, mongorestore, countDocuments |
| 5 | E-Commerce Analytics | $match, $group, $project, $sort, $limit |

---

## 🔍 Problem Details

### Problem 1 – Airline Reservation System
- Created validation rule for seat_number pattern (e.g., A1, B12)
- Used MongoDB session to start a transaction
- Inserted booking record within the transaction
- Updated seat availability using $set
- Committed or aborted based on seat availability check

### Problem 2 – Banking System
- Designed customers and accounts collections using references
- Used $inc to deduct amount from sender account
- Used $inc to credit amount to receiver account
- Committed transaction if balance is sufficient, else aborted
- Validation ensures balance never goes below zero

### Problem 3 – Online Marketplace
- Designed schema using references between sellers and products
- Created validation to ensure price > 0 and categories not empty
- Used $lookup aggregation to join seller and product data
- Updated product categories using $set

### Problem 4 – Backup & Restore
- Full database backup using mongodump
- Restored backup to a new database using mongorestore
- Performed collection-level backup and restore
- Verified restored data using countDocuments()

### Problem 5 – E-Commerce Analytics
- Filtered delivered orders using $match
- Calculated total revenue per product using $group and $sum
- Projected only required fields using $project
- Sorted products by revenue using $sort
- Limited results to top 10 using $limit

---

## 🔧 Tools & Technologies Used
- MongoDB 7.0
- MongoDB Shell (mongosh)
- MongoDB Transactions (Replica Set)
- mongodump & mongorestore
- VS Code
- Terminal / Bash

---

## ⚠️ Important Notes
- Transactions in MongoDB require a Replica Set setup
- To enable Replica Set locally, add `replication: replSetName: "rs0"`
  in your mongod.cfg file and run `rs.initiate()` in mongosh
- Backup files are stored in /backup/ directory
- All aggregation results are sorted in descending order by default

---

## 📊 Key MongoDB Commands Used

| Command | Purpose |
|---------|---------|
| session.startTransaction() | Begin a transaction |
| session.commitTransaction() | Save all changes |
| session.abortTransaction() | Roll back all changes |
| $jsonSchema | Validate document structure |
| $inc | Increment or decrement a value |
| $set | Update a specific field |
| mongodump | Create database backup |
| mongorestore | Restore from backup |
| $match | Filter documents in pipeline |
| $group | Group and aggregate data |
| $sort | Sort aggregation results |
| $limit | Limit number of results |
| $lookup | Join two collections |
