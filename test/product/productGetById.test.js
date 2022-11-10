const chai = require('chai');
const db = require('../../api/infrastructure/models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const target = 'http://localhost:3001';
const createdProducts = []

describe('ProductGetById', () => {    
    let productId1; 
    let product1request;
    let getAPICountProduct1 = 0
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
    
    after(async()=>{
        await Promise.all(createdProducts.map(async(el)=>{
            await db.Product.destroy({where : {id:el}})
        }))
    })
    it('Should Get valid Product reponse',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products/${productId1}`)
        .set({ 'Content-Type': 'application/json'});
        getAPICountProduct1++
        createResponse.should.have.status(200);
        createResponse.body.name.should.equal(product1request.name);
        createResponse.body.price.should.equal(product1request.price);
        createResponse.body.description.should.equal(product1request.description);
        createResponse.body.currency.should.equal(product1request.currency);
    });

    it('Should Get other currency fields when passed in query params',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products/${productId1}?toCurrency=GBP`)
        .set({ 'Content-Type': 'application/json'});
        getAPICountProduct1++
        createResponse.should.have.status(200);
        createResponse.body.name.should.equal(product1request.name);
        createResponse.body.price.should.equal(product1request.price);
        createResponse.body.description.should.equal(product1request.description);
        createResponse.body.otherPrices.length.should.equal(1);
    });

    it('Should Get other currencies fields when multiple currencies requested in query params',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products/${productId1}?toCurrency=GBP&toCurrency=EUR`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(200);
        getAPICountProduct1++
        createResponse.body.name.should.equal(product1request.name);
        createResponse.body.price.should.equal(product1request.price);
        createResponse.body.description.should.equal(product1request.description);
        createResponse.body.currency.should.equal(product1request.currency);
        createResponse.body.currency.should.equal(product1request.currency);
        createResponse.body.otherPrices.length.should.equal(2);
    });

    it('Should have the view count same as the number of time get api is called',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products/${productId1}`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(200);
        createResponse.body.views.should.equal(getAPICountProduct1)
    });
    it('Should give a 404 on a non-existent Product',async()=>{
        const productId = Math.floor(Math.random() * 1000000)
        const createResponse = await chai.request(target)
        .get(`/products/${productId}`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(404);
    });

  });
  