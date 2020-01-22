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

var Schema = mongoose.Schema;
const teamsSchema = new mongoose.Schema({
    TeamName: {
        type: String,
        minlength: 1,
        maxlength: 30
      },
      Location: {
        type: String,
        minlength: 1,
        maxlength: 100
      },
      Size: {
        type: Number,
        enum: [1, 2, 3, 5] 
      },
      Description: {
        type : String,
        minlength : 0,
        maxlength : 244
      },
      wins: {
        type : Number,
        min : 0,
      },
      losses: {
        type : Number,
        min : 0
      },
      streak: {
        type : Number,
        min : 0 
      },
      TeamImageSrc: {
        type : String,
        default : "https://res.cloudinary.com/hooptime/image/upload/v1574133909/basketball_ct1jsf.png"
      },
      TeamImageID: {
        type : String
      },
      TeamCaptain: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
      Eligible: {
        type : Boolean,
        default : false
      }
});

const teammatesSchema = new mongoose.Schema({
    Team: { type: Schema.Types.ObjectId, ref: 'Teams' },
    User: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
});

const teams = mongoose.model('teams', teamsSchema, 'teams');
const teammates = mongoose.model('teammates', teammatesSchema, 'teammates');

//enter name of team to be deleted
nameOfteam = 'test'

db.once('open', async function () {

    //deletes team and teamate given team name
    var doc = teams.findOne({ TeamName: nameOfteam }).lean(true).exec((err, data) => {
    teams.deleteOne({ _id: data._id }).lean(true).exec((err, data) => {
        console.log('Err ::', err, 'data ::', data)
    })
    teammates.deleteMany({ Team: data._id }).lean(true).exec((err, data) => {
        console.log('Err ::', err, 'data ::', data)
    })
    })  
});

