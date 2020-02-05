const electron = require('electron')
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', function(){
    //creates new window
    mainWindow = new BrowserWindow(
        {
            webPreferences: {
                nodeIntegration: true
            }
        }
    );
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    //builds menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//catch item:add (should rename later)
ipcMain.on('item:add', function(e, item){
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
        type: String,
        minlength: 0,
        maxlength: 244
      },
      wins: {
        type: Number,
        min: 0,
      },
      losses: {
        type: Number,
        min: 0
      },
      streak: {
        type: Number,
        min: 0
      },
      TeamImageSrc: {
        type: String,
        default: "https://res.cloudinary.com/hooptime/image/upload/v1574133909/basketball_ct1jsf.png"
      },
      TeamImageID: {
        type: String
      },
      TeamCaptain: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
      Eligible: {
        type: Boolean,
        default: false
      }
    });
    
    const teammatesSchema = new mongoose.Schema({
      Team: { type: Schema.Types.ObjectId, ref: 'Teams' },
      User: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
    });
    
    var UserProfileSchema = new Schema({
      authID: String,
      username: {
        type: String,
        minlength: 1,
        maxlength: 30
      },
      firstName: {
        type: String,
        minlength: 1,
        maxlength: 50
      },
      lastName: {
        type: String,
        minlength: 1,
        maxlength: 50
      },
      heightFeet: {
        type: Number,
        min: 1,
        max: 7
      },
      heightInches: {
        type: Number,
        min: 0,
        max: 11
      },
      location: String,
      bio: {
        type: String,
        minlength: 0,
        maxlength: 244
      },
      levelOfPlay: {
        type: String,
        enum: ['Recreational', 'Highschool', 'College']
      },
      wins: {
        type: Number,
        min: 0,
      },
      losses: {
        type: Number,
        min: 0
      },
      streak: {
        type: Number,
        min: 0
      },
      ProfileImage: {
        type: String
      },
      ProfileImageID: {
        type: String
      }
    });
    
    var TeamInviteSchema = new Schema({
      Team: { type: Schema.Types.ObjectId, ref: 'Teams' },
      User: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
      Status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined']
      },
      Created: { type: Date, default: Date.now }
    });
    
    var ChallengeSchema = new Schema({
      TeamOne: { type: Schema.Types.ObjectId, ref: 'Teams' },
      TeamTwo: { type: Schema.Types.ObjectId, ref: 'Teams' },
      Created: { type: Date, default: Date.now },
      Updated: { type: Date, default: Date.now },
      TeamOneScore: {
        type: Number,
        min: 0,
        max: 200
      },
      TeamTwoScore: {
        type: Number,
        min: 0,
        max: 200
      },
      Status: {
        type: String,
        enum: ['Challenge Pending', 'Challenge Declined', 'Challenge Cancelled', 'Awaiting Scores', 'Score Review', 'Challenge Complete'],
        default: 'Challenge Pending'
      },
      ScoreWaitingOn: {
        type: String,
        enum: ['Team One', 'Team Two', 'None'],
        default: 'None'
      }
    });
    
    const teams = mongoose.model('teams', teamsSchema, 'teams');
    const teammates = mongoose.model('teammates', teammatesSchema, 'teammates');
    const user_profiles = mongoose.model('user profiles', UserProfileSchema, 'user profiles');
    const Team_invites = mongoose.model('team invites', TeamInviteSchema, 'team invites');
    const challenges = mongoose.model('challenges', ChallengeSchema, 'challenges');
    
    _username = item
    
    db.once('open', async function () {
    
      var doc = user_profiles.findOne({ username: _username }).lean(true).exec((err, data) => {
        //Finds new team captain if there is one
        teams.find({ TeamCaptain: { $eq: data._id } }).lean().exec((err, teamsThatNeedNewCaptain) => {
    
          teamsThatNeedNewCaptain.forEach(function (aTeam) {
            teammates.findOne({ Team: { $eq: aTeam._id }, User: { $ne: data._id } }).exec((err, newCaptian) => {
              if (newCaptian == null) {
                //delete team
                teams.deleteOne({ _id: aTeam._id }).lean(true).exec((err, data) => {
                  console.log('Err ::', err, 'data ::', data)
                })
                //delete team challenges
                challenges.deleteMany({ $or: [{ TeamOne: aTeam._id }, { TeamTwo: aTeam._id }] }).lean(true).exec((err, data) => {
                  console.log('Err ::', err, 'data ::', data)
                })
                //delete team invites
                Team_invites.deleteMany({ Team: aTeam._id }).lean(true).exec((err, data) => {
                  console.log('Err ::', err, 'data ::', data)
                })
              } else {
                //make new team captain
                teams.findByIdAndUpdate(aTeam._id, { TeamCaptain: newCaptian.User }, { useFindAndModify: false }).exec((err, data) => {
                  console.log('Err ::', err, 'data ::', data)
                })            
              }
            })
          });
        })
    
        //delete the player's profile
        user_profiles.deleteOne({ _id: data._id }).lean(true).exec((err, data) => {
          console.log('Err ::', err, 'data ::', data)
        })
        //delete teamate
        teammates.deleteMany({ User: data._id }).lean(true).exec((err, data) => {
          console.log('Err ::', err, 'data ::', data)
        })    
      })
    });
    
    
})


//menu template
const mainMenuTemplate = [
    {
        label:'file'
    }
]

//add developer tool if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Comand+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
            
        ]
    })
}

