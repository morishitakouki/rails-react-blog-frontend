import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import CommonLayout from "components/layouts/CommonLayout";
import Home from "components/pages/Home";
import SignUp from "components/pages/SignUp";
import SignIn from "components/pages/SignIn";

import { getCurrentUser } from "lib/api/auth";
import AlertMessage from "components/utils/AlertMessage";
import { User } from "interfaces/index";

export const AuthContext = createContext({});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        console.log(res?.data.data);
      } else {
        console.log("No current user");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Redirect to="/signin" />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <Router>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Private>
              <Route exact path="/" component={Home} />
            </Private>
          </Switch>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
