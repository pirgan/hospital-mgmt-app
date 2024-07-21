const request = require('supertest');
const express = require('express');
const Appointment = require('../models/Appointment');
const appointmentsRoute = require('../routes/appointments');

// Mock Mongoose model
jest.mock('../models/Appointment');

const app = express();
app.use(express.json());
app.use('/appointments', appointmentsRoute);

describe('Appointments Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /appointments', async () => {
    const mockAppointments = [{ patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2022-07-01' }];
    Appointment.find.mockResolvedValue(mockAppointments);

    const res = await request(app).get('/appointments');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAppointments);
  });

  test('POST /appointments/add', async () => {
    const newAppointment = { patientName: 'Jane Doe', doctorName: 'Dr. Brown', date: '2022-07-02' };
    Appointment.prototype.save.mockResolvedValue(newAppointment);

    const res = await request(app).post('/appointments/add').send(newAppointment);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(newAppointment);
  });

  test('POST /appointments/update/:id', async () => {
    const updatedAppointment = { patientName: 'John Doe', doctorName: 'Dr. Green', date: '2022-07-03' };
    Appointment.findById.mockResolvedValue({
      save: jest.fn().mockResolvedValue(updatedAppointment),
    });

    const res = await request(app).post('/appointments/update/1').send(updatedAppointment);

    expect(res.status).toBe(200);
    expect(res.body).toBe('Appointment updated!');
  });

  test('DELETE /appointments/delete/:id', async () => {
    Appointment.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app).delete('/appointments/delete/1');

    expect(res.status).toBe(200);
    expect(res.body).toBe('Appointment deleted.');
  });
});
