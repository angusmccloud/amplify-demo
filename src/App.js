import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "./amplify_outputs.json";
import HomePage from './HomePage'

Amplify.configure(outputs);

export default function App() {
  
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <HomePage signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}