import request from 'supertest';
import express, { Express } from 'express';
import { loginValidation, validate } from '../authentication.validator';

describe('Authentication Validator', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/test', loginValidation, validate, (req, res) => {
      res.json({ success: true });
    });
  });

  describe('loginValidation', () => {
    it('should pass validation with valid credentials', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should fail validation when username is missing', async () => {
      const response = await request(app).post('/test').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should fail validation when password is missing', async () => {
      const response = await request(app).post('/test').send({
        username: 'testuser',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail validation when username is empty', async () => {
      const response = await request(app).post('/test').send({
        username: '',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should fail validation when password is empty', async () => {
      const response = await request(app).post('/test').send({
        username: 'testuser',
        password: '',
      });

      expect(response.status).toBe(400);
    });

    it('should trim whitespace from username and password', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: '  testuser  ',
          password: '  password123  ',
        });

      expect(response.status).toBe(200);
    });

    it('should fail validation when username exceeds 255 characters', async () => {
      const longUsername = 'a'.repeat(256);

      const response = await request(app).post('/test').send({
        username: longUsername,
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should fail validation when password exceeds 255 characters', async () => {
      const longPassword = 'a'.repeat(256);

      const response = await request(app).post('/test').send({
        username: 'testuser',
        password: longPassword,
      });

      expect(response.status).toBe(400);
    });
  });
});

