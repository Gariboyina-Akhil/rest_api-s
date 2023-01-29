require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//database
const database = require("./database/index");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//express connection
const book_application = express();
book_application.use(express.json());

//mongoose connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("connection established"));


//API'S

/* Books get  --------------------------------------------------------------------------------- */

/* 
route              /
description        all books
access             Public
parameters         None
method             get
*/
book_application.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({books :getAllBooks});
});

/* 
route              /is
description        specific book
access             Public
parameters         isbn
method             get
*/

book_application.get("/is/:isbn", async (req,res) => {
    const requiredBook = await BookModel.findOne({ISBN : req.params.isbn});
    //const requiredBook = database.books.filter((book) => book.ISBN === req.params.isbn);
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({book : requiredBook});
});

/* 
route              /c
description        book based on category
access             Public
parameters         category
method             get
*/

book_application.get("/c/:category", async (req,res) => {
    const requiredBook = await BookModel.findOne({category : req.params.category});
    /*const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.category.length;i++){
        if(book.category[i].toLowerCase()===req.params.category.toLowerCase()){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );*/
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({book : requiredBook});
});

/* 
route              /a/:author
description        book based on author
access             Public
parameters         category
method             get
*/

book_application.get("/a/:author",async (req,res) => {
    const requiredBook = await BookModel.findOne({Authors : parseInt(req.params.author)});
    /*const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.Authors.length;i++){
        if(book.Authors[i]===parseInt(req.params.author)){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );*/
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({authors : requiredBook});
});

/* Books Post  --------------------------------------------------------------------------------- */

/* 
route              /book/new
description        add new books
access             Public
parameters         category
method             post
*/

book_application.post("/book/new", async (req,res) => {

    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({books : addNewBook, result: "book is added"});

});

/* Books   put --------------------------------------------------------------------------------- */

/* 
route              /book/update/
description        update title of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/book/update/:isbn", async (req,res) =>{
    if(!await BookModel.findOne({ISBN : req.params.isbn})) return res.json({ result : "not found isbn"});
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn
    },{
        name : req.body.newName
    },{
        new : true
    });
    /*database.books.forEach((book) => {
        if(book.ISBN=== req.params.isbn){
            book.name=req.body.newTitle;
            return;
        }
    });*/
    return res.json({result : updatedBook});
});

/* 
route              /book/author/update
description        update/add author of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/book/author/update/:isbn",async (req,res) =>{
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn
    },{
        $push : {
            Authors : req.body.newAuthor
        }
    },{
        new : true
    });

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id : req.body.newAuthor
    },{
        $push : {
            books : req.params.isbn
        }
    },{
        new : true
    });
    /*database.books.forEach((book) => {
        if(book.ISBN=== req.params.isbn){
            const auth_id=req.body.newId;
            book.Authors.push(auth_id);
            database.Authors.forEach((auth) =>{
                if(auth_id===auth_id){
                    auth.books.push(req.params.isbn);
                    return;
                }
            });
            return;
        }
    });*/
    return res.json({books : updatedBook, authors : updatedAuthor, result :"Updated"});
});

/* Books delete  --------------------------------------------------------------------------------- */

/* 
route              /book/delete
description        deleting book
access             Public
parameters         isbn
method             delete
*/

book_application.delete("/book/delete/:isbn", (req,res) => {

    const newBooks = database.books.filter( (book) => book.ISBN !== req.params.isbn);
    database.books = newBooks;
    return res.json({books : database.books, result: "book is deleted"});

});

/* 
route              /book/author/book
description        deleting author from a book
access             Public
parameters         isbn
method             delete
*/

book_application.delete("/book/author/book/:isbn" , (req,res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthors = book.Authors.filter((auth) => auth !== req.body.authid);
            book.Authors =newAuthors;
            return
        }
    });

    database.Authors.forEach((auth) => {
        if(auth.id === req.body.authid){
            const newbooks = auth.books.filter( (book) => book !== req.params.isbn);
            auth.books=newbooks;
            return
        }
    });
    return res.json({books : database.books , authors: database.Authors});
});

/* Authors get  --------------------------------------------------------------------------------- */

/* 
route              /authors
description        all authors
access             Public
parameters         None
method             get
*/

book_application.get("/authors", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({books : getAllAuthors});
});

/* 
route              /authors/id
description        specific Author
access             Public
parameters         id
method             get
*/

book_application.get("/authors/id/:id", async (req,res) => {
    const requiredAuthor =await AuthorModel.findOne({id : parseInt(req.params.id)});
    if(!requiredAuthor) return res.json({error : "Author not found"});
    return res.json({book : requiredAuthor});
});

/* 
route              /authors/is/:isbn
description        list of authors for a book
access             Public
parameters         isbn
method             get
*/

book_application.get("/authors/is/:isbn", async (req,res) => {
    const requiredAuthor = await AuthorModel.findOne({books : req.params.isbn});
    if(!requiredAuthor) return res.json({error : "Author not found"});
    return res.json({books : requiredAuthor});
});



/* authors Post  --------------------------------------------------------------------------------- */

/* 
route              /authors/new
description        add new author
access             Public
parameters         category
method             post
*/

book_application.post("/author/new", async(req,res) => {

    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({Authors : newAuthor, result: "Author is added"});

});

/* authors   put --------------------------------------------------------------------------------- */

/* 
route              /author/update/
description        update name of author
access             Public
parameters         isbn
method             put
*/

book_application.put("/author/update/:id", async (req,res) =>{
    if(!(await AuthorModel.findOne({id : req.params.id}))) return res.json({result : "no author"});
    await AuthorModel.findOneAndUpdate(
        {
            id : req.params.id
        },
        {
            name : req.body.newName
        }
    );
    /*database.Authors.forEach((auth) => {
        if(auth.id=== parseInt(req.params.id)){
            auth.name=req.body.newName;
            return;
        }
    });*/
    return res.json({result : "updated"});
});

/* publications get  --------------------------------------------------------------------------------- */

/* 
route              /publications
description        list of publication
access             Public
parameters         None
method             get
*/

book_application.get("/publications", async (req,res) => {
    const requiredPublication = await PublicationModel.find()
    return res.json({publications : requiredPublication});
});

/* publication Post  --------------------------------------------------------------------------------- */

/* 
route              /publication/new
description        add new publicstion
access             Public
parameters         category
method             post
*/

book_application.post("/publication/new", (req,res) => {

    const {newPub} = req.body;
    const addNewPublication = PublicationModel.create(newPub)
    return res.json({publications : addNewPublication, result: "publication is added"});

});

/* publication   put --------------------------------------------------------------------------------- */

/* 
route              /publication/name/update
description        update title of a book
access             Public
parameters         id
method             put
*/

book_application.put("/publication/name/update/:id", async (req,res) =>{
    const updatedPubliication = await PublicationModel.findOneAndUpdate({
        id : req.params.id
    },{
        name : req.body.newName
    },{
        new : true
    });
    /*database.publications.forEach((pub) => {
        if(pub.id=== parseInt(req.params.id)){
            pub.name=req.body.newName;
            return;
        }
    });*/
    return res.json({publications : updatedPubliication});
});

/* 
route              /publication/update/book
description        add/updation of publication of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/publication/update/book/:isbn" , (req,res) =>{
    database.publications.forEach((pub) => {
        if(pub.id === req.body.id){
            return pub.books.push(req.params.isbn);
        }
    });

    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.id;
            return
        }
    });
    return res.json({publications: database.publications , books : database.books ,result : "success"});
});


book_application.listen(3000, () => console.log("book_application server is running"));
