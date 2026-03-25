import React, { useMemo, useState } from "react";
import { Image } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import BioGameScreen from "./src/screens/BioGameScreen";
import JournalCoverScreen from "./src/screens/JournalCoverScreen";
import JournalWriteScreen from "./src/screens/JournalWriteScreen";
import theme from "./src/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const journalTabIcon = require("./assets/journal-cover.jpg");

function JournalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.salmonPink },
        headerTintColor: theme.palePink,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="JournalCover"
        component={JournalCoverScreen}
        options={{ title: "Journal" }}
      />
      <Stack.Screen
        name="JournalWrite"
        component={JournalWriteScreen}
        options={{ title: "Write" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.classicPink,
        card: theme.salmonPink,
        primary: theme.salmonPink,
        text: theme.palePink,
        border: theme.cherryBlossom,
      },
    }),
    []
  );

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: theme.salmonPink },
          headerTintColor: theme.palePink,
          headerTitleStyle: { fontWeight: "700" },
          tabBarStyle: { backgroundColor: theme.salmonPink, borderTopColor: theme.cherryBlossom },
          tabBarActiveTintColor: theme.palePink,
          tabBarInactiveTintColor: theme.lightPink,
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Journal") {
              return (
                <Image
                  source={journalTabIcon}
                  style={{
                    width: size + 4,
                    height: size + 4,
                    borderRadius: 4,
                    opacity: color === theme.palePink ? 1 : 0.75,
                  }}
                />
              );
            }
            const iconMap = {
              Home: "home",
              Calendar: "calendar-today",
              "Mini Game": "face-retouching-natural",
            };
            return <MaterialIcons name={iconMap[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Mini Game" component={BioGameScreen} />
        <Tab.Screen
          name="Journal"
          component={JournalStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
