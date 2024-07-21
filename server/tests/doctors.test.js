const request = require('supertest');
const express = require('express');
const Doctor = require('../models/Doctor');
const doctorsRoute = require('../routes/doctors');

// Mock Mongoose model
jest.mock('../models/Doctor');

const app = express();
app.use(express.json());
app.use('/doctors', doctorsRoute);

describe('Doctors Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /doctors', async () => {
    const mockDoctors = [{ name: 'Dr. Smith', specialty: 'Cardiology' }];
    Doctor.find.mockResolvedValue(mockDoctors);

    const res = await request(app).get('/doctors');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDoctors);
  });

  test('POST /doctors/add', async () => {
    const newDoctor = { name: 'Dr. Brown', specialty: 'Dermatology' };
    Doctor.prototype.save.mockResolvedValue(newDoctor);

    const res = await request(app).post('/doctors/add').send(newDoctor);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(newDoctor);
  });

  test('POST /doctors/update/:id', async () => {
    const updatedDoctor = { name: 'Dr. Green', specialty: 'Neurology' };
    Doctor.findById.mockResolvedValue({
      save: jest.fn().mockResolvedValue(updatedDoctor),
    });

    const res = await request(app).post('/doctors/update/1').send(updatedDoctor);

    expect(res.status).toBe(200);
    expect(res.body).toBe('Doctor updated!');
  });

  test('DELETE /doctors/delete/:id', async () => {
    Doctor.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app).delete('/doctors/delete/1');

    expect(res.status).toBe(200);
    expect(res.body).toBe('Doctor deleted!');
  });
});
