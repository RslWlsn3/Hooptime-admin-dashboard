//controller function from hooptime
//Not currently implemented
DeleteTeam = async function () {
  // Delete the team if 
  // The requester is the team captain
  // Need to delete 
  // associated teammate records
  // incomplete challenges
  // team image

  // const teamID = req.params.teamID;
  // const token = req.headers.authorization;
  // const decodedToken = jwtDecode(token)
  // const id = decodedToken.sub

  const id = '5e10e3980190b352fc4bd060'  
  const teamID = '5e10f5b80190b352fc4bd068'
  const user = await UserProfile.findOne({ authID: id })  
  const team = await Team.findById(teamID)

  if (user._id.equals(team.TeamCaptain)) {
    await Team.findByIdAndDelete(teamID)
    await Teammate.deleteMany({ Team: teamID})
    res.json({})
    Challenge.deleteMany({ $or: [{ "TeamOne": teamID }, { "TeamTwo": teamID }], Status: { $ne: 'Challenge Complete' } }).exec()
    cloudinary_stuff.cloudinary.v2.uploader.destroy(team.TeamImageID)
  }
}

exports.DeleteTeammate = async function (req, res) {
  // Delete the teammate record if the requester is
  // The captain of the team
  // is the user associated with the teammate record
  const teammateID = req.params.teammateID;
  const token = req.headers.authorization;
  const decodedToken = jwtDecode(token)
  const id = decodedToken.sub

  const user = await UserProfile.findOne({ authID: id })

  const teammate = await Teammate.findById(teammateID).populate('Team')

  if (user._id.equals(teammate.User) || user._id.equals(teammate.Team.TeamCaptain)) {
    // User is authorized to delete this record
    await Teammate.findByIdAndDelete(teammateID)
    // Change eligibility
    res.json({})
    team = await Team.findById(teammate.Team)
    team.Eligible = false
    team.save()
  }
}