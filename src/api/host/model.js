import mongoose, { Schema } from 'mongoose'

const hostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    required: true,
    default: true // TODO: for development only; need to implement actual verify mechanism
  }
  // TODO: add secure messaging mechanism
}, {
  timestamps: true
})

hostSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      job: this.user.job,
      placeOfWork: this.user.placeOfWork,
      gender: this.user.gender,
      dateOfBirth: this.user.dateOfBirth,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Host', hostSchema)

export const schema = model.schema
export default model
