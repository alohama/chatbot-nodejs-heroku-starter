const express = require('express');
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client

const app = express()

const config = {
    channelAccessToken: 'dj5Y4uKGAADe7C0mAy5ou2fUu7CgAJEcaga9woyL0qDZt68Gt+XEX+HULqFr2SO8MnOcIxvdAl7VLwmPBdnr17dXixLnQYPJbfwbTGQVmg1SWfpC9DZ2/gizSEWWinxFhBuocvuJWcMrN815sXmFjwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'b834ee9fae4eece11de58efa8e6d14c1'
}

const client = new Client(config)

app.get('/', function (req, res) {
	res.send('chatbot-nodejs-heroku-starter!!');
})

app.post('/webhook', middleware(config), (req, res) => {
    res.sendStatus(200)
    //  console.log(req.body.events) // webhook event objects
    // console.log(req.body.destination) // user ID of the bot (optional))
    return Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
})  

function handleEvent(event) {
    console.log(event)
    if(event.type === 'message') {
        if(event.message.type === 'text') {
            return Promise.resolve(handleMessageEvent(event))
        }
    }else {
      return Promise.resolve(null)
    }
}

function handleMessageEvent(event) {
    // let msg = {
    //     type: event.message.type,
    //     text: event.message.text
    // }
    // client.pushMessage(event.source.userId, msg);
    // return client.pushMessage(event.source.userId, msg);
    let msg = { 
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
            "type": "carousel",
            "columns": [
                {
                  "thumbnailImageUrl": "https://vignette.wikia.nocookie.net/line/images/b/bb/2015-brown.png/revision/latest?cb=20150808131630",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "this is menu",
                  "text": "description",
                  "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/123"
                  },
                  "actions": [
                      {
                          "type": "postback",
                          "label": "Buy",
                          "data": "action=buy&itemid=111"
                      },
                      {
                          "type": "postback",
                          "label": "Add to cart",
                          "data": "action=add&itemid=111"
                      },
                      {
                          "type": "uri",
                          "label": "View detail",
                          "uri": "http://example.com/page/111"
                      }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://vignette.wikia.nocookie.net/line/images/b/bb/2015-brown.png/revision/latest?cb=20150808131630",
                  "imageBackgroundColor": "#000000",
                  "title": "this is menu",
                  "text": "description",
                  "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/222"
                  },
                  "actions": [
                      {
                          "type": "postback",
                          "label": "Buy",
                          "data": "action=buy&itemid=222"
                      },
                      {
                          "type": "postback",
                          "label": "Add to cart",
                          "data": "action=add&itemid=222"
                      },
                      {
                          "type": "uri",
                          "label": "View detail",
                          "uri": "http://example.com/page/222"
                      }
                  ]
                }
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }

    let msg2 = { 
            "type":"text",
            "text": "dasd"
    }

    return client.replyMessage(event.replyToken, msg2);
        // for(var i= 0;i< 10;i++) {
        //     client.pushMesjnsage(event.source.userId, { type: "text", text: 'hello'})
        // }
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})

