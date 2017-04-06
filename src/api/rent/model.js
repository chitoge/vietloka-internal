import mongoose, { Schema } from 'mongoose'

const rentSchema = new Schema({
  guest: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  house: {
    type: Schema.ObjectId,
    ref: 'House',
    required: true
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

rentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      guest: this.guest.view(full),
      house: this.house,
      accepted: this.accepted,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Rent', rentSchema)

export const schema = model.schema
export default model
