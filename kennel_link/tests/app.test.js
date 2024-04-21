const app = require('../app.js');
const request = require('supertest');
const {authenticateLogin} = require("../scripts/signupLoginModel.js");

jest.mock('../scripts/signupLoginModel.js', () => ({
  authenticateLogin: jest.fn(),
}));

describe('App', () => {
  let server;
  let testSession;

  beforeAll(done => {
    testSession = request.agent(app);
    server = app.listen(4001, () => {
            console.log('Test server is running on port 4000');
      done();
    });
  });

  afterAll(done => {
    jest.clearAllMocks();
    server.close(done);
  });

  it('should start without crashing', async () => {
    // Send a GET request to the root URL ("/")
    const response = await request(server).get('/');
    
    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);
  });

  it('should login employee successfully', async () => {
    authenticateLogin.mockResolvedValueOnce({ worked: true });
    const employeeCredentials = {
      username: 'tdelgado',
      password: 'SHAKEIT2023',
      user_type: 'employee'
    };
  
    // Send a POST request to the login endpoint using the session instance
    const response = await request(app)
      .post('/login')
      .send(employeeCredentials);
  
    expect(response.status).toBe(200);
    //expect(response.text).toContain('pages/dashboard');
    //expect(response.body.worked).toBe(true);
  });

  it('should login client successfully', async () => {
    authenticateLogin.mockResolvedValueOnce({ worked: true });
    const clientCredentials = {
      username: 'janesmith',
      password: 'password2',
      user_type: 'client'
    };
    const response = await request(app)
    .post('/login')
    .send(clientCredentials);

    // Check the response body for the 'worked' property
    //const responseBody = response.body;
    //expect(responseBody).toHaveProperty('worked', true);

    expect(response.status).toBe(200); // Check for successful login
    //expect(response.text).toContain('pages/dashboard'); // Check if redirected to the dashboard
    //expect(response.body.worked).toBe(true); // Check if login worked
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
  // - set active flag to false 

  // test employee remove client functionality 
  // - set active flag to false
});

