import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

let maxNumber = [];
let gusNumber = [];
let randomNumber = 0;
let attempts = 1;

app.get('/', (req, res) => {
    attempts = 1;
    res.render('maxNum.ejs', { askMax: true });
})


app.post('/maxNum', (req, res) => {
    let mNum = parseInt(req.body.maxNum);
    maxNumber.push(mNum);
    let maxNum = maxNumber[maxNumber.length - 1]
    randomNumber = Math.floor(Math.random() * maxNum) + 1;
    setTimeout(() => {
        res.redirect('/guessPage');
    }, 1000);
});

app.get('/guessPage', (req, res) => {

    let maxNum = maxNumber[maxNumber.length - 1]
    res.render('gusNum.ejs', { num: maxNum });
})

app.post('/gusNum', (req, res) => {

    let gusNum = parseInt(req.body.gusNum);
    let maxNum = maxNumber[maxNumber.length - 1]
    console.log(randomNumber);

    let message = "0 - " + maxNum;
    let winExtra = "in " + attempts + " attempts";
    if (gusNum !== randomNumber) {
        if (gusNum > randomNumber) {
            // console.log('Num is high!')
            res.render('gusNum.ejs', { msg: 'Num is high!', extra: message })
            console.log("attampts: " + attempts);
            attempts++;
        } else {
            // console.log('Num is low!');
            res.render('gusNum.ejs', { msg: 'Num is low!', extra: message })
            attempts++;
            console.log("attampts: " + attempts);
        }
    } else {
        if (attempts == 1) {
            winExtra = "in " + attempts + " attempt";
        }
        res.render('gusNum.ejs', { winMsg: 'You took it! ', winExtra: winExtra, congrates: "WIN! Congrats 🎉" });
    }


    // res.redirect('/guessPage');
})

app.get('/restart', (req, res) => {
    attempts = 1;
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})