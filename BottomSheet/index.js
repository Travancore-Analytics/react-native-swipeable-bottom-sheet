import React from 'react';
import { 
    StyleSheet, 
    TouchableOpacity, 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    Keyboard } from 'react-native'; 

const SCREEN_HEIGHT = Dimensions.get("screen").height
const SCREEN_WIDTH = Dimensions.get("screen").width
export default class BottomSheet extends React.Component {
  
    constructor(props) {
        super(props);
        this.popUpHeight = this.props.height ? this.props.height : 200
        this.state = {
            popupPosition       : new Animated.Value(this.popUpHeight),
            mainViewAnimation   : new Animated.Value(0),
        };
        
        this.createPanResponder()
    }

    createPanResponder(){                                       //for detecting swipe on popup
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt,gestureState) => {
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 3);
            },
            onPanResponderMove: (event, gestureState) => {
                this.state.popupPosition.setValue(Math.max(0, 0 + gestureState.dy)); 
            },
            onPanResponderRelease: (e, gesture) => {
                const shouldOpen = gesture.vy <= 0;             //popup is opening or closing by swipe
                
                Animated.spring(this.state.popupPosition, {      //animate popup position w.r.t swipe value
                    toValue: shouldOpen ? 0 : this.popUpHeight,
                    velocity: gesture.vy,
                    tension: 2,
                    friction: 8,
                    useNativeDriver:true
                }).start();

                if(!shouldOpen) {
                    this.close()                                 //close popup if swiping down
                }
            },
            onPanResponderTerminate: (evt, gestureState) => false
        });
    }

    open = () => {
        Animated.spring(this.state.popupPosition, {            //animate popup position to slide up
            toValue: 0,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.mainViewAnimation, {      
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start(); 
    }

    close = () => {
        Keyboard.dismiss()

        Animated.spring(this.state.popupPosition, {         //animate popup position to slide down
            toValue: this.popUpHeight,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.mainViewAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    render() {
        const backdrop = {                                              //animates backDrop position & opacity
            transform: [{

                translateY: this.state.mainViewAnimation.interpolate({  
                    inputRange: [0, 0.01],
                    outputRange: [SCREEN_HEIGHT, 0],
                    extrapolate: "clamp",
                }),
            }],
            opacity: this.state.mainViewAnimation.interpolate({         
                inputRange: [0.01, 0.5],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        };

        const popUp = {
            transform: [{
                translateY: this.state.popupPosition
            }]
        }

        return (
            <Animated.View style = {[
                styles.backDropView,
                this.props.backDropStyle,
                backdrop]} 
            >
                <TouchableOpacity 
                    activeOpacity = {1} 
                    style ={[
                        styles.backDropTouchable,
                        ]} 
                    onPress={this.props.closeOnPressMask !== false ? this.close : null } 
                />

                <Animated.View
                    {...this.props.closeOnDragDown !== false ?  {...this.panResponder.panHandlers} : null}
                    style = {[
                        styles.subView,
                        this.props.sheetStyle,
                        {height:this.popUpHeight}, 
                        popUp
                    ]}
                > 
                    <View style={styles.topBarContainer}> 
                        <View style={[styles.topBar,this.props.topBarStyle]} />
                    </View>

                    {this.props.children}
                    
                </Animated.View>

            </Animated.View>
        );
    }
}


const styles            = StyleSheet.create({
    subView             : {
        position        : 'absolute',
        bottom          : 0,
        left            : 0,
        right           : 0,
        backgroundColor : 'white'
    },
    backDropView        : {
        backgroundColor : "rgba(0,0,0,.5)",
        zIndex          : 10,
        height          : SCREEN_HEIGHT,
        width           : SCREEN_WIDTH,
        position        : "absolute",
        top             : 0,
        bottom          : 0,
        left            : 0,
        right           : 0
    },
    backDropTouchable   : {
        height          : SCREEN_HEIGHT,
        width           : SCREEN_WIDTH,
        position        : "absolute",
        top             : 0,
        bottom          : 0,
        left            : 0,
        right           : 0
    },
    topBarContainer: {
        flexDirection   : 'column',
        justifyContent  : 'center',
        alignItems      : 'center',
    },
    topBar: {
        height          : 5,
        width           : 62,
        backgroundColor : '#D8D8D8',
        borderRadius    : 2.5,
        marginTop       : 8,
        marginBottom    : 8
    },

});