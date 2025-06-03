import { useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import {
    fetchPeople,
  fetchRallyTypes,
  insertPerson,
  insertRally,
} from "../DatabaseAccess/select";
import { InputOption, PeopleObject, RallyTypeObject } from "../Types";
import { CreatableTypeInput } from "./TypeInput";

export default function Header({}) {
  const [editActive, setEditActive] =
    useState(false);

  const [rallyTypes, setRallyTypes] =
    useState<RallyTypeObject[]>();

    const [people,setPeople] = useState<PeopleObject[]>();
  const [hits, setHits] = useState<string>();
  const [rallyType, setRallyType] =
    useState<string>();
  const [peopleId, setPeopleId] =
    useState<string>();

    const [peopleOptions, setPeopleOptions] = useState<InputOption[]>();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setRallyTypes(await fetchRallyTypes());
    const people = await fetchPeople();
    setPeople(people);
    createInputOptions(people);
  }

  function createInputOptions(people: PeopleObject[]) {

    const returnArray = new Array<InputOption>();
    people.forEach(person => {
      returnArray.push({value: person.id, label: person.name});
    })

    setPeopleOptions(returnArray);

  }

  async function addPeople(name: string) {

    try {
      await insertPerson(name);
      console.log("added", name)
      await getData();

    } catch (error) {
      alert(error?.message)
    }

  }

  return (
    <div className="row boxed between w100">
      <EditMenu
        width={300}
        height={500}
        isActive={editActive}
        setIsActive={() => setEditActive(false)}
      >
        <h3>Add Rally</h3>
        <div>
          <label>Type</label>
        </div>
        <select
          value={rallyType}
          onChange={(e) =>
            setRallyType(e.target.value)
          }
        >
          {rallyTypes?.map((type) => (
            <option key={type.id} id={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <div>
          <label>Number of hits</label>
          <input
            value={hits}
            onChange={(e) =>
              setHits(e.target.value)
            }
            type="number"
          />
        </div>
        <div>
          <label>name or group</label>
          <CreatableTypeInput
            onChange={(val) => setPeopleId(val)}
            onCreate={(val) => {addPeople(val)}}
            options={peopleOptions}
            disabled={false}
            defaultValue={peopleId}
            placeholder="select a category"
            />
          <select value={peopleId} onChange={e => setPeopleId(e.target.value)}>
            <option></option>
          </select>
        </div>
      </EditMenu>
      <p>Ping-Pong-A-Thon</p>

      <button onClick={() => setEditActive(true)}>
        +
      </button>
    </div>
  );
}
