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
