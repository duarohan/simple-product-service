const chai = require('chai');
const db = require('../../api/infrastructure/models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const target = 'http://localhost:3001';
const createdProducts = []

describe('ProductDelete', () => {    
    let productId1; 
    let product1request;
    before(async()=>{
        product1request = {
            "name" : `Product-${Math.floor(Math.random() * 1000000)}`,
            "price" : Math.floor(Math.random() * 100),
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse = await chai.request(target)
        .post('/products')
        .send(product1request)
        .set({ 'Content-Type': 'application/json'});
        productId1 = createResponse.body.id
        createdProducts.push(createResponse.body.id)
    })

    it('Should Be successfully deleted',async()=>{
        const request = {
            "name" : `Product-${Math.floor(Math.random() * 1000000)}`,
            "price" : `${Math.floor(Math.random() * 100)}`,
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse = await chai.request(target)
        .delete(`/products/${productId1}`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(204);
    });

    it('Should Not be found after delete',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products/${productId1}`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(404);
    });
  });
  