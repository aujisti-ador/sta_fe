import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import Cookies from 'js-cookie';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project import
import Loader from 'components/Loader';
// import axios from 'axios';
// import axios from 'utils/axios';
import axios from 'utils/axiosdd';
const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = async () => {
  try {
    const response = await axios.get('/auth/verify');

    // Handle success
    console.log('Token verification successful');
    console.log('User data:', response.data); // Assuming the server sends user data in the response

    // You can perform additional actions here based on a successful token verification
    return response;
  } catch (error) {
    // Handle errors
    if (axios.isAxiosError(error)) {
      // Axios error, which means there was an HTTP response with a status code outside the range of 2xx
      if (error.response) {
        // The request was made, but the server responded with a status code that falls out of the range of 2xx
        console.error('Request failed with status code:', error.response.status);
        console.error('Error data:', error.response.data);

        // You can perform specific actions based on different status codes or error response data

      } else if (error.request) {
        // The request was made, but no response was received
        console.error('No response received from the server');

        // You can perform specific actions for requests that didn't receive a response

      } else {
        // Something went wrong while setting up the request or processing the response
        console.error('Error setting up the request or processing the response:', error.message);
      }
    } else {
      // Non-Axios error, such as a network error or a timeout
      console.error('Non-Axios error:', error.message);
    }

    // You can perform additional actions here based on the type of error

  }
};


const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  console.log("==> root auth", state);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await verifyToken();
        const { data } = response;
        console.log("===> response", response);


        if (data) {
          dispatch({
            type: LOGIN,
            payload: {
              user: data
            }
          });
        } else {
          console.log("===> else", user)
          dispatch({
            type: LOGOUT
          });
        }

        // const serviceToken = window.localStorage.getItem('serviceToken');

        // if (serviceToken && verifyToken(serviceToken)) {
        //   setSession(serviceToken);
        //   const response = await axios.get('/api/account/me');
        //   const { user } = response.data;
        //   dispatch({
        //     type: LOGIN,
        //     payload: {
        //       isLoggedIn: true,
        //       user
        //     }
        //   });
        // } else {
        //   dispatch({
        //     type: LOGOUT
        //   });
        // }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (office_id, password) => {
    console.log("===> here", office_id, password, process.env.REACT_APP_API_URL);
    // const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, { office_id, password });
    const response = await axios.post(`/auth/signin`, { office_id, password });
    console.log("===> res", response);
    // const { serviceToken, user } = response.data;
    const user = response.data;
    console.log("===> user", user);
    // setSession(serviceToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });

    const authenticationCookieValue = Cookies.get('Authentication');
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = async () => {
    await axios.post(`/auth/logout`);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
