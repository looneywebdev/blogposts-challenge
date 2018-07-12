const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const { app, runServer, closeServer } = require ('../server');

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });
    after(function () {
        return closeServer();
    });
    it('should list items on GET', function () {
        return chai
            .request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.above(0);
                res.body.forEach(function(item) {
                    expect(item).to.be.an('object');
                    expect(item).to.have.all.keys(
                        'id',
                        'title',
                        'content',
                        'author',
                        'publishDate'
                    );
                });
                    
            });
    });
    it('should add a recipe on POST', function() {
        const newBlogPost = {
            title: 'Living in Las Vegas',
            content: 'Vegas is fun!',
            author: 'Heather Looney'
        };
        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newBlogPost));
        return chai
            .request(app)
            .post('/blog-posts')
            .send(newBlogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.title).to.equal(newBlogPost.title);
                expect(res.body.content).to.equal(newBlogPost.content);
                expect(res.body.author).to.equal(newBlogPost.author);
          });
      });
      it('should update blog posts on PUT', function() {
        return (
          chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
              const updatedPost = Object.assign(res.body[0], {
                title: "connect the dots",
                content: "la la la la la"
              });
              return chai
                .request(app)
                .put(`/blog-posts/${res.body[0].id}`)
                .send(updatedPost)
                .then(function(res) {
                  expect(res).to.have.status(204);
                });
            })
        );
      });
      it('should delete recipes on DELETE', function() {
        return chai
        .request(app)
          .get('/blog-posts')
          .then(function(res) {
              console.log('Pipo', res.body[0].id);
            return chai
            .request(app)
              .delete(`/blog-posts/${res.body[0].id}`)
          })
          .then(function(res) {
              console.log('Hello');
            expect(res).to.have.status(204);
          });
      });
});