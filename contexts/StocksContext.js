import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const [toUpdate,update] = useState(true);

  function addToWatchlist(newSymbol) {

    const update = async (newData) => {
      try {
        await AsyncStorage.setItem("stockSymbol", JSON.stringify(newData));
        setState(newData);
      } catch {
        alert("There was an error saving.");
      }
    };

    const data = [...state,newSymbol];
    update(data);
  }


  async function loadFromDisk() {
    try {
      const dataFromDisk = await AsyncStorage.getItem("stockSymbol");
      if (dataFromDisk != null) setState(JSON.parse(dataFromDisk));
    } catch {
      alert("Disk corrupted");
    }
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    loadFromDisk();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
