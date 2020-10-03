const express = require('express');
require('dotenv').config();
const app = express()
const cors=require('cors');
const bodyParser=require('body-parser');
app.use(cors());
app.use(bodyParser());
const port = 8080
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello is is working!')
})



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("amazon").collection("products");
  const orderCollection = client.db("amazon").collection("orderDetails");
  console.log('connection done');
  
  app.post('/addProduct',(req,res)=>{
    const products=req.body;
    // console.log(products);
    collection.insertMany(products)
    .then(result=>{
      res.send(result)
      
    })
  })
  app.get('/allProducts',(req,res)=>{
    collection.find({}).limit(81)
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
  app.post('/productsByKeys',(req,res)=>{
    console.log(req.body);
    collection.find({key:{$in:[...req.body]}})
    .toArray((err,documets)=>{
      res.send(documets)
    })
  })

  
  app.post('/orderDetails',(req,res)=>{
    const products=req.body;
    // console.log(products);
    orderCollection.insertOne(products)
    .then(result=>{
      console.log('working.........');
      res.send(result)
      
    })
  })



});




app.listen(process.env.PORT||port)