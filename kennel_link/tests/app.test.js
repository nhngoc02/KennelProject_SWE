const app = require('../app.js');
const request = require('supertest');
const session = require('supertest-session');


describe('App', () => {
  let server;
  let mongoServer;
  let testSession;

  beforeAll(done => {
    testSession = session(app);
    server = app.listen(4000, () => {
            console.log('Test server is running on port 4000');
      done();
    });
  });

  afterAll(done => {
    server.close(done);
    testSession.destroy();
  });

  it('should start without crashing', async () => {
    // Send a GET request to the root URL ("/")
    const response = await request(server).get('/');
    
    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);
  });

  it('should login employee successfully', async () => {
    const employeeCredentials = {
      username: 'tdelgado',
      password: 'SHAKEIT2023',
      user_type: 'employee'
    };
  
    // Send a POST request to the login endpoint using the session instance
    const response = await testSession
      .post('/login')
      .send(employeeCredentials);
  
    expect(response.status).toBe(200);
    expect(response.text).toContain('pages/dashboard');
  });

  it('should login client successfully', async () => {
    const clientCredentials = {
      username: 'janesmith',
      password: 'password2',
      user_type: 'client'
    };

    const response = await request(app)
      .post('/login')
      .send(clientCredentials);

    expect(response.status).toBe(200);
    expect(response.text).toContain('pages/dashboard');
  });


  //test sign up for employee and client 
  // - should also test for creation of duplicate accounts 

  // test client and employee pet search functionality 

  // test that clients cannot search other clients

  // test employee client search functionality 

  // tests reservation creation 
  // - should not allow for duplicate reservations

  // test employee reservations search (should show all existing reservations)

  // test client reservation search (should show only their reservations)

  // test employee and client remove pet functionality 

  // test employee remove client functionality 
});

