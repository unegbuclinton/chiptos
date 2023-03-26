import mongoose from 'mongoose'

const DataSchema = new mongoose.Schema({
  address: { 
    type:String,
    required: true
  },
}, {strict: false})

export default mongoose.models.chiptos_collector_data || mongoose.model('chiptos_collector_data', DataSchema, 'chiptos_collector_data')