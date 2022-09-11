import { useState, useEffect } from "react";
import { Animal, BreedListAPIresponse } from "./APIResponsesTypes";

type Status = "unloaded" | "loading" | "loaded";

const localCache: {
  [index: string]: string[];
} = {};

export default function useBreedList(animal: Animal) {
  const [breedList, setBreedList] = useState([] as string[]);
  const [status, setStatus] = useState<Status>("unloaded" as Status);

  useEffect(() => {
    if (!animal) {
      setBreedList([]);
    } else if (localCache[animal]) {
      setBreedList(localCache[animal]);
    } else {
      void requestBreedList();
    }

    async function requestBreedList() {
      setBreedList([]);
      setStatus("loading");
      const res = await fetch(
        `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
      );
      const json = (await res.json()) as BreedListAPIresponse;
      localCache[animal] = json.breeds || [];
      setBreedList(localCache[animal]);
      setStatus("loaded");
    }
  }, [animal]);

  return [breedList, status] as [string[], Status];
}
