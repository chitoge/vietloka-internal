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
    type: Number,
    required: true
  },
  price: {
    type: Schema.Types.Number,
    required: true  
  },
  
  numOfTotalSlots: {
    type: Schema.Types.Number,
    required: true
  },

  //properties
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
  description: {
    type: String
  },

  image: [{
    type: String,
    required: true
  }],
  map: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
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
      address: this.address,
      numOfMember: this.numOfMember,
      hasChildren: this.hasChildren,
      hasOlders: this.hasOlders,
      ares: this.area,
      price: this.price,
      numOfTotalSlots: this.numOfTotalSlots,
      houseAspect: this.houseAspect,
      hasElectricHeater: this.hasElectricHeater,
      hasWashingMachine: this.hasWashingMachine,
      hasTV: this.hasTV,
      WC: this.WC,
      hasInternet: this.hasInternet,
      description: this.description,
      image: this.image,
      map: this.map,
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
