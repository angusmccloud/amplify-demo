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
import { fetchPeople, createPerson, deletePerson } from "./services";

export default function HomePage ({user, signOut}) {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchPeople(setPeople);
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
      <View as="form" margin="3rem 0" onSubmit={(event) => createPerson(event, setPeople)}>
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
              onClick={() => deletePerson(person.id, setPeople)}
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