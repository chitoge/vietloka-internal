import mongoose, { Schema } from 'mongoose'

const houseSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'Host',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  numOfMember: {
    type: String,
    required: true
  },
  hasChildren: {
    type: Boolean,
    required: true
  },
  hasOlders: {
    type: Boolean,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  price: {
    monthlyPrice: {
      type: String,
      required: true
    },
    electricityPrice: {
      type: String,
      required: true
    },
    waterPrice: {
      type: String,
      required: true
    }
  },
  numOfPeopleRented: {
    type: Schema.Types.Number,
    required: true
  },
  numOfRemainingSlot: {
    type: Schema.Types.Number,
    required: true
  },
  properties: {
    houseAspect: {
      type: String
    },
    hasElectricHeater: {
      type: Boolean
    },
    hasWashingMachine: {
      type: Boolean,
    },
    hasTV: {
      type: Boolean
    },
    hasCarPark: {
      type: Boolean
    },
    WC: {
      type: String,
      required: true
    },
    hasInternet: {
      type: Boolean,
      required: true
    },
    others: [{
      type: String
    }]
  },
  peopleRented: [{
    type: Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  }],
  image: [{
    type: String,
    required: true
  }],
  map: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

houseSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      host: this.host.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('House', houseSchema)

export const schema = model.schema
export default model
