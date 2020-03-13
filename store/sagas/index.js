import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {fetchOffersSaga, postOfferSaga, fetchOfferSaga} from './offer';

export function* watchOffer() {
  yield takeEvery(actionTypes.FETCH_OFFERS, fetchOffersSaga);
  yield takeEvery(actionTypes.FETCH_OFFER, fetchOfferSaga);
  yield takeEvery(actionTypes.POST_OFFER, postOfferSaga);
}
