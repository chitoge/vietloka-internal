import mongoose, { Schema } from 'mongoose'

// guest-to-host comment
const commentSchema = new Schema({
  guest: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  rent: {
    type: Schema.ObjectId,
    ref: 'Rent',
    required: true,
    unique: true // so only 1 comment per rent
  },
  content: {
    type: String,
    required: true
  },
  // NOTE: approves here means house is good or bad; doesn't mean that the content is approved by a moderator
  // considering adding that next
  approves: {
    type: Boolean,
    required: true
  },
}, {
  timestamps: true
})

commentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      guest: this.guest.view(full),
      house: this.rent.house.id,
      title: this.title,
      content: this.content,
      approves: this.approves,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      rent: this.rent.view(full)
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Comment', commentSchema)

export const schema = model.schema
export default model
