const router = require('express').Router();
const viewingsController = require('../controllers/viewings');
const ensureAuthenticated = require('../middleware/ensureAuth');

router.get('/', viewingsController.getAllViewings);
router.get('/:id', viewingsController.getSingleViewing);

router.post('/', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', description: 'New viewing appointment', schema: { $ref: '#/definitions/Viewing' } }
  viewingsController.createViewing(req, res);
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated viewing appointment', schema: { $ref: '#/definitions/Viewing' } }
  viewingsController.updateViewing(req, res);
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  viewingsController.deleteViewing(req, res);
});

module.exports = router;
