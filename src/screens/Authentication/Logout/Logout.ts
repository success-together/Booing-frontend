import React from 'react'
import { store } from '../../../shared'
import { disconnect } from '../../../shared/slices/Auth/AuthSlice'


export const Logout = ({navigation} : {navigation:any}) => {

    store.dispatch(disconnect())
    navigation.navigate("Login")
}