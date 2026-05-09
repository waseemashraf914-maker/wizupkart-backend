require('dotenv').config();

const express = require('express');
const axios = require('axios');
const aws4 = require('aws4');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());

app.use(express.json());

app.get('/', (req,res)=>{
  res.json({
    status:'running'
  });
});

app.post('/api/amazon/search', async (req,res)=>{

try{

const keyword = req.body.keyword || 'electronics';

const payload = {
  Keywords: keyword,
  Resources: [
  'ItemInfo.Title'
],
  PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.in',
  SearchIndex: 'Electronics'
};

const body = JSON.stringify(payload);

const opts = {
  host: 'webservices.amazon.in',
  path: '/paapi5/searchitems',
  service: 'ProductAdvertisingAPI',
  region: 'eu-west-1',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Amz-Target':
      'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
  },
  body
};

aws4.sign(opts, {
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY
});

const response = await axios({
  method:'POST',
  url:'https://webservices.amazon.in/paapi5/searchitems',
  headers: opts.headers,
  data: body
});

const items = response.data.SearchResult.Items || [];

const products = items.map(item => ({

  title:
    item.ItemInfo?.Title?.DisplayValue || 'Product',

  image:
    item.Images?.Primary?.Medium?.URL || '',

  price:
    item.Offers?.Listings?.[0]?.Price?.DisplayAmount
    || 'Check Amazon',

  link:
    item.DetailPageURL || '#'

}));

res.json({
  success:true,
  products
});

}catch(error){

console.error(
  error.response?.data || error.message
);

res.status(500).json({
  success:false,
  error: error.response?.data || error.message
});

}

});

app.listen(process.env.PORT || 5000);
