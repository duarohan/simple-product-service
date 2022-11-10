const chai = require('chai');
const db = require('../../api/infrastructure/models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const target = 'http://localhost:3001';
const createdProducts = []

describe('ProductCreate', () => {    
    after(async()=>{
        await Promise.all(createdProducts.map(async(el)=>{
            await db.Product.destroy({where : {id:el}})
        }))
    })
    it('Should Create a Product for valid values',async()=>{
        const request = {
            "name" : `Product-${Math.floor(Math.random() * 1000000)}`,
            "price" : `${Math.floor(Math.random() * 100)}`,
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse = await chai.request(target)
        .post('/products')
        .send(request)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(201);
        createdProducts.push(createResponse.body.id)
    });

    it('Should not create a Product for missing name fields',async()=>{
        const request = {
            "price" : `${Math.floor(Math.random() * 100)}`,
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse = await chai.request(target)
        .post('/products')
        .send(request)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(400);
    });

    it('Should not create a Product for invalid value of name (character between 8-20) fields',async()=>{
        const request = {
            "name" : `Product`,
            "price" : `${Math.floor(Math.random() * 100)}`,
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse = await chai.request(target)
        .post('/products')
        .send(request)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(400);
    });

    it('Should not create a Product for with same name fields',async()=>{
        const sameNameProduct = `Product-${Math.floor(Math.random() * 1000000)}`;
        const request = {
            "name" : sameNameProduct,
            "price" : `${Math.floor(Math.random() * 100)}`,
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const firstCreateResponse = await chai.request(target)
        .post('/products')
        .send(request)
        .set({ 'Content-Type': 'application/json'});
        firstCreateResponse.should.have.status(201);
        createdProducts.push(firstCreateResponse.body.id)
        const secondCreateResponse = await chai.request(target)
        .post('/products')
        .send(request)
        .set({ 'Content-Type': 'application/json'});
        secondCreateResponse.should.have.status(409);
        
    });
    
  });
  