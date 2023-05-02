const app = require('./apptest')
const request = require('supertest')


describe('Auth', function () {
    beforeAll((done) => {
        request(app)
            .post('/auth/sign-up')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('username=TestUser')
            .send('password=Gabriel03')
            .send('passwordConfirmation=Gabriel03')
            .send('email=orlando-umanzor@hotmail.com')
            .expect(200)
            .then(()=>{
                done()
            })
    })
    

    describe('Sign Up', () => {
        test("Gets jwt on sign up", (done) => {
            request(app)
                .post('/auth/sign-up')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=Orlando')
                .send('password=Gabriel03')
                .send('passwordConfirmation=Gabriel03')
                .send('email=orlandojose729@gmail.com')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('token')
                    expect(response.body).toHaveProperty('user')
                    done()
                })
                .catch(error => done(error))
        })

        test("Returns error on unavailable email", (done) => {
            request(app)
                .post('/auth/sign-up')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=Orlando')
                .send('password=Gabriel03')
                .send('passwordConfirmation=Gabriel03')
                .send('email=orlando-umanzor@hotmail.com')
                .expect(400)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body[0]).toHaveProperty('msg')
                    done()
                })
                .catch(error => done(error))
        })

        test("Returns error on unavailable username", (done) => {
            request(app)
                .post('/auth/sign-up')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=TestUser')
                .send('password=Gabriel03')
                .send('passwordConfirmation=Gabriel03')
                .send('email=orlandoumanzor@hotmail.com')
                .expect(400)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body[0]).toHaveProperty('msg')
                    done()
                })
                .catch(error => done(error))
        })
    })

    describe('Login', () => {
        test("Returns jwt on successful login", (done) => {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=TestUser')
                .send('password=Gabriel03')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async response => {
                    expect(response.body).toHaveProperty('token')
                    expect(response.body).toHaveProperty('user')
                    done()
                })
                .catch(error => done(error))
        })

        test("Returns error on invalid login", (done) => {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=InvalidUser')
                .send('password=InvalidPassword')
                .expect(400)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('message')
                    done()
                })
                .catch(error => done(error))
        })
    })
})