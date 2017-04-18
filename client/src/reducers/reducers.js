import update from 'immutability-helper';
import * as actions from '../actions/actions';
import store from '../store';

const initialState = {
	question: "",
	options:[],
	questionCount: "",
	correctCount: "",
	instructions: true
};

export function mainReducer (state = initialState, action) {
	if (action.type === 'QUIZ_ACTIVE') {
		return update(state, {
			instructions: {$set: false}
		})
	}

	if (action.type === 'INSTRUCTIONS_ACTIVE') {
		return update(state, {
			instructions: {$set: true}
		})
	}

	if (action.type === 'FIRST_QUESTION') {
		let currentQuestion = action.response.currentQuestion.question;
		let currentOptions = action.response.currentQuestion.options;
		let updatedQuestionCount = action.response.questionCount;
		let updatedCorrectCount = action.response.correctCount;

		return update(state, {
			question: {$set: currentQuestion},
			options: {$set: [currentOptions]},
			questionCount: {$set: updatedQuestionCount},
			correctCount: {$set: updatedCorrectCount}
		})
	}

	if (action.type === 'NEXT_QUESTION') {
		let currentQuestion = action.response.nextQuestion.question;
		let currentOptions = action.response.nextQuestion.options;
		let updatedQuestionCount = action.response.questionCount;
		let updatedCorrectCount = action.response.correctCount;
		return update(state, {
			question: {$set: currentQuestion},
			options: {$set: [currentOptions]},
			questionCount: {$set: updatedQuestionCount},
			correctCount: {$set: updatedCorrectCount}
		})

	}

	return state;
		
}