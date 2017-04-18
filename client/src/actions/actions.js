import thunk from 'redux-thunk';
import store from '../store';
import axios from 'axios';
import * as Cookies from 'js-cookie';

export const QUIZ_ACTIVE = 'QUIZ_ACTIVE';
export const quizActive = () => ({
	type: QUIZ_ACTIVE,
	quizActive: quizActive
})

export const INSTRUCTIONS_ACTIVE = 'INSTRUCTIONS_ACTIVE';
export const instructionsActive = () => ({
	type: INSTRUCTIONS_ACTIVE,
	quizActive: instructionsActive
})

export const asyncFirstQuestion = () => (dispatch) => {
	const accessToken = Cookies.get('accessToken')
		fetch('/api/firstquestion', {
			headers: {
				'Authorization': `Bearer ${accessToken}`}
		})
		.then(res => {
			if (!res.ok) {
				if(res.status !== 401) {
					// Clear and return to login page
					Cookies.remove('accessToken');
					return;
				}
				throw new Error(res.statusText);
			}
			return res.json();
		}).then(_res => {
			let newQuestion = {}
			return dispatch(firstQuestion(_res));
		}).catch(error => {
			return error;
		})
}


export const FIRST_QUESTION = 'FIRST_QUESTION';
export const firstQuestion = (response) => ({
	type: FIRST_QUESTION,
	response: response
})

export const asyncNextQuestion = (answer) => (dispatch) => {
	console.log('answer', answer)
	const accessToken = Cookies.get('accessToken')
	// console.log('accessToken', accessToken);
		fetch(`/api/nextquestion/:${answer}`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'}
			// body: JSON.stringify({answer: 1})
		})
		.then(res => {
			if (!res.ok) {
				if(res.status !== 401) {
					// Clear and return to login page
					Cookies.remove('accessToken');
					return;
				}
				throw new Error(res.statusText);
			}
			// console.log("First Question?", res.json());
			return res.json();
		}).then(_res => {
			console.log("_res", _res)
			let newQuestion = {}
			return dispatch(nextQuestion(_res));
		}).catch(error => {
			return error;
		})
}

export const NEXT_QUESTION = 'NEXT_QUESTION';
export const nextQuestion = (response) => ({
	type: NEXT_QUESTION,
	response: response
})

export const asyncStartQuiz = () => dispatch => {
	const accessToken = Cookies.get('accessToken')
	console.log("AccessToken found?", accessToken);
	fetch('/api/loadspanishquestions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`}
	})
	.then(res => {
		if (!res.ok) {
			if(res.status !== 401) {
				// Clear and return to login page
				Cookies.remove('accessToken');
				return;
			}
			throw new Error(res.statusText);
		}
    	return res.json(); 
  	})
  	.then(_res => {
  		// dispatch(startQuiz(_res))
  	})
  	.catch(error => {
  		return error;
  	})
}

