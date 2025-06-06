import { Stack } from 'expo-router'
import React from 'react'



function FavouriteLayout() {
    
  return (
    <Stack
        screenOptions={{
            
        }}
    >
        <Stack.Screen
            name='index'
            options={{
                title: "My Favourites",
                headerTitleAlign: "center"

            }}
        />
        <Stack.Screen
            name='wow'
            options={({ route }) => ({
                // title: route.params?.category
                //     ? `Category: ${route.params.category}`
                //     : "Category"
            })}
        />
    </Stack>
  )
}

export default FavouriteLayout


