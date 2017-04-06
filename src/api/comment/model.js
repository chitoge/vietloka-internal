import mongoose, { Schema } from 'mongoose'

// guest-to-host comment
const commentSchema = new Schema({
  guest: {
    type: Schema.ObjectId,
    ref: 'Guest',
    required: true
  },
  guest: {
    type: Schema.ObjectId,
    ref: 'Guest',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Schema.Types.Number,
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
      user: this.user.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Comment', commentSchema)

export const schema = model.schema
export default model
