var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://trachttanner:3F47QcLxnq8D6vJd@cluster0-5qwjf.mongodb.net/prod?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log('DB Connected!!!'))
    .catch(err => {
        console.log('did not work', err);
    });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const challengeSchema = new mongoose.Schema({
    any: {}
});

const challenges = mongoose.model('challenges', challengeSchema, 'challenges');

db.once('open', function () {
    challenges.find().lean(true).exec((err, data) => {
        console.log('Err ::', err, 'data ::', data)
    })
});