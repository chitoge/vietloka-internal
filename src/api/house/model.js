import mongoose, { Schema } from 'mongoose'

const houseSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  numOfMember: {
    type: Number,
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
      type: Schema.Types.Number,
      required: true
    },
    electricityPrice: {
      type: Schema.Types.Number,
      required: true
    },
    waterPrice: {
      type: Schema.Types.Number,
      required: true
    }
  },
  numOfPeopleRented: {
    type: Schema.Types.Number,
    required: true,
    default: 0
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
  /*
  peopleRented: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  */
  image: [{
    type: String,
    required: true
  }],
  map: {
    lat: {
      type: number,
      required: true
    },
    lng: {
      type: number,
      required: true
    }
  }
}, {
  timestamps: true
})

houseSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      owner: this.owner.view(full),
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
