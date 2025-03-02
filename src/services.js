import { generateClient } from "aws-amplify/data";

export const fetchPeople = async (setPeople) => {
  const client = generateClient();
  const { errors, data } = await client.models.Person.list({
    authMode: 'userPool',
  });
  if(errors) {
    console.log('-- People Persons Errors --', errors);
    setPeople([]);
    return;
  }

  console.log('-- Persons Data --', data);
  setPeople(data);
}

export const createPerson = async (event, setPeople) => {
  const client = generateClient();
  event.preventDefault();
  const form = new FormData(event.target);
  // console.log(form.get("image").name);
  console.log('-- Name --', form.get("name"))
  console.log('-- Company --', form.get("company"))

  const newPerson = {
    name: form.get("name"),
    company: form.get("company"),
  }

  const { errors, data } = await client.models.Person.create(
    newPerson,
    { authMode: 'userPool'},
  );
  if(errors) {
    console.log('Error creating person:', errors);
    return;
  }

  console.log('-- New Person --', data);
  fetchPeople(setPeople);
  event.target.reset();
}

export const deletePerson = async (id, setPeople) => {
  const client = generateClient();
  const toBeDeletedPerson = {
    id: id,
  };

  const { errors, data } = await client.models.Person.delete(
    toBeDeletedPerson
  );
  if(errors) {
    console.log('Error deleting person:', errors);
    return
  }

  console.log('-- Deleted Person --', data);
  fetchPeople(setPeople);
}
