// Require Mongoose
var mongoose = require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

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

  var SubscriptionSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: 'User Profiles' },
    Subscription: {
      endpoint: {
        type: String,
        unique: true
      },
      keys: {
        p256dh: String,
        auth: String
      }
    }
  });

  const teams = mongoose.model('teams', teamsSchema, 'teams');
  const teammates = mongoose.model('teammates', teammatesSchema, 'teammates');
  const user_profiles = mongoose.model('user profiles', UserProfileSchema, 'user profiles');
  const Team_invites = mongoose.model('team invites', TeamInviteSchema, 'team invites');
  const challenges = mongoose.model('challenges', ChallengeSchema, 'challenges');
  const subscriptions = mongoose.model('subscriptions', SubscriptionSchema, 'subscriptions');

  module.exports = {
    teams: teams,
    teammates: teammates, 
    user_profiles: user_profiles, 
    Team_invites: Team_invites, 
    challenges: challenges, 
    subscriptions: subscriptions
  };