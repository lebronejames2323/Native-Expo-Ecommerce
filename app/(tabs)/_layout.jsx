import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const pages = [
  {
    page:"index",
    title:"Home",
    icon:"home",
  },
  {
    page:"products",
    title:"Products",
    icon:"shopping",
  },
  {
    page:"cart",
    title:"Cart",
    icon:"cart",
  },
  {
    page:"about",
    title:"Me",
    icon:"account-box",
  },
]

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Tabs screenOptions={{headerShown: false}}>
      {
        pages.map((item,index)=>(
          <Tabs.Screen
          key={item.page + index}
          name={item.page}
          options={{
            title: item.title,
            headerTitleAlign: 'center',
            tabBarIcon: ({color}) => <MaterialIcons size={25} name={item.icon} color={color}/>,
            tabBarShowLabel: pages.length > 5 ? false : true 
          }}
          />
        ))
      }
    </Tabs>
    </GestureHandlerRootView>
  )
}
