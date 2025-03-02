"use client"
import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchPeople();
    console.log('-- Client --', client);
  }, []);

  async function fetchPeople() {
    const { data: persons } = await client.models.Person.list();
    await Promise.all(
      persons.map(async (person) => {
        if (person.image) {
          const linkToStorageFile = await getUrl({
            path: ({ identityId }) => `media/${identityId}/${person.image}`,
          });
          console.log(linkToStorageFile.url);
          person.image = linkToStorageFile.url;
        }
        return person;
      })
    );
    console.log(persons);
    setPeople(persons);
  }

  async function createPerson(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    // console.log(form.get("image").name);
    console.log('-- Name --', form.get("name"))
    console.log('-- Company --', form.get("company"))
    console.log('-- Image --', form.get("image"))
    
    const { data: newPerson } = await client.models.Person.create({
      name: form.get("name"),
      description: form.get("company"),
      // image: form.get("image").name,
      image: null,
    });

    console.log('-- New Person --', newPerson);
    // if (newPerson.image) {
    //   console.log('Uploading image');
    //   await uploadData({
    //     path: ({ identityId }) => `media/${identityId}/${newPerson.image}`,
    //     data: form.get("image"),
    //   }).result;
    // }

    fetchPeople();
    event.target.reset();
  }

  async function deletePerson({ id }) {
    const toBeDeletedPerson = {
      id: id,
    };

    const { data: deletedPerson } = await client.models.Person.delete(
      toBeDeletedPerson
    );
    console.log(deletedPerson);

    fetchPeople();
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>My People App</Heading>
          <View as="form" margin="3rem 0" onSubmit={createPerson}>
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
              <View
                name="image"
                as="input"
                type="file"
                alignSelf={"end"}
                accept="image/png, image/jpeg"
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
                {person.image && (
                  <Image
                    src={person.image}
                    alt={`visual aid for ${person.name}`}
                    style={{ width: 400 }}
                  />
                )}
                <Button
                  variation="destructive"
                  onClick={() => deletePerson(person)}
                >
                  Delete Person
                </Button>
              </Flex>
            ))}
          </Grid>
          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}