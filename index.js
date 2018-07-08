var fetch = require("node-fetch");
var fs = require("fs");
let base64 = require('base-64');


var [streamable_user, streamable_pass, reddit_user, reddit_pass] = fs.readFileSync("credentials.txt", "utf-8").split("\n");

var rx = /instagram.com\/p\/([A-z0-9]+)\/?/;
var redditURL = 'https://www.reddit.com/'
var subreddit = '/r/Istillfit/'
// var instagramVideo = /instagram.com/p\//;
async function findConvertInst() {
    // fetch('https://reddit.com/r/bouldering/new/.json')

    // get the list of instagram URLS
    var media = [];
    await fetch(`${redditURL}${subreddit}.json`)
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
                    if(comment[j].data.author === reddit_user)
                    valid = false;
                });

                // If not, we push it to the media to check for videos
                if (valid) {
                    var media_id = rx.exec(post[i].data.url)[1]
                    var url = `https://www.instagram.com/p/${media_id}/`

                    // Find out which instagram URLS are actual videos
                    await fetch(`${url}?__a=1`)
                    .then( response => { return response.json(); })
                    .then( response => {
                        if (response.graphql.shortcode_media.is_video)
                            media.push(url);
                    });

                }
            }
        }
    })
    console.log(media);

    for (i = 0; i < media.length; i++) {
        await fetch(`https://api.streamable.com/import?url=${media[i]}`, {
            headers: {
                'Authorization': 'Basic ' + base64.encode(streamable_user + ":" + streamable_pass)
            } })
        .then( response => {return response.json();})
        .then( shortcode => {console.log(shortcode)})
    }
}


findConvertInst();
