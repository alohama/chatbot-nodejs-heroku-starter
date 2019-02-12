const express = require('express');
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client
const restClient = new (require('node-rest-client').Client)
const app = express()


const config = {
    channelAccessToken: 'ClRAluwKDzDpg7MkEYhE/qcGO8U36hKgYs/KXHuAsGkeHg4Nd1wfHRD1cpda0EM6OOECwXstW6xYr0A7qaNj1x61TkB8EfV+v8TEnEmsx0DtRAfUYsvNCSb2Oij7wbAwAeFl8HnlXPYg0iUYVzvWhgdB04t89/1O/w1cDnyilFU=',
    channelSecret: '75240895377b57eeed5bd387c2668508'
}


const client = new Client(config)

app.get('/', function (req, res) {
	res.send('chatbot-nodejs-heroku-starter!! kljlkjlkjhjkjhkj jknljlkhj');
})

app.use(middleware(config))

app.post('/webhook', (req, res) => {
    res.sendStatus(200)
    console.log(req.body.events) // webhook event objects
    console.log(req.body.destination) // user ID of the bot (optional)
    Promise
        .all(req.body.events.map(hanndleEvent))
})

let name;
let age;
let question = 0;

function hanndleEvent(event) {
    if(question === 1) {
        question = 2
        name = event.message.text
        return client.replyMessage(event.replyToken, {type: 'text', text: `คุณ ${name}อายุเท่าไหร่?`})
    }else if(question === 2) {
        question = 0
        age = event.message.text
        return client.replyMessage(event.replyToken, {type: 'text', text: `คุณ${name}อายุ ${age} เองครับ...`})
    }
    if(event.message.type === 'text' && event.message.text === 'location') {
        let msg = {
            "type": "location",
            "title": "I GEAR GEEK",
            "address": "malada place",
            "latitude": 18.7777315,
            "longitude": 98.9513933
        }
        //client.replyMessage(event.replyToken, msg)
        client.pushMessage(event.source.userId, msg)
        return client.pushMessage(event.source.userId, msg)
    }else if(event.message.type === 'text' && event.message.text === 'menu') {
        let msg = {
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                    {
                      "thumbnailImageUrl": "https://vignette.wikia.nocookie.net/line/images/b/bb/2015-brown.png/revision/latest?cb=20150808131630",
                      "imageBackgroundColor": "#4286f4",
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
                      "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
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
        return client.replyMessage(event.replyToken, msg)
    }else if(event.message.type === 'text' && event.message.text === 'สวัสดี') {
        question = 1
        return client.replyMessage(event.replyToken, { type : "text", text: "สวัสดีคุณชื่ออะไร?"})
    }else if(event.message.type === 'text' && event.message.text === 'บาย') {
        question = 0
        return client.replyMessage(event.replyToken, { type : "text", text: "จบการสนทนา"})
    }
    if(event.type === 'message' && event.message.type === 'location') {
        return handleLocationEvent(event)
    }
}


function handleLocationEvent(event) {
    apiUrl = 'https://fathomless-reaches-36581.herokuapp.com/api'
    return new Promise((resolve, reject) => {
    restClient.get(`${apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
        if (data) {
          const pinData = data.map(row => ({
            "thumbnailImageUrl": row.aqi.icon,
            "imageBackgroundColor": "#FFFFFF",
            "title": `PM 2.5: ${row.aqi.aqi}`,
            "text": `${row.nameTH}, ${row.areaTH}`,
            "actions": [
              {
                "type": "uri",
                "label": "ข้อมูลย้อนหลัง",
                "uri": row.historyUrl
              }
            ]
          }))
      
          var msg = {
            "type": "template",
            "altText": "ข้อมูลสถานที่",
            "template": {
              "type": "carousel",
              "columns": pinData,
              "imageAspectRatio": "rectangle",
              "imageSize": "cover"
            }
          }
  
          resolve(client.replyMessage(event.replyToken, msg))
        } else {
          reject()
        }
      })
    })
   
  }

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})

