import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Keyboard,TextInput,FlatList, ScrollView /* include other react native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function SearchScreen({ navigation }) {

  const { ServerURL, addToWatchlist,watchList } = useStocksContext();
  const [stockState,changeStockState] = useState({});
  const [searchState,changeSearchState] = useState();
  const [error,setError]= useState(false);

  useEffect( () => {
    async function fetchData() {
      try{
      let data = await fetch("http://131.181.190.87:3001/all");
      data = await data.json();
      changeStockState({stocks:data,replica:data,allStocks:data});
      }
      catch(e){
        setError(true)
      }
    }
    fetchData();
  }, []);

  const addStock = (data) => {
    const filtered = watchList.filter(obj=>obj===data.symbol);

    if(filtered.length===0)
       addToWatchlist(data.symbol);
    navigation.navigate('Stocks');
  }

  const updateText = (ev)=>{
    if(ev.length>=1) {
      changeSearchState(true);
    const current  = stockState.allStocks;
    const filtered = current.filter(stockObj=>(stockObj.symbol.includes(ev.toUpperCase())||stockObj.name.toUpperCase().includes(ev.toUpperCase())))
    changeStockState({...stockState,stocks:filtered})
    }
    else if(ev===''){
      changeSearchState(false);
      const allStocks = stockState.allStocks;
      changeStockState({...stockState,stocks:allStocks});
    }
  }

  const scroll= <ScrollView style={{marginTop:20}}>
  {
    searchState? (stockState.stocks.map(item=><TouchableOpacity style={styles.listitem} key={item.symbol}
       onPress={()=>addStock(item)}>
        <Text style={{color:'white',textAlign:'left'}}>{item.symbol} </Text>
        <Text style={{fontSize:11,color:'white',textAlign:'left',paddingBottom:15}}>{item.name}</Text>
        </TouchableOpacity>)):null
  }
  </ScrollView>

  const hasError = <Text style={{color:'white',fontSize:20,marginTop:20,textAlign:'center'}}>Not connected to Internet or QUT VPN</Text>

  return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={{color:'white',textAlign:"center",fontSize:11}}>
          Type a company name or a stock symbol:
          </Text>
          <View style={{flex:1, flexDirection:'row',justifyContent:'flex-start',alignItems:'center', marginTop:25}}>

          <Ionicons style={styles.searchIcon} name="md-search" size={20} color="#fff"/>
          <TextInput placeholder="Search"
          placeholderTextColor='white'
          onChangeText={updateText}
          style={styles.input}
          />
          </View>
        </View>
        {error||!stockState.stocks?hasError:scroll}
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
   width:'100%'
  },
  input: {
    width:'100%',
    height:40,
    padding: 5,
    marginBottom:3,
    backgroundColor: '#212121',
    color:'white',
  },
  searchIcon: {
    padding: 10,
    marginBottom:3,
    backgroundColor: '#212121',
    color:'white',
  },
  listitem: {
    width:'100%',
    color:'white',
    margin: 5,
    borderBottomWidth:1,
    borderBottomColor:'#212121',
    backgroundColor:'black'
  },
  topContainer: {
    backgroundColor: '#121212',
    width: '100%'
  }
});