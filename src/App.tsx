import React, { useEffect, Dispatch, ChangeEvent } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosResponse } from "axios"
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaTrash, FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import dotenv from 'dotenv';
import './App.css';

dotenv.config();

export const getPictureOfDay = async (date: string):Promise<AxiosResponse<any>> => {
  try {
    const pictureData: AxiosResponse<any> = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}&&date=${date}`
    )
   return pictureData;
  } catch (error) {
     // @ts-ignore
     return toast.error("Error: Cannot fetch picture data");
  }
}

const App: React.FC = () => {
  const picture: any = useSelector((state: IAppState) => ({currentDate: state.currentDate, isLoading: state.isLoading}));
  const currentPictureData: IPictureData =  JSON.parse(localStorage.getItem(picture.currentDate) || '{}');
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    const currentDate: string = moment(Date.now()).format('YYYY-MM-DD');
    dispatch({
      type: 'LOADING',
      payload: {
        isLoading: true,
      }
    });
    getPictureOfDay(currentDate).then((response) => {
      dispatch({type: 'GET_PICTURE', payload: response.data});
      dispatch({
        type: 'LOADING',
        payload: {
          isLoading: false,
        }
      });
    }).catch(e => e);
  }, [dispatch]);

  const handleDatePicker = (e:  ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const selectedDate = target.value;

    const isDateAheadOfToday = moment(moment(Date.now()).format('YYYY-MM-DD')).diff(moment(selectedDate), 'days') < 0
    if(isDateAheadOfToday){
      return toast.error("Error: Cannot fetch future date");
    }

    getPictureOfDay(target.value).then((response) => {
      dispatch({type: 'GET_PICTURE', payload: response.data});
    }).catch(e => e);
  }

  const getPreviousDay = () => {
    const previosDate: string = moment(picture.currentDate).subtract(1, 'days').format('YYYY-MM-DD')
    dispatch({
      type: 'LOADING',
      payload: {
        isLoading: true,
      }
    });
    getPictureOfDay(previosDate).then((response) => {
      dispatch({type: 'GET_PICTURE', payload: response.data});
      dispatch({
        type: 'LOADING',
        payload: {
          isLoading: false,
        }
      });
    }).catch(e => e);
  }

  const getNextDay = () => {
     const nextDate: string = moment(picture.currentDate).add(1, 'days').format('YYYY-MM-DD')
     dispatch({
      type: 'LOADING',
      payload: {
        isLoading: true,
      }
    });
     getPictureOfDay(nextDate).then((response) => {
      dispatch({type: 'GET_PICTURE', payload: response.data});
      dispatch({
        type: 'LOADING',
        payload: {
          isLoading: false,
        }
      });
    }).catch(e => e);
  }

  const isFavourite = () => {
    const favourites = localStorage.getItem('favourites');
     if(typeof favourites === 'string') {
       return favourites.includes(picture.currentDate);
     }
  }

  const handleFavourite = () => {
    const favourites = localStorage.getItem('favourites');
    if( favourites === null) {
      return localStorage.setItem('favourites', JSON.stringify([picture.currentDate]));
    }
    let favouritesArray  = JSON.parse(favourites);
    if(!favourites.includes(picture.currentDate)){
      favouritesArray.push(picture.currentDate);
      toast.info("Picture has been added to favourites");
    } else {
      favouritesArray = favouritesArray.filter((item) => {
        return item !== picture.currentDate
      })
      toast.info("Picture has been removed from favourites");
    }
   
    localStorage.setItem('favourites', JSON.stringify(favouritesArray));
    dispatch({type: 'RENDER'});
  }

  const handleClearAllFavourites = () => {
    Swal.fire({
      title: 'Are you sure you want to clear all favourites?',
      showCancelButton: true,
      confirmButtonText: `Confirm`,
    }).then((result) => {
      if (result.isConfirmed) {
       localStorage.setItem('favourites', JSON.stringify([]));
       dispatch({type: 'RENDER'});
      }
    })
  }
 
  return (
    <div className="App">
      <ToastContainer />
      <div className="App-section">
        <h2>{currentPictureData.title}</h2>
        <div className='picture-container'>
          <div className='picture-viewer'>
            <button className='arrow-button' onClick={() => getPreviousDay()} >
              <FaChevronCircleLeft size={50} />
            </button>
            {
              picture.isLoading ?
               <div className='loading'><img src='./loader.gif' height='60px' alt='LOADING...'/></div> :
               <div>
              {currentPictureData.media_type === 'image' &&
              <img
                src={currentPictureData.url}
                className="image"
                alt="APOD"
              />
              }
              {currentPictureData.media_type === 'video' &&
              <iframe
                src={currentPictureData.url}
                className="image"
                title={currentPictureData.url}
              />
              }
              <div className='favourite-today-group'>
                <button className='favourite-button' onClick={handleFavourite}>
                   <span>Favourite<FaStar  className={classNames('icon',{ favouritedStar: isFavourite()})} size={20} /></span>
                </button>
                  <input type='date' value={picture.currentDate} onChange={handleDatePicker}/>
                  <button className='clear-button' onClick={handleClearAllFavourites}>
                    <span>Clear all favourites<FaTrash className='icon trash-icon' size={20} /></span>
                  </button>
              </div>
            </div>
            }
            <button className='arrow-button' onClick={() => getNextDay()}>
              <FaChevronCircleRight size={50} />
            </button>
          </div>
        </div>
        <p className='description'>
          {currentPictureData.explanation}
        </p>
      </div>
    </div>
  );
}

export default App;
