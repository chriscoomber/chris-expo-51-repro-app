import { useMemo, useRef } from 'react';
import {  Text, View, Animated, PanResponder } from "react-native";
import { Svg, Rect } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import RNRAnimated, { useSharedValue, useAnimatedProps, useAnimatedStyle} from 'react-native-reanimated'

const RNRAnimatedRect = RNRAnimated.createAnimatedComponent(Rect)
const AnimatedRect = Animated.createAnimatedComponent(Rect)

export default function Index() {
  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan}]),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  const RNTest = <View style={{borderWidth: 1}}>
    <Text>With RN... though this isn't ideal because it lets you drag the yellow region</Text>

    <Animated.View {...panResponder.panHandlers}>
      <Svg width={200} height={100} >
        <Rect width={200} height={100} fill='yellow'/>
        <AnimatedRect width={100} height={100} x={pan} y={0} fill='red'/>
      </Svg>
    </Animated.View>
  </View>

  const x = useSharedValue(0)
  const animatedX = useAnimatedProps(() => ({x: x.value}), [x]);
  const animatedLeft = useAnimatedStyle(() => ({left: x.value}), [x])
  const xStart = useSharedValue(0);
  const svgPanGesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin(() => {xStart.value = x.value})
      .onChange((e) => {
        x.value = xStart.value + e.translationX
      })
  }, [])

  const RNGHTest = <View style={{borderWidth: 1}}>
    <Text>With RNGH and RNR</Text>

    <View style={{width: 200, height: 100}}>
      <Svg width={200} height={100}>
        <Rect width={200} height={100} fill='yellow'/>
        <RNRAnimatedRect width={100} height={100} animatedProps={animatedX} y={0} fill='red' />
      </Svg>
      <GestureDetector gesture={svgPanGesture}>
        <RNRAnimated.View style={[{position: 'absolute', width: 100, height: 100}, animatedLeft]}/>
      </GestureDetector>
    </View>
  </View>

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      {RNTest}
      {RNGHTest}
    </View>
    </GestureHandlerRootView>
  );
}
