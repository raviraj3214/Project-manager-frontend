import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  updateInfo: async () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false); 
  }, []);

  const login = (data) => {
    localStorage.setItem('user', JSON.stringify(data?.info));
    setUser(data?.info);
  };

  const logout = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      // Clear user state and local storage on successful logout
      localStorage.removeItem('user');
      setUser(null);
      navigate('/auth'); // Redirect to login or home page after logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const updateInfo = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/users', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message);
      }

      const resObj = await res.json();
      setUser(resObj.data.info);
      localStorage.setItem('user', JSON.stringify(resObj?.data?.info));
    } catch (error) {
      console.log('Error updating user info:', error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, updateInfo }}
    >
      {!isLoading && children} {/* Only render children when loading is complete */}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// import { createContext, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { Navigate, useNavigate } from 'react-router-dom';

// export const AuthContext = createContext({
//   user: {},
//   login: () => {},
//   logout: () => {},
//   isLoading: true,
//   updateInfo: async () => {},
// });

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem('user'));
//     if (savedUser) {
//       setUser(savedUser);
//     }
//     setIsLoading(false);
//   }, []);

//   const login = (data) => {
//     localStorage.setItem('user', JSON.stringify(data.info));
//     setUser(data.info);
//   };

//   // const logout = () => {
//   //   localStorage.removeItem('user');
//   //   setUser(null);
//   // };
//   const navigate = useNavigate();

//   const logout = async () => {
//     try {
//       const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/logout', {
//         method: 'POST',
//         credentials: 'include', // Important to include cookies in the request
//       });

//       if (!res.ok) {
//         throw new Error('Logout failed');
//       }
//       setUser(null);

//       // Optionally clear any user context or state here
//       // authCtx.logout(); // This is just an example, adapt based on your context
//       navigate('/auth'); // Redirect to login or home page
//     } catch (error) {
//       console.error('Logout error:', error.message);
//     }
//   };

//   const updateInfo = async () => {
//     try {
//       const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/users', {
//         method: 'GET',
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         const errJson = await res.json();
//         throw new Error(errJson.message);
//       }

//       const resObj = await res.json();
//       setUser( resObj.data.user );
//       localStorage.setItem(
//         'user',
//         JSON.stringify(resObj.data.user)
//       );
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, logout, isLoading, updateInfo }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// AuthProvider.propTypes = {
//   children: PropTypes.element,
// };
