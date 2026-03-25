import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import theme from "../theme";

export default function PinkBackground({ image, children, overlay = true }) {
  if (image) {
    return (
      <ImageBackground source={image} style={styles.full} resizeMode="cover">
        {overlay ? <View style={styles.overlay} /> : null}
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    );
  }

  return <View style={[styles.full, styles.fallback]}>{children}</View>;
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(227,122,156,0.22)",
  },
  content: { flex: 1 },
  fallback: { backgroundColor: theme.classicPink },
});
