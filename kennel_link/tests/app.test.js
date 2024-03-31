import React from 'react';
const { render }  = require( '@testing-library/react');

const app = require('../app');

const PORT = 4000;
let server;

beforeAll(async () => {
    server = app.listen(PORT, () => {
        console.log('Now Listening on port ${PORT}');
    });
  });

// After running tests, close the server
afterAll(done => {
    server.close(() => {
        console.log("server closed");
    });
  });
test('renders without crashing', async() => {
  render(<App />);
});