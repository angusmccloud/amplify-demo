import { useState, useEffect } from "react";
import {
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createPerson, deletePerson } from "./services";
import { generateClient } from "aws-amplify/data";

// Used for Subscription
const client = generateClient();

export default function HomePage ({user, signOut}) {
  const [people, setPeople] = useState([]);

  // If you were doing one-time fetch
  // useEffect(() => {
  //   fetchPeople(setPeople);
  // }, []);

  // Sample for doing a data-subscription, then no need to do refreshes on changes (remote or local)
  useEffect(() => {
    const sub = client.models.Person.observeQuery().subscribe({
      next: ({ items }) => {
        setPeople([...items]);
      },
    });
    return () => {
      // If you have multiple data models, make sure you ubsub from all of them
      sub.unsubscribe();
    };
  }, []);

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My People App</Heading>
      <View as="form" margin="3rem 0" onSubmit={(event) => createPerson(event)}>
        <Flex
          direction="column"
          justifyContent="center"
          gap="2rem"
          padding="2rem"
        >
          <TextField
            name="name"
            placeholder="Person's Name"
            label="Person's Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="company"
            placeholder="Employing Company"
            label="Employing Company"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Person
          </Button>
        </Flex>
      </View>
      <Divider />
      <Heading level={2}>Current People</Heading>
      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {people.map((person) => (
          <Flex
            key={person.id || person.name}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{person.name}</Heading>
            </View>
            <Text fontStyle="italic">{person.company}</Text>
            <Button
              variation="destructive"
              onClick={() => deletePerson(person.id)}
            >
              Delete Person
            </Button>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}