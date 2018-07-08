var fetch = require("node-fetch");
var bodyParser = require("body-parser");
var express = require("express");


const app = express();

// setInterval(() => {
//     console.log('hello');
// }, 60000);


var rx = /instagram.com\/p\/([A-z0-9]+)\/?/
// var instagramVideo = /instagram.com/p\//;

// fetch('https://reddit.com/r/bouldering/new/.json')
fetch('https://www.reddit.com/r/istillfit/new/.json')
.then(response => { return response.json(); })
.then(response => { return response.data.children; })
.then(post => {
    for(i = 0; i < post.length; i++) {
        if (post[i].data.domain === 'instagram.com'){
            var media_id = rx.exec(post[i].data.url)[1]
            console.log(media_id);
        }
    }
});
