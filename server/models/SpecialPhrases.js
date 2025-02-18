import mongoose from "mongoose";

const phraseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phrase: {type:String, required:true}
  },
  { timestamps: true }
);

const Phrase = mongoose.model("Phrase", phraseSchema);

export default Phrase;
