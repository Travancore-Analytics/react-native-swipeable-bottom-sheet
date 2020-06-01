import BottomSheet from "./BottomSheet"
import PropTypes from 'prop-types'
import {ViewPropTypes} from "react-native"
BottomSheet.propTypes = {
    height = PropTypes.number,
    closeOnDragDown = PropTypes.bool,
    closeOnPressMask = PropTypes.bool,
    topBarStyle = ViewPropTypes.style,
    backDropStyle = ViewPropTypes.style,
    sheetStyle = ViewPropTypes.style
}
export default BottomSheet
