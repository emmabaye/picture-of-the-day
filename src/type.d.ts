
interface IAppState {
  isLoading: boolean;
  currentDate: string 
}

interface IAction { 
  type: string,
  payload: {
    date: string,
    isLoading: boolean
  }
}

interface IPictureData {
 title: string,
 date: string,
 url: string,
 explanation: string,
 media_type: string,
}