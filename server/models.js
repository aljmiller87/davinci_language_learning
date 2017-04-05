const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {type: String, required: true},
	googleId: {type: String, unique: true, required: true},
	accessToken: {type: String, unique: true, required: true},
	correctCount: {type: Number, required: true},
	questionCount: {type: Number, required: true},
	questionsArray: {type: Array}
});

const questionsSchema = mongoose.Schema({
  question: {type: String, required: true},
  options: {type: Array, required: true},
  answer: {type: Number, required: true},
  m: {type: Number, required: true}
})

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    googleId: this.googleId,
    accessToken: this.accessToken,
    correctCount: this.correctCount,
    questionCount: this.questionCount,
    questionArray: this.questionArray
  };
}

questionsSchema.methods.apiRepr = function() {
  return{
    id: this._id,
    question: this.question,
    options: this.options,
    answer: this.answer,
    m: this.m
  }
}

const User = mongoose.model('User', userSchema);
const Questions = mongoose.model('Questions', questionsSchema);

module.exports = { User, Questions};