import React from 'react';
import { 
    StyleSheet, 
    TouchableOpacity, 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    Keyboard,
    BackHandler 
} from 'react-native'; 

const SCREEN_HEIGHT = Dimensions.get("screen").height
const SCREEN_WIDTH = Dimensions.get("screen").width
export default class BottomSheet extends React.Component {
  
    constructor(props) {
        super(props);
        this.popUpHeight = this.props.height ? this.props.height : 200
        this.state = {
            popupPosition       : new Animated.Value(this.popUpHeight),
            mainViewAnimation   : new Animated.Value(0),
            popUpOpen           : false                                
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        
        this.createPanResponder()
    }

    handleBackButtonClick() {
        if(this.props.closeOnHardwareBack){
            this.close()
            return true;
        }
        return false;
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
                const shouldOpen = ( gesture.vy < 0.8 && gesture.dy < (this.popUpHeight * 0.45 ));             //popup is opening or closing by swipe.(decision based on swiping speed and siped distance)
                Animated.spring(this.state.popupPosition, {      //animate popup position w.r.t swipe value
                    toValue: shouldOpen ? 0 : this.popUpHeight,
                    velocity: gesture.vy,
                    tension: 80,
                    friction: 20,
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
        this.setState({popUpOpen:true})
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        if(this.props.onOpen){
            this.props.onOpen()
        }
        Animated.timing(this.state.popupPosition, {            //animate popup position to slide up
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.mainViewAnimation, {      
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start(); 
    }

    close = () => {
        Keyboard.dismiss()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        if(this.props.onClose){
            this.props.onClose()
        }

        Animated.timing(this.state.popupPosition, {         //animate popup position to slide down
            toValue: this.popUpHeight,
            duration:250,
            useNativeDriver: true
        }).start(
            ()=>{
                this.setState({popUpOpen : false})
            }
        );

        Animated.timing(this.state.mainViewAnimation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }

    renderTopBar(){
        if(!this.props.hideTopBar){
            return(
                <View style={styles.topBarContainer}> 
                    <View style={[styles.topBar,this.props.topBarStyle]} />
                </View>
            )
        }
    }

    renderChildren(){
        if(this.props.persistContents){
           return this.props.children 
        }
        else{
            return(
                this.state.popUpOpen ?                     //unmount component on close
                        this.props.children                     
                :
                null
            )
        }
    }

    render() {
        const backdrop = {                                              //animates backDrop position & opacity
            transform: [{

                translateY: this.state.mainViewAnimation.interpolate({  
                    inputRange: [0, 0.01],
                    outputRange: [SCREEN_HEIGHT, 0],
                    extrapolate: "clamp",
                }),
            }]
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
                    {this.renderTopBar()}

                    {this.renderChildren()}
                    
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