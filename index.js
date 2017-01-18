const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

const port = process.env.PORT || 3000;
const SESSION_EXPIRE = 20000; // 20 seconds
const sessions = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('Hello Line bot!')
});

app.post('/callback', (req, res) => {
  const body = req.body;

  body.events.forEach(event => {
    const persons = event.message.text.split('\n').map(p => p.trim());
    console.log(persons);
    let messageText = '';
    if (persons.length >= 2) {
      messageText = `${persons.join('さん, ')}さんから何人選ぶ？数字で教えてー`;
    } else {
      messageText = '1人だけじゃ抽選できないよ！';
    }
    sendMessage(messageText, event.replyToken);
  });
});

const sendMessage = (text, replyToken) => {
  return new Promise((resolve, reject) => {
    const BASE_URI = 'https://trialbot-api.line.me/v1/events';
    const REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

    const options = {
      uri: REPLY_ENDPOINT,
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: {
        replyToken: replyToken,
        messages:[
          {
            "type": "template",
            "altText": "おすすめレストラン",
            "template": {
              "type": "carousel",
              "columns": [

                {
                  "thumbnailImageUrl": "https://s3-us-west-2.amazonaws.com/lineapitest/hamburger_240.jpeg",
                  "title": "ジャンク・バーガー",
                  "text": "誰が何と言おうとジャンクフードの王様は、今も昔も変わらずハンバーガー。",
                  "actions": [

                    {
                      "type": "uri",
                      "label": "詳細を見る",
                      "uri": "http://example.com/page/222"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://s3-us-west-2.amazonaws.com/lineapitest/pizza_240.jpeg",
                  "title": "pizza cap",
                  "text": "本場ナポリの味を早く、安く。都内に17店舗展開するピザ専門店です。",
                  "actions": [

                    {
                      "type": "uri",
                      "label": "詳細を見る",
                      "uri": "http://example.com/page/222"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://s3-us-west-2.amazonaws.com/lineapitest/bread_240.jpeg",
                  "title": "本格パン工房 たけよし",
                  "text": "パンにとって一番大事だと思うものはなんですか？たけよしは、表面の焼き上がりこそが命であると考えています。",
                  "actions": [

                    {
                      "type": "uri",
                      "label": "詳細を見る",
                      "uri": "http://example.com/page/222"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://s3-us-west-2.amazonaws.com/lineapitest/harumaki_240.jpeg",
                  "title": "ヴェトナムTokyo",
                  "text": "東池袋にあるしたベトナム料理の老舗。40年以上人々に愛され続けてきたベトナム料理をご提供します。",
                  "actions": [

                    {
                      "type": "uri",
                      "label": "詳細を見る",
                      "uri": "http://example.com/page/222"
                    }
                  ]
                },

              ]
            }
          }
        ]
      }
    };
    console.log('options: ', options);
    request(options, (err, res, body) => {
      if(err) {
        reject(new Error(err));
      }
      console.log('request complete without error\nbody: ', body);
      resolve(body);
    });
  });
};

app.listen(port, '0.0.0.0', () => {
  console.log(`open http://0.0.0.0:${port}`);
});
