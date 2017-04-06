import mongoose, { Schema } from 'mongoose'

const guestSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  /* Can we merge into ID number in User?
  SSC: {
    type: String,
    required: true
  },
  */
  historyRenting: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'House',
      required: true
    }
  }]
}, {
  timestamps: true
})

guestSchema.methods = {
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

const model = mongoose.model('Guest', guestSchema)

export const schema = model.schema
export default model
