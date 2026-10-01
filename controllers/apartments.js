const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const VALID_STATUSES = [
  'interested',
  'contacted',
  'viewing_scheduled',
  'applied',
  'rejected',
  'offer_received'
];

const REQUIRED_FIELDS = ['address', 'rent', 'bedrooms', 'bathrooms', 'petsAllowed', 'contactInfo', 'status'];

const validateApartment = (body) => {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (body.rent !== undefined && typeof body.rent !== 'number') {
    errors.push('rent must be a number');
  }
  if (body.bedrooms !== undefined && typeof body.bedrooms !== 'number') {
    errors.push('bedrooms must be a number');
  }
  if (body.bathrooms !== undefined && typeof body.bathrooms !== 'number') {
    errors.push('bathrooms must be a number');
  }
  if (body.squareFootage !== undefined && body.squareFootage !== null && typeof body.squareFootage !== 'number') {
    errors.push('squareFootage must be a number');
  }
  if (body.petsAllowed !== undefined && typeof body.petsAllowed !== 'boolean') {
    errors.push('petsAllowed must be true or false');
  }
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return errors;
};

const toDocument = (body) => ({
  address: body.address,
  rent: body.rent,
  bedrooms: body.bedrooms,
  bathrooms: body.bathrooms,
  squareFootage: body.squareFootage ?? null,
  petsAllowed: body.petsAllowed,
  contactInfo: body.contactInfo,
  status: body.status,
  notes: body.notes ?? ''
});

const getAllApartments = async (req, res) => {
  try {
    const apartments = await getDb().collection('apartments').find().toArray();
    res.status(200).json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleApartment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid apartment id' });
    }
    const apartment = await getDb().collection('apartments').findOne({ _id: new ObjectId(req.params.id) });
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.status(200).json(apartment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createApartment = async (req, res) => {
  try {
    const errors = validateApartment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const result = await getDb().collection('apartments').insertOne(toDocument(req.body));
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateApartment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid apartment id' });
    }
    const errors = validateApartment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const result = await getDb()
      .collection('apartments')
      .replaceOne({ _id: new ObjectId(req.params.id) }, toDocument(req.body));

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteApartment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid apartment id' });
    }
    const result = await getDb().collection('apartments').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllApartments,
  getSingleApartment,
  createApartment,
  updateApartment,
  deleteApartment,
  VALID_STATUSES
};
