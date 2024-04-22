const app = require('../app.js');
const request = require('supertest');


describe('App', () => {
  let server;
  let mongoServer;

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

  it('sign up a new employee successfully', async () => {
    const employeeData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      employee_start_date: '2024-03-30',
      username: 'johndoe',
      password: 'password123'
    };

    const response = await request(server)
      .post('/employeesignup')
      .send(employeeData);

    // Check if the response status is 201 (Created)
    expect(response.status).toBe(201);
    // Check if the response text contains the success message
    expect(response.text).toContain('Employee signup successful!');
  });

});

