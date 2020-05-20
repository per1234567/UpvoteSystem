const express = require('express');
const app = express();
const mongoose = require('mongoose');
var io;

app.use(express.static('public'));
app.set('view engine','ejs');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`server is now running on port ${PORT}`);
});

io = require('socket.io')(server);

const url = 'mongodb+srv://Per:HVOSDPWev9AYocyY@perliukai-4jawx.gcp.mongodb.net/perliukai?retryWrites=true&w=majority';
//const url = 'mongodb://localhost:27017/duomenys';
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(url, () => {
    console.log('connected to DB');
});

class DB{
    static initialize(){
        this.perlasSchema = new mongoose.Schema({
            text : String,
            upvote : Number,
            downvote : Number,
            score : Number,
            mokytojas : String
        });
        this.perlasModel = mongoose.model('perlai2', this.perlasSchema);
    }

    static get(){
        return this.perlasModel.find().sort({'score': -1}).exec()
        .then(x => { return x; });
    }

    static save(mokytojas, text){
        const newPerlas = new this.perlasModel({mokytojas : mokytojas, text : text, upvote: 0, downvote : 0});
        newPerlas.save();
    }

    static async update(id, property){
        if(property === 'upvote'){
            await this.perlasModel.findOneAndUpdate({'_id' : id}, {$inc : {'upvote': 1}});
            await this.perlasModel.findOneAndUpdate({'_id' : id}, {$inc : {'score': 1}});
        }
        if(property === 'downvote'){
            await this.perlasModel.findOneAndUpdate({'_id' : id}, {$inc : {'downvote': 1}});
            await this.perlasModel.findOneAndUpdate({'_id' : id}, {$inc : {'score': -1}});
        }
    }

    static async reset(){
        this.perlasModel.updateMany({}, {'upvote' : 0});
    }
}

DB.initialize();
//DB.reset();

app.get('/', async(req, res) => {
    const data = await DB.get();
    res.render('page', {data : data});
});

io.on('connection', socket => {
    socket.on('upvote', data => {
        io.emit('upvote', {id : data.id});
        DB.update(data.id, 'upvote');
    });

    socket.on('downvote', data => {
        io.emit('downvote', {id : data.id});
        DB.update(data.id, 'downvote');
    });

    // socket.on('add', data => {
    //     DB.save(data.mokytojas, data.perliukas);
    // });
})

// app.get('/input', (req, res) => {
//     res.render('input');
// });

