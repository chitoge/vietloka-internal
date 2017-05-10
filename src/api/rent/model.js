import mongoose, { Schema } from 'mongoose'
import crypto from 'crypto'

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
  confirmation_token: {
    type: String,
    required: true,
    default: crypto.randomBytes(32).toString('hex')
  },
  // TODO: add to House schema a CSRF token to prevent illegal requests
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
      updatedAt: this.updatedAt,
      // for development purposes only, send confirmation URL directly back to the creator
      dev_confirmation_link: '/rents/' + this.id.toString() + '/confirm?otp_token=' + this.confirmation_token
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
