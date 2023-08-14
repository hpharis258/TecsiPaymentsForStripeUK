import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Alert,} from 'react-native';
import { Dimensions } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import {NavigatorContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//
var TerminalIDGlobal = "";
var APIKeyGlobal = "";

// Clear Reader
function ClearReaderScreen()
{
  var requestURL = "https://api.stripe.com/v1/terminal/readers/"+TerminalIDGlobal+"/cancel_action";
  fetch(requestURL, {
    method: 'POST',
    headers: {
      "Content-Type":"application/json",
      "Authorization": "Bearer " + APIKeyGlobal,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
  }).then((res) => {res.json()}).then((readerData) => {
    console.log("Payment Handed Off Successfully", readerData)
  }).catch((er) => {
    console.error("Error From Reader", er); 
  })
}
//
getLocalDataHome = async () => {
  try{
      const termminalID = await AsyncStorage.getItem("terminal_id")
      const APIKey = await AsyncStorage.getItem("API_Key")
      if(termminalID !== null)
      {
          //this.setState({TerminalID: termminalID})
          console.log("Terminal Id found", termminalID)
          TerminalIDGlobal = termminalID;
      }
      if(APIKey !== null)
      {
          //this.setState({APIKey: APIKey})
          console.log("Api Key Found ",APIKey)
          APIKeyGlobal = APIKey;
      }
      
  }catch(error)
  {
      console.log(error)
  }
}
// URL Encode Function
function URLEncodeRequest(data)
{
    var formBodyEncoded = [];
    for(var prop in data)
    {
    var encodedKey = encodeURIComponent(prop);
    var encodedValue = encodeURIComponent(data[prop])
    formBodyEncoded.push(encodedKey+"="+encodedValue);
    }
    formBodyEncoded = formBodyEncoded.join("&");
    return(formBodyEncoded);
}
// Create Payment Intent Passing in Encoded Amount and Currency
function CreatePaymentIntent(value, descriptionInput, CustomerEmail)
{
   // ADD Percentage
   let RawValue = value * 100;
   let valToUse = RawValue * 1.027;
    const data = {
        amount: valToUse,
        description: descriptionInput,
        receipt_email: CustomerEmail,
        currency: 'usd',
        "payment_method_types[]": ['card_present']
    }
   let formBodyEncoded = URLEncodeRequest(data);
   fetch("https://api.stripe.com/v1/payment_intents", {
    method: 'POST',
    headers: { 
      "Content-Type":"application/json",
      "Authorization": "Bearer " + APIKeyGlobal,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBodyEncoded
   }).then((response) => response.json()).then((data) => {
    console.log("Success:",data);
    if(data.error)
    {
      Alert.alert("Error " ,data.error.message)
    }
    else
    {
      Alert.alert("Success", "Payment Created Successfully!")
    }
    //alert(data.id)
    // Create Data
    const dataForHandingOffIntent = {
      payment_intent: data.id
  }
 let PaymentIDEncoded = URLEncodeRequest(dataForHandingOffIntent);
    // Hand Off Payment Intent to a reader
    
    let HandOffURL = "https://api.stripe.com/v1/terminal/readers/"+ TerminalIDGlobal +"/process_payment_intent"; 
    fetch(HandOffURL, {
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
        "Authorization": "Bearer " + APIKeyGlobal,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: PaymentIDEncoded
    }).then((res) => {res.json()}).then((readerData) => {
      //Alert.alert(readerData);
      console.log("Payment Handed Off Successfully", readerData)
    }).catch((er) => {
      Alert.alert("Error", er.error.message)
      console.error("Error From Reader", er); 
    })

   }).catch((error) => {
    console.error("Error:", error);
   })
}

function Home({navigation}){
    // Get Api Key and Terminal ID
    getLocalDataHome();
    const [localData, setLocalData] = useState(false);
    if(localData == false)
    {
      setLocalData(true);
    }
    //
    const [value, setValue] = React.useState(0);
    const [email, setEmail] = React.useState("");
    const [description, setDescription] = React.useState("");
    return (
        <View style={styles.container}>
           <Text style={styles.title} >Stripe Payments</Text>

        <Text style={styles.AmountLabel}>Amount</Text>
        <CurrencyInput
            value={value}
            onChangeValue={setValue}
            prefix="£"
            delimiter=","
            separator="."
            precision={2}
            fontSize={50}
            minValue={0}
            onChangeText={(formattedValue) => {
                console.log(value);
            }}
            
            />
            <Text style={styles.CustomerEmailStyle}>Customer Email</Text>
            <TextInput
             style={styles.CustomerEmailInputStyle} textContentType='emailAddress'
             value={email}
             onChangeValue={setEmail}
             onChangeText={(emailChangedValue) => {
              setEmail(emailChangedValue);
             }}
             placeholder='example@email.com'
            />
        <Text style={styles.DescriptionStyle}

         >Description</Text>
        <TextInput
          value={description}
          placeholder='payment description'
          //onChangeValue={setDescription}
          onChangeText={(desText) => {
            setDescription(desText);
          }}
          style={styles.DescriptionInput}
        >
        </TextInput>
        <Button
        style={styles.TakePaymentButton}
         onPress={ () => {CreatePaymentIntent(value, description, email)} }
        title='Take Payment'
         />
         <Button 
          color='orange'
          title="Clear Reader"
          onPress={() =>{
            ClearReaderScreen()
          }}
         />
        <Button
        color='red'
        title='Settings'
        onPress={() =>{
            navigation.navigate('Settings', {})
          }}
         />
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      opacity: 0.6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 35,
      marginBottom: 30,
      textAlign: 'center',
      opacity: 1
      
    },
    AmountLabel: {
      fontSize: 25,
      marginBottom: 0,
      textAlign: 'left'
    },
    DescriptionStyle:{
        fontSize: 30,
        marginBottom: 0,
        textAlign: 'left'
    }
    ,
    DescriptionInput: {
        fontSize: 20,
        width: 300,
        height: 80,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
        textAlign: 'center'
    },
    CustomerEmailStyle: {
        marginTop: 10,
        fontSize: 25,
        marginBottom: 0,
        textAlign: 'left'
    },
    CustomerEmailInputStyle: {
      fontSize: 20,
        width: 300,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
        textAlign: 'center'
    },
    TakePaymentButton: {
      width: 150,
      color:'white'
    }
  });

export default Home;