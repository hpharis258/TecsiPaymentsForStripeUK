import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';

class Settings extends Component {
    state = {
        TerminalID: "",
        APIKey: ""
    }
    //
    constructor(props){
        super(props);
        this.getLocalData();

    }
    onSubmit = async () => {
        try{
            await AsyncStorage.setItem("terminal_id", this.state.TerminalID);
            await AsyncStorage.setItem("API_Key", this.state.APIKey);
            Alert.alert("Saved", "your configuration has been ")
        }catch(error)
        {
            console.log(error)
        }
    }
    getLocalData = async () => {
        try{
            const termminalID = await AsyncStorage.getItem("terminal_id")
            const APIKey = await AsyncStorage.getItem("API_Key")
            if(termminalID !== null)
            {
                this.setState({TerminalID: termminalID})
                console.log(termminalID)
            }
            if(APIKey !== null)
            {
                this.setState({APIKey: APIKey})
                console.log(APIKey)
            }
            
        }catch(error)
        {
            console.log(error)
        }
    }
    render(){
        return(
            <View style={ProductsStyle.container}>
                    <Text style={ProductsStyle.title}>
                    Settings
                </Text>
                <Text style={ProductsStyle.terminalIDLabel}>
                    Terminal ID {() => {getLocalData()}}
                </Text>
                <TextInput 
                placeholder='Your Terminal ID' 
                style={ProductsStyle.terminalIDInput}
                value={this.state.TerminalID} 
                onChangeText={val => this.setState({TerminalID: val})}
                 ></TextInput>
                <Text style={ProductsStyle.APIKeyLabel}>
                    API Key
                </Text>
                <TextInput 
                placeholder='Secret KEY' 
                style={ProductsStyle.APIKeyInput}
                value={this.state.APIKey}
                onChangeText={val => this.setState({APIKey: val})}
                >
                </TextInput>
                <Button
                title='Save'
                onPress={this.onSubmit}
                    />
        </View>
        )
        }
}

const ProductsStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#405285',
        opacity: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 35,
        marginBottom: 50,
        textAlign: 'center' 
    }, 
    terminalIDLabel: {
        fontSize: 35,
        marginBottom: 50,
        textAlign: 'center' 
    },
    terminalIDInput: {
        fontSize: 20,
        width: 300,
        height: 100,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        textAlign: 'center'
    },
    APIKeyLabel: {
        fontSize: 35,
        marginBottom: 50,
        textAlign: 'center' 
    },
    APIKeyInput: {
        fontSize: 20,
        width: 300,
        height: 100,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        textAlign: 'center'
    },
    })

export default Settings;