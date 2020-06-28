const express = require('express');
const morgan = require('morgan');

const cors = require('cors');

const playstoreapp = express();

playstoreapp.use(morgan('common'));
playstoreapp.use(cors());

const apps = require('./apps-data.js');
playstoreapp.get('/apps', (req ,res) => {
  const { sort, genres } = req.query;
  let results=apps;
      
    if(genres){
      if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
        res.status(400).send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.');
        }
        results = apps.filter(app => app.Genres.includes(genres));
    }
  
    if(sort){
      if(!['Rating', 'App'].includes(sort)){
        res.status(400).send('Sort must be "rating" or "app"')
        }
        results = results.sort((a, b) =>{
          return a[sort] > b[sort] ? 1 : a[sort] <b[sort] ? -1 : 0;
        });
    }
    res.json(results);
    
  });

  module.exports = playstoreapp;