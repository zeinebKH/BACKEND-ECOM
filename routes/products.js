const express = require('express');
const router = express.Router();
const {database} = require('../config/helper');

/* GET all products */
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page != 0) ? req.query.page : 1; // set the current page number
  let limit = (req.query.limit !== undefined && req.query.limit != 0) ? req.query.page : 10; // set limit of items per page

  let startValue;
  let endValue;

  if (page > 0){
    startValue = (page * limit ) - limit;
    endValue = page * limit;
  }else {
    startValue = 0;
    endValue = 10;
  }
  database.table('products as p')
          .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
          }])
          .withFields(['c.title as category',
                      'p.title as name',
                      'p.price',
                      'p.description',
                      'p.quantity',
                      'p.image',
                      'p.id'])
          .slice(startValue,endValue)
          .sort({id: .1})
          .getAll()
          .then(prods => {
            if (prods.length > 0){
              res.status(200).json({
                  count: prods.length,
                  products: prods
              });
            }else {
              res.json({message:'no products founds'});
            }
          } ).catch(err => console.log(err));
});

/* get single product */
router.get('/:prodId',async (req, res) => {
    let productId = req.params.prodId;

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.description',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id'
            ])
        .filter({'p.id': productId})
        .get()
        .then(prod => {
            if (prod){
                res.status(200).json(prod);
            }else {
                res.json({message:`no product founds with this ${productId} product Id`});
            }
        } ).catch(err => console.log(err));
});

/* get all product from one categorie*/
router.get('/category/:catName',async (req, res) => {
    let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; // set the current page number
    const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.page : 10; // set limit of items per page

    let startValue;
    let endValue;

    if (page > 0){
        startValue = (page * limit ) - limit;
        endValue = page * limit;
    }else {
        startValue = 0;
        endValue = 10;
    }

    const cat_title = req.params.catName;

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%' `
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.description',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startValue,endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0){
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            }else {
                res.json({message: `no products founds from ${cat_title} category`});
            }
        } ).catch(err => console.log(err));
});

module.exports = router;
