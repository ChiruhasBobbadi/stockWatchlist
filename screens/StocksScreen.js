import React, { useState, useEffect } from 'react';
import { StyleSheet, View,Text, ScrollView /* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({stocks:[]});
  const [selectedStock,setSelectedStock] = useState({selected:''});

  useEffect( () => {
    getData().then(data => {
      setState({stocks:data})
    })
  }, [watchList]);

  const percentChange = (stock) => {
    const close = stock.close
    const open = stock.open

    if(open > close)
      // percent decrease
      return -1*(Math.abs(open-close)/open)*100

    else if(open < close)
      // percent increase
      return (Math.abs(open-close)/open)*100

      else return 0
  }

  const fetchStockInfo = (symbol)=>{
    async function fetchData(symbol) {
      const selected = state.stocks.filter(obj=>obj.symbol===symbol);
      setSelectedStock({selected:selected[0]});
    }
    fetchData(symbol);
  }

  const getData = async () => {
    return Promise.all(watchList.map(async item => {
      let data = await fetch(`http://131.181.190.87:3001/history?symbol=${item}`);
      data = await data.json();
      return data[0]
    }));
  }

  const stockData = <View style={styles.stockData}>
    <Text style={{color: 'white',textAlign:'center',fontSize:18,marginTop:10}}>{selectedStock.selected.name}</Text>

    <View>
        <View style={{flex: 6, flexDirection: 'row',justifyContent:'space-between',marginTop:10,borderTopColor:'grey',borderTopWidth:0.5,padding:5}}>
          <View style={{width:70}}><Text style={{color: '#616161',textAlign: 'left'}}>OPEN</Text></View>
          <View style={{width:70}}><Text style={{color: 'white', textAlign: 'right'}}>{selectedStock.selected.open}</Text></View>
          <View style={{width:70}}><Text style={{color:'#616161',textAlign: 'left'}}>LOW</Text></View>
          <View style={{width:70}}><Text style={{color: 'white', textAlign: 'right'}}>{selectedStock.selected.low}</Text></View>
        </View>

        <View style={{flex: 6, flexDirection: 'row',justifyContent:'space-between', marginTop:20,borderTopColor:'white',borderTopWidth:0.5,padding:5}}>
          <View style={{width:70}}><Text style={{color: '#616161',textAlign: 'left'}}>CLOSE</Text></View>
          <View style={{width:70}}><Text style={{color: 'white', textAlign: 'right'}}> {selectedStock.selected.close}</Text></View>
          <View style={{width:70}}><Text style={{color:'#616161',textAlign: 'left'}}>HIGH</Text></View>
          <View style={{width:70}}><Text style={{color: 'white', textAlign: 'right'}}>{selectedStock.selected.high}</Text></View>
        </View>

        <View style={{flex: 6, flexDirection: 'row',justifyContent:'space-between', marginTop:20,borderTopColor:'white',borderTopWidth:0.5,padding:5}}>
          <View style={{width:65}}><Text style={{color: '#616161', textAlign: 'left'}}>VOLUME</Text></View>
          <View style={{width:75}}><Text style={{color: 'white', textAlign: 'right'}}> {selectedStock.selected.volumes}</Text></View>
          <View style={{width:65}}><Text style={{color:'#212121', textAlign: 'left'}}>VOLUME</Text></View>
          <View style={{width:75}}><Text style={{color:'#212121', textAlign: 'right'}} > {selectedStock.selected.volumes}</Text></View>
        </View>
    </View>
  </View>


  return (
    <View style={styles.container}>
      <View style={styles.stocks}>
      <ScrollView>
          {
           (state.stocks.map(stock=>

            <TouchableOpacity  style={{...styles.listitem,backgroundColor:selectedStock.selected===''||selectedStock.selected.symbol!==stock.symbol?'black':'#424242'}} key={stock.symbol}
            onPress={()=>fetchStockInfo(stock.symbol)}>

              <View style={{flex:6,flexDirection:'row',justifyContent:'space-around'}}>
                <Text  style={{...styles.stockItem,textAlign:"left"}}>{stock.symbol}
                </Text>
              </View>
              <View>
                <Text style={{...styles.stockItem,textAlign:"right", paddingRight:15}}>
                  {stock.close}
              </Text>
              </View>
              <View>
                <Text style={{...styles.stockItem,backgroundColor:percentChange(stock).toFixed(2)>0?'green':'red',borderRadius:10,padding:5, paddingLeft:25,textAlign:"right", width:100}}>
                  {percentChange(stock).toFixed(2)+" %"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
          }
      </ScrollView>
      </View>

          {
            selectedStock.selected!==''?(stockData):null
          }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
  },
  listitem: {
    padding: 10,
    borderBottomWidth:1,
    borderBottomColor:'grey',
    flex:6,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  stockItem:{
    fontSize:16,
    color:'white',
    textAlign:'center',
    width:'100%'
  },
  stockData: {
    backgroundColor:'#212121',
    width:'100%',
    height:'30%',
    position:'absolute',
    bottom:0
  },
  stocks: {
    height:'65%',
  }
  });