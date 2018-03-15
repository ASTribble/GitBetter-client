import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_PROTECTED_DATA_SUCCESS = 'FETCH_PROTECTED_DATA_SUCCESS';
export const fetchProtectedDataSuccess = data => ({
    type: FETCH_PROTECTED_DATA_SUCCESS,
    data
});

export const FETCH_PROTECTED_DATA_ERROR = 'FETCH_PROTECTED_DATA_ERROR';
export const fetchProtectedDataError = error => ({
    type: FETCH_PROTECTED_DATA_ERROR,
    error
});

export const fetchProtectedData = () => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: {
            // Provide our auth token as credentials
            Authorization: `Bearer ${authToken}`
        }
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(res => {console.log(res[0]);
            return dispatch(fetchProtectedDataSuccess(res[0]));
        })
        .catch(err => {
            dispatch(fetchProtectedDataError(err));
        });
};

export const SAVE_QUESTION_RESULT_REQUEST = 'SAVE_QUESTION_RESULT_REQUEST';
export const saveQuestionResultRequest = () => ({
  type: SAVE_QUESTION_RESULT_REQUEST,
  savingQuestion: true
});

export const SAVE_QUESTION_RESULT_SUCCESS = 'SAVE_QUESTION_RESULT_SUCCESS';
export const saveQuestionResultSuccess = () => ({
  type: SAVE_QUESTION_RESULT_SUCCESS,
  savingQuestion: false
});


export const SAVE_QUESTION_RESULT_ERROR= 'SAVE_QUESTION_RESULT_ERROR';
export const saveQuestionResultError = (error) => ({
  type: SAVE_QUESTION_RESULT_ERROR,
  savingQuestion: false,
  error
});


export const saveQuestionResult = (questionId, answer) => (dispatch, getState) => {
  console.log('We have question id ', questionId, ' and the answer was ', answer)
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/questions`, {
      method: 'PUT',
      headers: {
          // Provide our auth token as credentials
          'Authorization': `Bearer ${authToken}`,
          'content-type':'application/json',
          'accept':'application/json'
      },
      body: JSON.stringify({questionId: questionId, answer: answer})
  })
      .then(res => normalizeResponseErrors(res))
      .then(res => res.json())
      .then(res => {console.log(res[0]);
          dispatch(fetchProtectedData())
          return dispatch(saveQuestionResultSuccess(res[0]));
      })
      .catch(err => {
          dispatch(saveQuestionResultError(err));
      });
}