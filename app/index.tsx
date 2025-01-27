import { useMemo, useState } from 'react';
import { Button, Text, View } from "react-native";
import { Svg, Rect } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {runOnJS} from 'react-native-reanimated'

/** Workaround for https://github.com/software-mansion/react-native-svg/issues/1484 only. */
class RectWorkaround extends Rect {
  public override render() {
    const newProps = {
      ...this.props,
      collapsable: undefined
    };
    return <Rect {...newProps} />;
  }
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedRect = Animated.createAnimatedComponent(RectWorkaround);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function Index() {
  const [viewClicked, setViewClicked] = useState(false)
  const viewTapGesture = useMemo(() => {
    return Gesture.Tap().onEnd((_e, success) => {
      if (success) runOnJS(setViewClicked)(true);
    })
  }, [])

  const [svgClicked, setSvgClicked] = useState(false)
  const svgTapGesture = useMemo(() => {
    return Gesture.Tap().onEnd((_e, success) => {
      if (success) runOnJS(setSvgClicked)(true);
    })
  }, [])

  const [isAnimatedSvg, setAnimatedSvg] = useState(false)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>View Clicked? {viewClicked ? 'yes' : 'no'}</Text>
      <GestureDetector gesture={viewTapGesture}>
        <Animated.View style={{width: 100, height: 100, backgroundColor: 'black'}}/>
      </GestureDetector>

      <Text>Svg Clicked? {svgClicked ? 'yes' : 'no'}</Text>
      {isAnimatedSvg ? 
        <GestureDetector gesture={svgTapGesture}>
          <Svg width={200} height={100}>
            <Rect width={100} height={100} x={50} y={0} fill='black' />
          </Svg>
        </GestureDetector>
      : <GestureDetector gesture={svgTapGesture}>
          <AnimatedSvg width={200} height={100}>
            <Rect width={100} height={100} x={50} y={0} fill='black' />
          </AnimatedSvg>
        </GestureDetector>
      }

      <Button 
        title={`toggle animated SVG (causes a crash): ${isAnimatedSvg ? 'yes' : 'no'}`} 
        onPress={() => setAnimatedSvg(old => !old)}
        />
    </View>
    </GestureHandlerRootView>
  );
}
