import React, { createContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../../common/UserPool';

const AccountContext = createContext();

const Account = props => {
  const getSession = async () =>
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
    }
  );

  const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: data => {
          resolve(data);
        },

        onFailure: err => {
          reject(err);
        },

        newPasswordRequired: data => {
          resolve(data);
        }
      });
    });

  const signUp = async (email, password) => 
    await new Promise((resolve, reject) => {
      Pool.signUp(email, password, [], null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  
  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  }

  return (
    <AccountContext.Provider value={{
      authenticate,
      getSession,
      signUp,
      logout
    }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };