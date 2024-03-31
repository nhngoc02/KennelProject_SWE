const app = require('../app.js');
const request = require('supertest');

describe('App', () => {
  let server;

  beforeAll(done => {
    server = app.listen(4000, () => {
      console.log('Test server is running on port 4000');
      done();
    });
  });

  afterAll(done => {
    server.close(done);
  });

  it('should start without crashing', async () => {
    // Send a GET request to the root URL ("/")
    const response = await request(server).get('/');
    
    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);
  });
});

