const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../playstoreapp');
const { response } = require('../playstoreapp');

describe('PlayStore App', () => {
  it('Should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1); 
        const testApp = res.body[0];
        expect(testApp).to.include.all.keys(
          'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 
          'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 
          'Current Ver', 'Android Ver');
      })
  })

  it('should return an error if sort does not equal Rating or App', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'Goats'})
      .expect(400, 'Sort must be "rating" or "app"');
  });

  it('should return an error if genres is not a valid value', () => {
    return supertest(app)
    .get('/apps')
    .query({genres: 'Lambs'})
    .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.');
  });

  it('should sort by App', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'App'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;
        while( i < res.body.length -1) {
          const appAtI = res.body[i];
          const appAtIPlusOne = res.body[i+1];
          if(appAtIPlusOne.app < appAtI.app) {
            sorted = false;
            break;
          }
          i++
        }
        expect(sorted).to.be.true;
      });
  });

  it('should sort by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'Rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        const sorted = true;
        let i = 0;
        while(i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlusOne = res.body[i+1];
          if(appAtIPlusOne < appAtI) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});