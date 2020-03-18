// NB: we don't use anymore fetches actions as it is handled with getStaticProps in pages
// maybe delete this and replace with action to dispatch from props to store if needed.
export const FETCH_OFFERS = 'FETCH_OFFERS';
export const FETCH_OFFERS_START = 'FETCH_OFFERS_START';
export const FETCH_OFFERS_SUCCESS = 'FETCH_OFFERS_SUCCESS';
export const FETCH_OFFERS_FAIL = 'FETCH_OFFERS_FAIL';

export const FETCH_OFFER = 'FETCH_OFFER';
export const FETCH_OFFER_START = 'FETCH_OFFER_START';
export const FETCH_OFFER_SUCCESS = 'FETCH_OFFER_SUCCESS';
export const FETCH_OFFER_FAIL = 'FETCH_OFFER_FAIL';

export const POST_OFFER = 'POST_OFFER';
export const POST_OFFER_START = 'POST_OFFER_START';
export const POST_OFFER_SUCCESS = 'POST_OFFER_SUCCESS';
export const POST_OFFER_FAIL = 'POST_OFFER_FAIL';
export const POST_OFFER_CLEAR = 'POST_OFFER_CLEAR';

export const AUTH_CHECK_STATE = 'AUTH_CHECK_STATE';
export const AUTH_START = 'AUTH_START';
export const AUTH_USER = 'AUTH_USER';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_CHECK_TIMEOUT = 'AUTH_CHECK_TIMEOUT';
export const AUTH_INITIATE_LOGOUT = 'AUTH_INITIATE_LOGOUT';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_SET_FIRST_CHECK = 'AUTH_SET_FIRST_CHECK';
