const express = require('express');

const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client

const restClient = new (require('node-rest-client').Client)

const app = express()

const config = {
  channelAccessToken: 'sqp5/8jOuuY6r5wVFUox8a0J/JOxxN+0fKM2HXx9e6fkT0CSI/QU+cb4IGYvurHaqi9FinYI7Mym7y1D6nJtSsaxr1ThwZJygk3e7MB0CV9ITIpjgZ7pUqZFcuzM75UQ8MHeZn0PiFsE+eEwsxjBAAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '325bd7881e09c7c4126674e20abb97aa'
}

const client = new Client(config)

app.get('/', function (req, res) {
  res.send('chatbot-nodejs-heroku-starter!! oxoxoxo1235');
})

app.post('/webhook', middleware(config), (req, res) => {
  //console.log(req.body.events) // webhook event objects
  //console.log(req.body.destination) // user ID of the bot (optional)
  res.sendStatus(200)
  Promise
    .all(req.body.events.map(handleEvent))
})

function handleEvent(event) {
  let msg = {
    type: "text",
    text: event.message.text
  }
  if (event.message.type == 'text' && event.message.text == 'location') {
    let msg = {
      "type": "location",
      "title": "Pranworks Chiang Mai",
      "address": "Chiang Mai Thailand",
      "latitude": 18.789660,
      "longitude": 98.984400
    }

    //return client.replyMessage(event.replyToken, msg)
    //client.pushMessage(event.source.userId, msg)
    return client.pushMessage(event.source.userId, msg)
  } else if (event.message.type == 'text' && event.message.text == 'carousel') {
    let msg = {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
        "type": "carousel",
        "columns": [
          {
            "thumbnailImageUrl": "https://image.freepik.com/free-photo/griled-chicken-breast-steak-with-vegetable_1339-43660.jpg",
            "imageBackgroundColor": "#FFFFFF",
            "title": "this is menu",
            "text": "description",
            "defaultAction": {
              "type": "uri",
              "label": "View detail",
              "uri": "https://freepik.com"
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
            "thumbnailImageUrl": "https://image.freepik.com/free-photo/healthy-dish-with-chicken-tomatoes-avocado-lettuce-lentil-dark-background_2829-971.jpg",
            "imageBackgroundColor": "#000000",
            "title": "this is menu",
            "text": "description",
            "defaultAction": {
              "type": "uri",
              "label": "View detail",
              "uri": "https://freepik.com/"
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
    return client.pushMessage(event.source.userId, msg)
  }
  else if (event.message.type == 'text' && event.message.text.indexOf("hello x") >= 0) {
    let str = event.message.text.split(' x ');
    if (str[1]) {
      let num = parseInt(str[1]);
      let msgBack = {
        type: "text",
        text: str[0].toString()
      }
      for (let i = 0; i < num; i++) {
        client.pushMessage(event.source.userId, msgBack)
        //return client.replyMessage(event.replyToken, msgBack)
      }
    }
  }
  else if (event.type === 'message' && event.message.type === 'location') {
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


