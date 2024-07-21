// tests/patients.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const patientsRoute = require('../routes/patients');

// Mock Mongoose model
jest.mock('../models/Patient');

const app = express();
app.use(express.json());
app.use('/patients', patientsRoute);

describe('Patients Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /patients', async () => {
    const mockPatients = [{ name: 'John Doe', age: 30, gender: 'Male' }];
    Patient.find.mockResolvedValue(mockPatients);

    const res = await request(app).get('/patients');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPatients);
  });

  test('POST /patients/add', async () => {
    const newPatient = { name: 'Jane Doe', age: 28, gender: 'Female' };
    Patient.prototype.save.mockResolvedValue(newPatient);

    const res = await request(app).post('/patients/add').send(newPatient);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(newPatient);
  });

  test('PUT /patients/:id', async () => {
    const updatedPatient = { name: 'John Smith', age: 35, gender: 'Male' };
    Patient.findById.mockResolvedValue({
      save: jest.fn().mockResolvedValue(updatedPatient),
    });

    const res = await request(app).put('/patients/1').send(updatedPatient);

    expect(res.status).toBe(200);
    expect(res.body).toBe('Patient updated!');
  });

  test('DELETE /patients/delete/:id', async () => {
    Patient.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app).delete('/patients/delete/1');

    expect(res.status).toBe(200);
    expect(res.body).toBe('Patient deleted!');
  });
});
