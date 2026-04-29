// ============================================
// PROBLEM 1: Airline Reservation System
// Transactions & Validation
// ============================================

// STEP 1: Create collection with validation rule for seat_number
db.createCollection("bookings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["passenger_name", "seat_number", "flight_number", "flight_date", "status"],
      properties: {
        passenger_name: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        seat_number: {
          bsonType: "string",
          pattern: "^[A-Z][0-9]{1,2}$",  // Pattern: A1, B12, C3 etc.
          description: "Seat number must match pattern like A1, B12"
        },
        flight_number: {
          bsonType: "string",
          description: "Must be a string"
        },
        flight_date: {
          bsonType: "date",
          description: "Must be a valid date"
        },
        status: {
          bsonType: "string",
          enum: ["Confirmed", "Pending", "Cancelled"],
          description: "Status must be Confirmed, Pending, or Cancelled"
        }
      }
    }
  }
});

// Create seats collection to track availability
db.createCollection("seats", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["seat_number", "flight_number", "is_available"],
      properties: {
        seat_number: {
          bsonType: "string",
          pattern: "^[A-Z][0-9]{1,2}$"
        },
        is_available: {
          bsonType: "bool"
        }
      }
    }
  }
});

// Insert sample seat data
db.seats.insertMany([
  { seat_number: "A1", flight_number: "AI101", is_available: true },
  { seat_number: "A2", flight_number: "AI101", is_available: true },
  { seat_number: "B1", flight_number: "AI101", is_available: false },
  { seat_number: "B2", flight_number: "AI101", is_available: true },
  { seat_number: "C1", flight_number: "AI101", is_available: true }
]);

// ============================================
// STEP 2-5: Transaction for Seat Booking
// ============================================

// STEP 2: Start a transaction session
const session = db.getMongo().startSession();

// Define booking details
const passengerBooking = {
  passenger_name: "Rahul Sharma",
  seat_number: "A1",
  flight_number: "AI101",
  flight_date: new Date("2026-06-15"),
  status: "Pending"
};

try {
  // Start transaction
  session.startTransaction();

  // STEP 3: Check seat availability before booking
  const seatCheck = db.seats.findOne(
    { 
      seat_number: passengerBooking.seat_number,
      flight_number: passengerBooking.flight_number,
      is_available: true 
    },
    { session }
  );

  if (seatCheck) {
    // Seat is available - proceed with booking

    // Insert passenger booking record within transaction
    db.bookings.insertOne(
      {
        booking_id: "BK001",
        passenger_name: passengerBooking.passenger_name,
        seat_number: passengerBooking.seat_number,
        flight_number: passengerBooking.flight_number,
        flight_date: passengerBooking.flight_date,
        status: "Confirmed",
        booked_at: new Date()
      },
      { session }
    );

    // STEP 4: Update seat availability using $set within same transaction
    db.seats.updateOne(
      { 
        seat_number: passengerBooking.seat_number,
        flight_number: passengerBooking.flight_number 
      },
      { 
        $set: { is_available: false } 
      },
      { session }
    );

    // STEP 5: Commit the transaction
    session.commitTransaction();
    print("✅ Booking Successful! Seat " + passengerBooking.seat_number + " confirmed.");

  } else {
    // Seat not available - abort transaction
    session.abortTransaction();
    print("❌ Booking Failed! Seat " + passengerBooking.seat_number + " is not available.");
  }

} catch (error) {
  // Abort transaction on any error
  session.abortTransaction();
  print("❌ Transaction Failed! Error: " + error.message);

} finally {
  session.endSession();
  print("Session ended.");
}

// Verify bookings
print("\n--- All Bookings ---");
db.bookings.find().pretty();

print("\n--- Seat Availability ---");
db.seats.find().pretty();
