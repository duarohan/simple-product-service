const chai = require('chai');
const db = require('../../api/infrastructure/models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const target = 'http://localhost:3001';
const createdProducts = []

describe('ProductGetAll', () => {    
    before(async()=>{
        const product1request = {
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
        
        const product2request = {
            "name" : `Product-${Math.floor(Math.random() * 1000000)}`,
            "price" : Math.floor(Math.random() * 100),
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse2 = await chai.request(target)
        .post('/products')
        .send(product2request)
        .set({ 'Content-Type': 'application/json'});
        productId2 = createResponse2.body.id
        createdProducts.push(createResponse2.body.id)

        const product3request = {
            "name" : `Product-${Math.floor(Math.random() * 1000000)}`,
            "price" : Math.floor(Math.random() * 100),
            "currency": "USD",
            "description" : `Product-${Math.floor(Math.random() * 1000000)}`
        }
        const createResponse3 = await chai.request(target)
        .post('/products')
        .send(product3request)
        .set({ 'Content-Type': 'application/json'});
        productId3 = createResponse3.body.id
        createdProducts.push(createResponse3.body.id)
    })
    
    after(async()=>{
        await Promise.all(createdProducts.map(async(el)=>{
            await db.Product.destroy({where : {id:el}})
        }))
    })

    it('Should limit the searched based on the limit passed',async()=>{
        const createResponse = await chai.request(target)
        .get(`/products?limit=2`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(200);
        createResponse.body.rows.length.should.be.at.most(2);
    });

    it('Should have same count all values irrespective of the query params',async()=>{
        const getAllProducts = await chai.request(target)
        .get(`/products`)
        .set({ 'Content-Type': 'application/json'});
        
        const createResponse = await chai.request(target)
        .get(`/products?limit=2`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(200);
        createResponse.body.count.should.equal(getAllProducts.body.count);

    });

    it('Should order the searches based on the views',async()=>{
        const viewCount20 = new Array(20).fill(0)
        await Promise.all(viewCount20.map(async(el)=>{
            await chai.request(target)
            .get(`/products/${productId1}`)
            .set({ 'Content-Type': 'application/json'});
        }))
        const viewCount40 = new Array(40).fill(0)
        await Promise.all(viewCount40.map(async(el)=>{
            await chai.request(target)
            .get(`/products/${productId2}`)
            .set({ 'Content-Type': 'application/json'});
        }))

        const createResponse = await chai.request(target)
        .get(`/products?limit=2&sortBy=views`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.body.rows[0].views.should.equal(40)
        createResponse.body.rows[0].id.should.equal(productId2)
        createResponse.body.rows[1].id.should.equal(productId1)
        createResponse.body.rows[1].views.should.equal(20)
    });

    it('Should get deleted Products from the list',async()=>{
        await chai.request(target)
        .delete(`/products/${productId3}`)
        .set({ 'Content-Type': 'application/json'});

        const createResponse = await chai.request(target)
        .get(`/products?limit=1&includeDeletes=true&sortBy=id`)
        .set({ 'Content-Type': 'application/json'});
        createResponse.should.have.status(200);
        createResponse.body.rows[0].id.should.equal(productId3)
    });

  });
  