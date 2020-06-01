# react-native-swipeable-bottom-sheet


- Highly customisable Bottom sheet
- Add Your own Component To Bottom Sheet
- Support Drag Down Gesture
- Support Both Android And iOS
- Smooth Animation
- Zero Configuration
- Zero dependency


## Installation

```
npm i react-native-swipeable-bottom-sheet --save
```

### or

```
yarn add react-native-swipeable-bottom-sheet
```

## Example

#### Class component

```jsx
import React from 'react';
import { StyleSheet,Dimensions,Text } from 'react-native';
import BottomSheet from "react-native-swipeable-bottom-sheet"

export default class BottomSwipeView extends React.Component {
    constructor(props){
        super(props)
    }

    openPopUp(){
        this.bottomSheet.open()
    }

    render() {
        return(
            <BottomSheet
                ref = {ref => this.bottomSheet = ref}
                height = {400}
                closeOnDragDown = {true}
                closeOnPressMask = {true}
                topBarStyle = {styles.topBarStyle}
                backDropStyle = {{elevation:5}}
                sheetStyle = {{borderRadius:50}}
            >
                <Text> react-native-swipeable-bottom-sheet </Text>

            </BottomSheet>
        )
    }
}

const styles                    = StyleSheet.create({
    topBarStyle                 : {
        width                   : 50,
        height                  : 5,
        borderRadius            : 2.5,
        backgroundColor         : "#000000"
    }
})

```


## Props

| Props            | Type     | Description                                             | Default  |
| ---------------- | -------- | ------------------------------------------------------- | -------- |
| height           | number   | Height of Bottom Sheet                                  | 200      |
| closeOnDragDown  | boolean  | Use gesture drag down to close Bottom Sheet             | true    |
| closeOnPressMask | boolean  | Press the area outside to close Bottom Sheet            | true     |
| topBarStyle     | object   | Custom style to topBar of Bottom Sheet                            | {}       |
| backDropStyle     | object   | Custom style to backDropView of Bottom Sheet                            | {}       |
| sheetStyle     | object   | Custom style to Bottom Sheet                            | {}       |




## Methods

| Method Name | Description        |
| ----------- | ------------------ |
| open        | Open Bottom Sheet  |
| close       | Close Bottom Sheet |

## Note

- If you have used elevation property (android) in your code, then you may need to set same elevation value to the backDropView of bottomSheet. 

## License

This project is licensed under the GNU General Public License v3.0

## Author

Made by [Travancore Analytics](https://github.com/Travancore-Analytics).
