let books = [{
    ISBN : "12345ONE",
    name : "getting started with mern",
    Authors: [1,2],
    language: "en",
    pubDate : "2008-04-05",
    noOfPages : 225,
    category:["drama","programming"],
    publications : 1
},
{
    ISBN : "12345TWO",
    name : "getting started with datastructures",
    Authors: [1,2],
    language: "en",
    pubDate : "2008-04-05",
    noOfPages : 225,
    category:["Action"],
    publications : 1
}];

let Authors = [{
    id : 1,
    name : "Akhil",
    books : ["12345ONE","12345TWO"]
},
{
    id: 2,
    name : "luffy",
    books : ["12345ONE","12345TWO"]
},
{
    id: 3,
    name : "naruto",
    books : ["12345ONE"]
}];

let publications = [{
    id : 1,
    name : "Akhil publication",
    books : ["12345ONE"]
},
{
    id : 2,
    name : "Akhil1 publication",
    books : ["12345ONE"]
}];

module.exports = {books,Authors,publications};
