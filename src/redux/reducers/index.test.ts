// @ts-nocheck
import pictureReducer from "."

const state = { currentDate: "2020-09-09"};

it('should return state', () => {
    expect(pictureReducer(state, {type: 'INVALID_TYPE'})).toEqual(state);
    expect(pictureReducer(state, {type: 'RENDER'})).toEqual(state);

})

describe('when action is passed to reducer', () => {
    expect(pictureReducer(state, {type: 'GET_PICTURE', payload:{ date:"2020-09-08" }})).toEqual(({ "currentDate": "2020-09-08"}));
});

