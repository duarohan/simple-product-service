const db = require('../../infrastructure/models');
const ApiError =require('../../../errorUtil/apiError');
const ajvValidationError = require('../../../errorUtil/ajvValidationError');
const Ajv = require('ajv');
const ajv = new Ajv({ removeAdditional: 'all', coerceTypes:true});

const { getCurrencyConversion } = require('../../infrastructure/external');
const postProductValidator = require('../validator/postProduct.json');
const getProductByIdValidator = require('../validator/getProductById.json');
const getProductsValidator = require('../validator/getProducts.json');


exports.getProducts = async (req,res,next)=>{
    let whereClause = {};
    let orderClause = [];
    let data;
    let paranoid =true;
    try{
      if (!ajv.validate(getProductsValidator, req.query)) {
        const apiError = ajvValidationError(ajv.errors[0], 'product');
        next(apiError);
        return;
      }
      const {limit, offset, sortBy, includeDeletes} = req.query
      if(sortBy){
        orderClause.push([sortBy, 'DESC'])
      }
      console.log(orderClause)
      if(includeDeletes){
        paranoid = false
      }
      data = await db.Product.findAndCountAll({
        where: whereClause,
        order: orderClause,
        limit: limit || 30,
        offset : offset || 0,
        paranoid
      });
    }catch(e){
      console.log(e)
    }
    res.status(200).send(data);
}


exports.getProductById = async(req,res,next)=>{
    const productId = Number(req.params.id)
    let response;
    let product;
    try{
      if (!ajv.validate(getProductByIdValidator, req.query)) {
        const apiError = ajvValidationError(ajv.errors[0], 'product');
        next(apiError);
        return;
      }
      let {toCurrency} = req.query;
      if(toCurrency && !Array.isArray(toCurrency)){
        toCurrency = new Array(toCurrency)
      }  
      product = await db.Product.findByPk(productId);
      if(!product){
        throw new ApiError('Not Found', 404,'product.not.found')
      }
      response = product.toJSON()
      if(toCurrency && toCurrency.length>0){
        const toCurrencyString = toCurrency.join(',')
        const otherPrices = await getCurrencyConversion(product.currency,toCurrencyString,product.price)
        response.otherPrices = otherPrices;
      }
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      next(e);
    }finally{
      await product.increment('views',{by:1})
    }
}

exports.createProduct = async (req,res,next)=>{
    const {name,price,currency,description} = req.body;
    let transaction;
    let data;
    try{
      if (!ajv.validate(postProductValidator, req.body)) {
        const apiError = ajvValidationError(ajv.errors[0], 'product');
        next(apiError);
        return;
      }
      transaction = await db.sequelize.transaction();
      data = await db.Product.create({name,
        price,
        currency,
        description
      },{transaction});
    }catch(e){
        await transaction.rollback()
        if(e.parent && e.parent.code==='ER_DUP_ENTRY'){
          next(new ApiError('Conflict', 409,'product.name.exist'))
          return;
        }
        console.log(e)
        next(e)
    }
    await transaction.commit();
    res.status(201).send({ id : data.id });
}

exports.deleteProduct = async (req,res,next)=>{
  const productId = Number(req.params.id)
  await db.Product.destroy({where : {id:productId}})
  res.status(204).send();
}