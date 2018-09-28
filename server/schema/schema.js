const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const mongoose = require('mongoose');

const _ = require('lodash');

// const Author = require('../models/author');
// const Book = require('../models/book');

//***************************Models*********************************************** */
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String,
    age: Number,
})
var Author = mongoose.model('Author', authorSchema);



const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
})
var Book = mongoose.model('Book', bookSchema);


//******************************************************************************* */

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId })
                return Author.findById(parent.authorId)
            }
        }

    })
})


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id });
                return Book.find({ authorId: parent.id })
            }
        }

    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db
                // return _.find(books, { id: args.id })
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {

                // return _.find(authors, { id: args.id })
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({})
            }
        }
    }
})


const Mutation = new GraphQLObjectType({

    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {

                let author = new Author({
                    name: args.name,
                    age: args.age
                })

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {

                // console.log(args)
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })

                // console.log(book)
                return book.save();
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {

                console.log(args)
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })

                Book.update({
                    id: args.id
                }, {
                        $set: {
                            book
                        }
                    })

            }
        }


    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})




//dummy data
/*
var books = [
    { name: 'A', genre: 'a', id: '1', authorId: '1' },
    { name: 'B', genre: 'b', id: '2', authorId: '2' },
    { name: 'C', genre: 'c', id: '3', authorId: '3' },
    { name: 'D', genre: 'd', id: '4', authorId: '3' }

];

var authors = [
    { name: 'Adam', age: 22, id: '1' },
    { name: 'ben', age: 44, id: '2' },
    { name: 'Jack', age: 66, id: '3' }


];

*/