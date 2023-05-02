const app = require('./apptest')
const request = require('supertest')

describe('API', () => {
    let token
    let post
    let comment

    beforeAll(async () => {
        //Authenticate test user with admin Permissions
        let response = await request(app)
            .post('/auth/sign-up')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('username=TestUser')
            .send('password=Gabriel03')
            .send('passwordConfirmation=Gabriel03')
            .send('email=orlando-umanzor@hotmail.com')
            .send('isAdmin=true')
            .expect(200)

        token = response.body.token
    })

    beforeEach(async () => {
        let response = await request(app)
            .post('/posts')
            .auth(token, { type: 'bearer' })
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('content=Test Content')
            .send('title=Test Title')
            .expect(200)
        post = response.body
        let commentResponse = await request(app)
            .post(`/posts/${post._id}/comments`)
            .auth(token, { type: 'bearer' })
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('content=Test Content')
            .expect(200)
        comment = commentResponse.body
    })

    describe('Posts', () => {
        test("Should return all posts on GET /posts ", () => {
            return request(app)
                .get('/posts')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body.length).toBeGreaterThan(0)
                })
        })

        describe('Requires jwt authentication on protected routes', () => {
            test('Create on GET /posts', () => {
                return request(app)
                    .post('/posts')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send('content=Test')
                    .send('title=Test')
                    .expect(401)
            })
            test('Update on PUT /posts/:id', () => {
                return request(app)
                    .post('/posts')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send('content=Test')
                    .send('title=Test')
                    .expect(401)
            })
            test('Delete on DELETE /posts/:id', () => {
                return request(app)
                    .delete('/posts/' + post._id)
                    .expect(401)

            })
        })

        test("Should create post on POST /posts", () => {
            return request(app)
                .post('/posts')
                .auth(token, { type: 'bearer' })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('content=Test Content')
                .send('title=Test Title')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('content')
                    expect(response.body).toHaveProperty('title')
                    request(app)
                        .get('/posts/' + response.body._id)
                        .expect(200)
                        .expect('Content-Type', /json/)
                })
        })

        test("Should return specific post on GET /posts/:id", () => {
            return request(app)
                .get('/posts/' + post._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('content')
                    expect(response.body).toHaveProperty('title')
                })
        })

        test("Should update post on PUT /posts/:id", () => {
            return request(app)
                .put('/posts/' + post._id)
                .auth(token, { type: 'bearer' })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('content=Test Content Updated')
                .send('title=Test Title Updated')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('content')
                    expect(response.body).toHaveProperty('title')
                    expect(response.body.title).toBe('Test Title Updated')
                    expect(response.body.content).toBe('Test Content Updated')
                })
        })

        test("Should delete post on DELETE /posts/:id", () => {
            return request(app)
                .delete('/posts/' + post._id)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('content')
                    expect(response.body).toHaveProperty('title')
                })
        })
    })

    describe('Comments', () => {
        test("Should return all comments under post on GET /posts/:id/comments ", () => {
            return request(app)
                .get(`/posts/${post._id}/comments`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body.length).toBeGreaterThan(0)
                })
        })

        test("Create comment on POST /posts/:id/comments", () => {
            return request(app)
                .post(`/posts/${post._id}/comments`)
                .auth(token, { type: 'bearer' })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('content=Test Comment')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toHaveProperty('content')
                    expect(response.body).toHaveProperty('author')
                })
        })

        test("Delete all comments under post on DELETE /posts/:id/comments", () => {
            return request(app)
                .delete(`/posts/${post._id}/comments`)
                .auth(token, { type: 'bearer' })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(200)
                .then(response => {
                    return request(app)
                        .get(`/posts/${post._id}/comments`)
                        .expect(200)
                        .then(response => {
                            expect(response.body.length).toBe(0)
                        })
                })
        })


        test("Delete specific comment DELETE /posts/:id/comments/:id", () => {
            return request(app)
                .delete(`/posts/${post._id}/comments/${comment._id}`)
                .auth(token, { type: 'bearer' })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(200)
                .then(response => {
                    expect(response.body._id).toBe(comment._id)
                })
        })

    })
})