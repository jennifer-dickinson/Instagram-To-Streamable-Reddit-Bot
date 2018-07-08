var fetch = require("node-fetch");
var fs = require("fs");

var token = fs.readFileSync("token.txt", "utf-8").split("\n")[0];

var rx = /instagram.com\/p\/([A-z0-9]+)\/?/;
var redditURL = 'https://www.reddit.com'
var subreddit = '/r/bouldering/.json'
// var instagramVideo = /instagram.com/p\//;
async function findConvertInst() {
    // fetch('https://reddit.com/r/bouldering/new/.json')

    // get the list of instagram URLS
    var media = [];
    await fetch(`${redditURL}${subreddit}`)
    .then(response => { return response.json(); })
    .then(response => { return response.data.children; })
    .then(async post => {
        for(i = 0; i < post.length; i++) {
            if (post[i].data.domain === 'instagram.com'){
                var valid = true;

                // Check if we have not already responded to this before
                await fetch(`${redditURL}${post[i].data.permalink}.json`)
                .then( response => { return response.json(); })
                .then( response => { return response[1].data.children })
                .then( comment => {
                    for (j = 0; j < comment.length; j++)
                    if(comment[j].data.author === 'fitnomad')
                    valid = false;
                });

                // If not, we push it to the media to check for videos
                if (valid) {
                    var media_id = rx.exec(post[i].data.url)[1]
                    media.push(media_id);
                }
            }
        }
    })

    console.log(media);

    for (i = 0; i < media.length; i++) {
        await fetch(`https://www.instagram.com/p/${media[i]}?__a=1`)
        // .then( response => {return response.json();})
        .then( response => { return response.json(); })
        .then( response => console.log(response));
    }

    // Find out which instagram URLS are actual videos
}


findConvertInst();
