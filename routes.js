const express = require('express');
const productApi = require('./api/product/service/productApi');
const addCatch = require('./errorUtil/addCatch');

const router = express.Router();

router.get('/',function(req,res){
    res.send({status:'API working'})
})

router.get('/products',addCatch(productApi.getProducts))
router.get('/products/:id',addCatch(productApi.getProductById))
router.post('/products',addCatch(productApi.createProduct))
router.delete('/products/:id',addCatch(productApi.deleteProduct))

module.exports =router