const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const REQUIRED_FIELDS = ['apartmentId', 'scheduledDate'];

const validateViewing = (body) => {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (body.apartmentId !== undefined && body.apartmentId !== null && !ObjectId.isValid(body.apartmentId)) {
    errors.push('apartmentId must be a valid apartment id');
  }
  if (body.attended !== undefined && typeof body.attended !== 'boolean') {
    errors.push('attended must be true or false');
  }
  if (body.rating !== undefined && body.rating !== null) {
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      errors.push('rating must be a number between 1 and 5');
    }
  }

  return errors;
};

// Confirms the referenced apartment actually exists before we accept a
// viewing for it — a real foreign-key style integrity check, not just a
// format check on the id.
const apartmentExists = async (apartmentId) => {
  const apartment = await getDb().collection('apartments').findOne({ _id: new ObjectId(apartmentId) });
  return apartment !== null;
};

const toDocument = (body) => ({
  apartmentId: new ObjectId(body.apartmentId),
  scheduledDate: body.scheduledDate,
  attended: body.attended ?? false,
  rating: body.rating ?? null,
  notes: body.notes ?? ''
});

const getAllViewings = async (req, res) => {
  try {
    const viewings = await getDb().collection('viewings').find().toArray();
    res.status(200).json(viewings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleViewing = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid viewing id' });
    }
    const viewing = await getDb().collection('viewings').findOne({ _id: new ObjectId(req.params.id) });
    if (!viewing) {
      return res.status(404).json({ message: 'Viewing not found' });
    }
    res.status(200).json(viewing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createViewing = async (req, res) => {
  try {
    const errors = validateViewing(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (!(await apartmentExists(req.body.apartmentId))) {
      return res.status(400).json({ message: 'apartmentId does not match any existing apartment' });
    }

    const result = await getDb().collection('viewings').insertOne(toDocument(req.body));
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateViewing = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid viewing id' });
    }
    const errors = validateViewing(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (!(await apartmentExists(req.body.apartmentId))) {
      return res.status(400).json({ message: 'apartmentId does not match any existing apartment' });
    }

    const result = await getDb()
      .collection('viewings')
      .replaceOne({ _id: new ObjectId(req.params.id) }, toDocument(req.body));

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Viewing not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteViewing = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid viewing id' });
    }
    const result = await getDb().collection('viewings').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Viewing not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllViewings,
  getSingleViewing,
  createViewing,
  updateViewing,
  deleteViewing
};
