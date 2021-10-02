const { User, Issue, Project, Comment } = require("../models")
//handle errors, then create a more human readable error message
const handleErrors = (err) => {
  let elements = []
  if (err.message.includes("Issue validation failed")) {
    Object.values(err.errors).forEach(({ message }) => {
      elements.push(message)
    })
  }
  return elements
}

exports.createIssue = async function (req, res, next) {
  try {
    const { id, projectId } = req.params
    const post = await Issue.create({ ...req.body, createdBy: id, project: projectId })
    const foundUser = await User.findById(id)
    foundUser.issues.push(post)
    await foundUser.save()
    const foundProject = await Project.findById(projectId)
    foundProject.issues.push(post)
    await foundProject.save()
    const issue = await Issue.findOne(post._id)
      .populate("createdBy", { username: true })
      // .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    return res.status(200).json(issue)
  } catch (err) {
    const errorMessageArray = handleErrors(err)
    return next({ status: 400, message: errorMessageArray.join(" & ") })
  }
}

//remove Issue /api/users/:id/issues/:issueId
exports.deleteIssue = async function (req, res, next) {
  try {
    const foundIssue = await Issue.findById(req.params.issueId)
    const result = await foundIssue.remove()
    return res.status(200).json({
      issue: foundIssue
    })
  } catch (err) {
    next(err)
  }
}

//get Issue /api/users/:id/issues/:issueId
exports.getIssue = async function (req, res, next) {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate("createdBy", { username: true })
      .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    return res.status(200).json({
      issue,
    })
  } catch (err) {
    return next(err)
  }
}

exports.updateIssueStatus = async function (req, res, next) {
  try {
    const status = req.params.type
    const issue = await Issue.findByIdAndUpdate(req.params.issueId, { status }, { new: true })
      .populate("createdBy", { username: true, email: true })
      // .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    return res.status(200).json({
      issue,
    })
  } catch {
    return next(err)
  }
}

//Update Issue/s /api/users/:id/issues/:issueId/edit
exports.updateIssue = async function (req, res, next) {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.issueId, req.body, { new: true, runValidators: true })
      .populate("createdBy", { username: true, email: true })
      .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    return res.status(200).json({
      issue
    })
  } catch (err) {
    return next(err)
  }
}

//Add a comment to the comments array
exports.postComment = async function (req, res, next) {
  try {
    const { id, issueId } = req.params
    const { comment } = req.body
    const newComment = await Comment.create({ text: comment, createdBy: id })
    const issue = await Issue.findById(issueId)
      .populate("createdBy", { username: true, email: true })
      .populate("assignedUsers", { username: true, email: true })
    issue.comments.push(newComment)
    await issue.save().then(t => t.populate({ path: "comments", populate: { path: "createdBy", select: "username" } }).execPopulate())
    return res.status(200).json({
      issue
    })
  } catch (err) {
    return next(err)
  }
}

exports.patchComment = async function (req, res, next) {
  try {
    const { issueId, commentId } = req.params
    const { comment } = req.body
    await Comment.findByIdAndUpdate(commentId, { text: comment })
    const issue = await Issue.findById(issueId)
      .populate("createdBy", { username: true, email: true })
      .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    return res.status(200).json({
      issue
    })
  } catch (err) {
    return next(err)
  }
}

exports.removeComment = async function (req, res, next) {
  try {
    const { issueId, commentId } = req.params
    const foundComment = await Comment.findById(commentId)
    await foundComment.remove()
    const issue = await Issue.findById(issueId)
      .populate("createdBy", { username: true, email: true })
      .populate("assignedUsers", { username: true, email: true })
      .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    await issue.comments.remove(commentId)
    return res.status(200).json({
      issue
    })
  } catch (err) {
    return next(err)
  }
}

exports.leaveIssue = async function (req, res, next) {
  try {
    const foundUser = await User.findById(req.params.id)
    const foundIssue = await Issue.findById(req.params.issueId)
    .populate("createdBy", { username: true, email: true })
    .populate("assignedUsers", { username: true, email: true })
    .populate({ path: "comments", populate: { path: "createdBy", select: "username" } })
    console.log(req.params.issueId)
    foundIssue.assignedUsers.remove(foundUser)
    await foundIssue.save()
    return res.status(200).json({
      issue: foundIssue
    })
  } catch (err) {
    return next(err)
  }
}