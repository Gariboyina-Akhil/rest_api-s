require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const database = require("./database/index");
const book_application = express();
book_application.use(express.json());

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
book_application.get("/", (req,res) => {
    return res.json({books : database.books});
});

/* 
route              /
description        specific book
access             Public
parameters         isbn
method             get
*/

book_application.get("/is/:isbn", (req,res) => {
    const requiredBook = database.books.filter((book) => book.ISBN === req.params.isbn);
    if(requiredBook.length===0) return res.json({error : "Book not found"});
    return res.json({book : requiredBook[0]});
});

/* 
route              /c
description        book based on category
access             Public
parameters         category
method             get
*/

book_application.get("/c/:category", (req,res) => {
    const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.category.length;i++){
        if(book.category[i].toLowerCase()===req.params.category.toLowerCase()){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );
    if(requiredBook.length===0) return res.json({error : "Book not found"});
    return res.json({book : requiredBook});
});

/* 
route              /a/:author
description        book based on author
access             Public
parameters         category
method             get
*/

book_application.get("/a/:author", (req,res) => {
    const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.Authors.length;i++){
        if(book.Authors[i]===parseInt(req.params.author)){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );
    if(requiredBook.length===0) return res.json({error : "Book not found"});
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

book_application.post("/book/new", (req,res) => {

    const {newBook} = req.body;
    database.books.push(newBook);
    return res.json({books : database.books, result: "book is added"});

});

/* Books   put --------------------------------------------------------------------------------- */

/* 
route              /book/update/
description        update title of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/book/update/:isbn", (req,res) =>{
    database.books.forEach((book) => {
        if(book.ISBN=== req.params.isbn){
            book.name=req.body.newTitle;
            return;
        }
    });
    return res.json({books : database.books});
});

/* 
route              /book/author/update
description        update/add author of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/book/author/update/:isbn", (req,res) =>{
    database.books.forEach((book) => {
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
    });
    return res.json({books : database.books, authors : database});
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

book_application.get("/authors", (req,res) => {
    return res.json({books : database.Authors});
});

/* 
route              /authors/id
description        specific Author
access             Public
parameters         id
method             get
*/

book_application.get("/authors/id/:id", (req,res) => {
    const requiredAuthor = database.Authors.filter((author) => author.id === parseInt(req.params.id));
    if(requiredAuthor.length===0) return res.json({error : "Author not found"});
    return res.json({book : requiredAuthor[0]});
});

/* 
route              /authors/is/:isbn
description        list of authors for a book
access             Public
parameters         isbn
method             get
*/

book_application.get("/authors/is/:isbn", (req,res) => {
    const requiredAuthor = database.Authors.filter((author) => author.books.includes(req.params.isbn));
    if(requiredAuthor.length===0) return res.json({error : "Author not found"});
    return res.json({book : requiredAuthor});
});



/* authors Post  --------------------------------------------------------------------------------- */

/* 
route              /authors/new
description        add new author
access             Public
parameters         category
method             post
*/

book_application.post("/author/new", (req,res) => {

    const {newAuthor} = req.body;
    database.Authors.push(newAuthor);
    return res.json({Authors : database.Authors, result: "Author is added"});

});

/* authors   put --------------------------------------------------------------------------------- */

/* 
route              /author/update/
description        update title of a book
access             Public
parameters         isbn
method             put
*/

book_application.put("/author/update/:id", (req,res) =>{
    database.Authors.forEach((auth) => {
        if(auth.id=== parseInt(req.params.id)){
            auth.name=req.body.newName;
            return;
        }
    });
    return res.json({books : database.Authors});
});

/* publications get  --------------------------------------------------------------------------------- */

/* 
route              /publications
description        list of publication
access             Public
parameters         None
method             get
*/

book_application.get("/publications", (req,res) => {
    return res.json({books : database.publications});
});

/* authors Post  --------------------------------------------------------------------------------- */

/* 
route              /publication/new
description        add new publicstion
access             Public
parameters         category
method             post
*/

book_application.post("/publication/new", (req,res) => {

    const {newPub} = req.body;
    database.publications.push(newPub);
    return res.json({Authors : database.publications, result: "publication is added"});

});

/* publication   put --------------------------------------------------------------------------------- */

/* 
route              /publication/name/update
description        update title of a book
access             Public
parameters         id
method             put
*/

book_application.put("/publication/name/update/:id", (req,res) =>{
    database.publications.forEach((pub) => {
        if(pub.id=== parseInt(req.params.id)){
            pub.name=req.body.newName;
            return;
        }
    });
    return res.json({books : database.publications});
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
