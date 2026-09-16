const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Apartment Hunting Tracker API',
    description: 'API for tracking apartment listings and scheduled viewings while apartment hunting'
  },
  // TODO: once you create your Render service, replace this with your real
  // domain (e.g. 'apartment-tracker-xyz.onrender.com') and re-run: node swagger.js
  host: 'REPLACE_WITH_YOUR_RENDER_URL',
  schemes: ['https'],
  definitions: {
    Apartment: {
      address: '123 Main St, Apt 4B',
      rent: 1450,
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 850,
      petsAllowed: true,
      contactInfo: 'landlord@example.com',
      status: 'interested',
      notes: 'Close to campus, has in-unit laundry'
    },
    Viewing: {
      apartmentId: '507f1f77bcf86cd799439011',
      scheduledDate: '2026-09-20T15:00:00Z',
      attended: false,
      rating: null,
      notes: 'First viewing scheduled'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Regenerate swagger.json any time you add or change a route: node swagger.js
swaggerAutogen(outputFile, endpointsFiles, doc);
