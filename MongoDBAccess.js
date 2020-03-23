const cloudinary_stuff = require('./cloudify')
var mongoose = require('mongoose');
require('dotenv').config()
let { Challenge, UserProfile, Team, Teammate, Subscription } = require('./schemas')

const run = (_username, teamName) => {  
  //ToDo: need to add this connection password to a config file
  mongoose.connect(process.env.API_KEY, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
    .then(() => console.log('DB Connected!!!'))
    .catch(err => {
      console.log('did not work', err);
    });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', async function () {

    var doc = user_profiles.findOne({ username: _username }).lean(true).exec((err, data) => {
      //Finds new team captain if there is one
      teams.find({ TeamCaptain: { $eq: data._id } }).lean().exec((err, teamsThatNeedNewCaptain) => {

        teamsThatNeedNewCaptain.forEach(function (aTeam) {
          teammates.findOne({ Team: { $eq: aTeam._id }, User: { $ne: data._id } }).exec((err, newCaptian) => {
            if (newCaptian == null) {
              //delete team
              teams.deleteOne({ _id: aTeam._id }).lean(true).exec((err, data) => {
                console.log('Err ::', err, 'team ::', data)
              })
              //delete team challenges
              challenges.deleteMany({ $or: [{ TeamOne: aTeam._id }, { TeamTwo: aTeam._id }] }).lean(true).exec((err, data) => {
                console.log('Err ::', err, 'team challenges ::', data)
              })
              //delete team invites
              Team_invites.deleteMany({ Team: aTeam._id }).lean(true).exec((err, data) => {
                console.log('Err ::', err, 'team invites ::', data)
              })
              //delete team's cloadinary photo
              console.log("team.TeamImageID = ", aTeam.TeamImageID)
              cloudinary_stuff.cloudinary.v2.uploader.destroy(aTeam.TeamImageID, function(error,result) {
                console.log("team's cloadinary photo", result, error) });
                

            } else {
              //make new team captain
              teams.findByIdAndUpdate(aTeam._id, { TeamCaptain: newCaptian.User }, { useFindAndModify: false }).exec((err, data) => {
                console.log('Err ::', err, 'make new team captain ::', data)
              })
            }
          })
        });
      })
      //delete user's cloudinary photo 
      console.log("data.ProfileImageID = ", data.ProfileImageID)
      cloudinary_stuff.cloudinary.v2.uploader.destroy(data.ProfileImageID, function(error,result) {
        console.log("user's cloudinary photo", result, error) });

      //delete the player's profile
      user_profiles.deleteOne({ _id: data._id }).lean(true).exec((err, data) => {
        console.log('Err ::', err, 'players profile ::', data)
      })
      //delete teamate
      teammates.deleteMany({ User: data._id }).lean(true).exec((err, data) => {
        console.log('Err ::', err, 'teamate ::', data)
      })
      //delete subscriptions      
      subscriptions.deleteMany({ User: data._id }).lean(true).exec((err, data) => {
        console.log('Err ::', err, 'subscriptions ::', data)

      })
    })
  });
};

exports.run = run;