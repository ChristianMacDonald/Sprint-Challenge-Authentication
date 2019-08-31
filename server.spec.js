const request = require('supertest');
const bcrypt = require('bcryptjs');
const server = require('./api/server');
const db = require('./database/dbConfig');
const usersModel = require('./users/users-model');

beforeEach(async () => {
    await db('users').truncate();
});

describe('server.js', () => {
    describe('auth route', () => {
        describe('/register POST', () => {
            it('should return a Created status', async () => {
                let response = await request(server).post('/api/auth/register').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                expect(response.status).toEqual(201);
            });
            it('should return a JSON object', async () => {
                let response = await request(server).post('/api/auth/register').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                expect(response.type).toEqual('application/json');
            });
        });
        describe('/login POST', () => {
            it('should return an OK status', async () => {
                await request(server).post('/api/auth/register').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                let response = await request(server).post('/api/auth/login').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                expect(response.status).toEqual(200);
            });
            it('should return a JSON object', async () => {
                db('users').insert({
                    username: 'ChristianMacDonald',
                    password: bcrypt.hashSync('Chris999', 14)
                });
                let response = await request(server).post('/api/auth/login').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                expect(response.type).toEqual('application/json');
            });
        });
    });
    describe('jokes route', () => {
        describe('/jokes GET', () => {
            it('should return an OK status', async () => {
                await request(server).post('/api/auth/register').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                let token_response = await request(server).post('/api/auth/login').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                let token = token_response.body.token;
                let response = await request(server).get('/api/jokes').set('token', token);
                expect(response.status).toEqual(200);
            });
            it('should return a JSON object', async () => {
                await request(server).post('/api/auth/register').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                let token_response = await request(server).post('/api/auth/login').send({
                    username: 'ChristianMacDonald',
                    password: 'Chris999'
                });
                let token = token_response.body.token;
                let response = await request(server).get('/api/jokes').set('token', token);
                expect(response.type).toEqual('application/json');
            });
        });
    });
});