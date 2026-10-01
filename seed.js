// Optional helper: inserts sample data so you have something to test against
// immediately. Run once locally with: node seed.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleApartments = [
  {
    address: '123 Main St, Apt 4B',
    rent: 1450,
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 850,
    petsAllowed: true,
    contactInfo: 'landlord1@example.com',
    status: 'interested',
    notes: 'Close to campus, has in-unit laundry'
  },
  {
    address: '456 Oak Ave, Unit 12',
    rent: 1200,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 600,
    petsAllowed: false,
    contactInfo: '555-0192',
    status: 'contacted',
    notes: 'No pets, but great price'
  },
  {
    address: '789 Pine Rd, House',
    rent: 1900,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1400,
    petsAllowed: true,
    contactInfo: 'agent@rentals.com',
    status: 'viewing_scheduled',
    notes: 'Whole house, has a yard'
  }
];

const run = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  try {
    const db = client.db(process.env.DB_NAME || 'apartmentTrackerDB');

    const apartmentsResult = await db.collection('apartments').insertMany(sampleApartments);
    console.log(`Inserted ${apartmentsResult.insertedCount} apartments.`);

    const firstApartmentId = apartmentsResult.insertedIds[0];
    const viewingResult = await db.collection('viewings').insertOne({
      apartmentId: firstApartmentId,
      scheduledDate: '2026-09-25T16:00:00Z',
      attended: false,
      rating: null,
      notes: 'First viewing, ask about parking'
    });
    console.log(`Inserted 1 viewing (id: ${viewingResult.insertedId}) linked to apartment ${firstApartmentId}.`);
  } finally {
    await client.close();
  }
};

run().catch((err) => {
  console.error('Seeding failed:', err.message);
});
