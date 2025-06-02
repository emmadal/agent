import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type ConfettiProps = {
  children: React.ReactNode;
  trigger?: boolean;
  count?: number;
  origin?: { x: number; y: number };
  fadeOut?: boolean;
  explosionSpeed?: number;
  fallSpeed?: number;
  colors?: string[];
  style?: StyleProp<ViewStyle>;
};

/**
 * A component that wraps content and displays a confetti animation.
 *
 * @param children - The content to be wrapped.
 * @param trigger - Boolean value that triggers the confetti animation when changed to true.
 * @param count - The number of confetti pieces.
 * @param origin - The origin point of the explosion.
 * @param fadeOut - Whether the confetti should fade out.
 * @param explosionSpeed - The speed of the initial explosion.
 * @param fallSpeed - The speed at which confetti falls.
 * @param colors - Custom colors for the confetti pieces.
 */
const Confetti: React.FC<ConfettiProps> = ({
  children,
  trigger = false,
  count = 80, // Reduced count for better performance
  origin,
  fadeOut = true,
  explosionSpeed = 250, // Faster explosion for better performance
  fallSpeed = 2000, // Faster fall for better performance
  colors = [
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#008000",
    "#0000ff",
    "#4b0082",
    "#ee82ee",
  ],
  style,
}) => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Define functions with useCallback to prevent recreation on each render
  const shoot = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  }, []);

  const stopContinuousAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startContinuousAnimation = useCallback(() => {
    // Clear any existing interval
    stopContinuousAnimation();
    
    // Shoot once immediately
    shoot();
    
    // Then setup interval to continue shooting
    intervalRef.current = setInterval(() => {
      shoot();
    }, 3000); // Shoot every 3 seconds - adjust as needed
  }, [shoot, stopContinuousAnimation]);

  useEffect(() => {
    // Start continuous animation when trigger becomes true
    if (trigger && dimensions.width > 0) {
      startContinuousAnimation();
    } else {
      // Stop animation when trigger becomes false
      stopContinuousAnimation();
    }

    // Cleanup on unmount
    return () => {
      stopContinuousAnimation();
    };
  }, [trigger, dimensions, stopContinuousAnimation, startContinuousAnimation]);


  return (
    <View
      style={[styles.container, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      {children}
      {dimensions.width > 0 && (
        <ConfettiCannon
          ref={confettiRef}
          count={count}
          origin={origin || { x: dimensions.width / 2, y: 0 }}
          fadeOut={fadeOut}
          autoStart={false}
          explosionSpeed={explosionSpeed}
          fallSpeed={fallSpeed}
          colors={colors}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Confetti;
