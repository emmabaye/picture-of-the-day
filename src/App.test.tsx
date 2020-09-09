import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LocalStorageMock } from '@react-mock/localstorage';
 

const initialState = {
  currentDate: "2020-09-09",
}
const mockStore = configureStore([])(initialState);
let localStorageItems = {
  '2020-09-09': "{\"date\":\"2020-08-30\",\"explanation\":\"How massive can a normal star be?  Estimates made from distance, brightness and standard solar models had given one star in the open cluster Pismis 24 over 200 times the mass of our Sun, making it one of the most massive stars known.  This star is the brightest object located just above the gas front in the featured image.  Close inspection of images taken with the Hubble Space Telescope, however, have shown that Pismis 24-1 derives its brilliant luminosity not from a single star but from three at least.  Component stars would still remain near 100 solar masses, making them among the more massive stars currently on record.  Toward the bottom of the image, stars are still forming in the associated emission nebula NGC 6357. Appearing perhaps like a Gothic cathedral, energetic stars near the center appear to be breaking out and illuminating a spectacular cocoon.   Teachers & Students: Ideas for Utilizing APOD in the Classroom\",\"hdurl\":\"https://apod.nasa.gov/apod/image/2008/ngc6357_hubble_3140.jpg\",\"media_type\":\"image\",\"service_version\":\"v1\",\"title\":\"NGC 6357: Cathedral to Massive Stars\",\"url\":\"https://apod.nasa.gov/apod/image/2008/ngc6357_hubble_960.jpg\"}",
};

const renderComponent = (localStorageItems) =>
  render(
    <LocalStorageMock items={localStorageItems}>
      <Provider store={mockStore}><App /></Provider>
    </LocalStorageMock>
);

describe('renders ', () => {
  it('should take a snapshot', () => {
    const { asFragment } = renderComponent(localStorageItems);
    
    expect(asFragment()).toMatchSnapshot()
   })
  
   it('should renders toast correctly', () => {
    const { container } = renderComponent(localStorageItems);
  
    expect(container.querySelector('.Toastify')).toBeInTheDocument();
    expect(container.querySelector("img[alt='APOD']")).toBeInTheDocument();
   })
   
   it('renders picture of the day', () => {
    const { container } = renderComponent(localStorageItems);

    expect(container.querySelector("img[alt='APOD']")).toBeInTheDocument();
   })
});