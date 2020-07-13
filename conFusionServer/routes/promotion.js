const express = require('express');
const bodyParser = require('body-parser');

const promotion = express.Router();

promotion.use(bodyParser.json());

promotion.route('/')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  
  .get((req,res,next) => {
    res.end('will send all promotions to you!');
  })
  
  .post((req,res,next) => {
    res.end('will add the promotion: '+ req.body.name + ' with details: ' + req.body.description);
  })
  
  .put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  
  .delete((req,res,next) => {
    res.end('Deleting all the promotions!');
  });

  promotion.route('/:promoId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
  })

  .get((req,res,next) => {
  res.end('will send details of the promotions: ' + req.params.promoId + ' to you! ');
})

.post((req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions' + req.params.promoId);
})

.put((req,res,next) => {
 res.write('Updating the promo: ' + req.params.promoId);
 res.end('will update the promo: ' + req.body.name + 'with details:' +req.body.description);
})

.delete((req,res,next) => {
  res.end('Deleting promotions:' + req.params.promoId);
});

  
  module.exports = promotion;