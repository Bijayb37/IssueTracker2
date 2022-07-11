import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { postComment, patchComment } from "../store/actions/issueActions"

export default function CommentsForm({ closeModal, issueId, comment, edit }) {
  const [newComment, setNewComment] = useState(comment?.text || "")
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setNewComment(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    edit
      ? dispatch(patchComment(issueId, comment._id, newComment))
      : dispatch(postComment(issueId, newComment))
    closeModal()
  }
  return (
    <div>
      <form>
        <div className="mb-3">
          <label htmlFor="comments" className="form-label">
            Comment:
          </label>
          <input
            value={newComment ? newComment : ""}
            onChange={handleChange}
            type="text"
            className="form-control"
            name="comment"
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {edit ? "Edit Comment" : "Add Comment"}
        </button>
      </form>
    </div>
  )
}
