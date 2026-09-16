const router = require('express').Router();
const viewingsController = require('../controllers/viewings');

router.get('/', viewingsController.getAllViewings);
router.get('/:id', viewingsController.getSingleViewing);

router.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', description: 'New viewing appointment', schema: { $ref: '#/definitions/Viewing' } }
  viewingsController.createViewing(req, res);
});

router.put('/:id', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated viewing appointment', schema: { $ref: '#/definitions/Viewing' } }
  viewingsController.updateViewing(req, res);
});

router.delete('/:id', viewingsController.deleteViewing);

module.exports = router;
