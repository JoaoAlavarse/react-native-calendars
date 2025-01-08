import includes from 'lodash/includes';
import XDate from 'xdate';
import React, { Fragment, useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { ActivityIndicator, Platform, View, Text, TouchableOpacity, Image } from 'react-native';
import { formatNumbers, weekDayNames } from '../../dateutils';
import styleConstructor from './style';
const accessibilityActions = [
    { name: 'increment', label: 'increment' },
    { name: 'decrement', label: 'decrement' }
];
const CalendarHeader = forwardRef((props, ref) => {
    const { theme, style: propsStyle, addMonth: propsAddMonth,  addYear: propsAddYear , enableYear, month, monthFormat, firstDay, hideDayNames, showWeekNumbers, hideArrows, renderArrow, onPressArrowLeft, onLongPressArrowLeft, onLongPressArrowRight, onPressArrowRight, arrowsHitSlop = 20, disableArrowLeft, disableArrowRight, disabledDaysIndexes, displayLoadingIndicator, customHeaderTitle, renderHeader, webAriaLevel, testID, accessibilityElementsHidden, importantForAccessibility, numberOfDays, current = '', timelineLeftInset } = props;
const stopRepeating = () => {}
    const numberOfDaysCondition = useMemo(() => {
        return numberOfDays && numberOfDays > 1;
    }, [numberOfDays]);
    const style = useRef(styleConstructor(theme));
    const headerStyle = useMemo(() => {
        return [style.current.header, numberOfDaysCondition ? style.current.partialHeader : undefined];
    }, [numberOfDaysCondition]);
    const partialWeekStyle = useMemo(() => {
        return [style.current.partialWeek, { paddingLeft: timelineLeftInset }];
    }, [timelineLeftInset]);
    const dayNamesStyle = useMemo(() => {
        return [style.current.week, numberOfDaysCondition ? partialWeekStyle : undefined];
    }, [numberOfDaysCondition, partialWeekStyle]);
    const hitSlop = useMemo(() => typeof arrowsHitSlop === 'number'
        ? { top: arrowsHitSlop, left: arrowsHitSlop, bottom: arrowsHitSlop, right: arrowsHitSlop }
        : arrowsHitSlop, [arrowsHitSlop]);
    useImperativeHandle(ref, () => ({
        onPressLeft,
        onPressRight
    }));
    const addMonth = useCallback(() => {
        
        propsAddMonth?.(1);
    }, [propsAddMonth]);
    const subtractMonth = useCallback(() => {
        propsAddMonth?.(-1);
    }, [propsAddMonth]);

    const addYear = useCallback(() => {
        propsAddYear?.(1);
    }, [propsAddYear]);
    const subtractYear = useCallback(() => {
        propsAddYear?.(-1);
    }, [propsAddYear]);
    const onPressLeft = useCallback(() => {
        if (typeof onPressArrowLeft === 'function') {
            return onPressArrowLeft(subtractMonth, month);
        }
        return subtractMonth();
    }, [onPressArrowLeft, subtractMonth, month]);
    const onLongPressLeft = useCallback(() => {
        const [startRepeating, stopRepeating] = useRepeatOnLongPress(() => {
            if (typeof onLongPressArrowLeft === 'function') {
                onLongPressArrowLeft(subtractYear, month);
            } else {
                subtractYear();
            }
        });
    
        return startRepeating;
    }, [onLongPressArrowLeft, subtractYear, month]);
    const onLongPressRight = useCallback(() => {
        const [startRepeating, stopRepeating] = useRepeatOnLongPress(() => {
            if (typeof onLongPressArrowRight === 'function') {
                onLongPressArrowRight(addYear, month);
            } else {
                addYear();
            }
        });
    
        return startRepeating;
    }, [onLongPressArrowRight, addYear, month]);
    const onPressRight = useCallback(() => {
        if (typeof onPressArrowRight === 'function') {
            return onPressArrowRight(addMonth, month);
        }
        return addMonth();
    }, [onPressArrowRight, addMonth, month]);
    const onAccessibilityAction = useCallback((event) => {
        switch (event.nativeEvent.actionName) {
            case 'decrement':
                onPressLeft();
                break;
            case 'increment':
                onPressRight();
                break;
            default:
                break;
        }
    }, [onPressLeft, onPressRight]);
    const useRepeatOnLongPress = (callback, delay = 200) => {
        const intervalId = useRef(null);
    
        const startRepeating = useCallback(() => {
            if (!intervalId.current) {
                intervalId.current = setInterval(callback, delay);
            }
        }, [callback, delay]);
    
        const stopRepeating = useCallback(() => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }, []);
    
        return [startRepeating, stopRepeating];
    };
    const onRelease = useCallback(() => {
        stopRepeating();
    }, [stopRepeating]);
    const renderWeekDays = useMemo(() => {
        const dayOfTheWeek = new XDate(current).getDay();
        const weekDaysNames = numberOfDaysCondition ? weekDayNames(dayOfTheWeek) : weekDayNames(firstDay);
        const dayNames = numberOfDaysCondition ? weekDaysNames.slice(0, numberOfDays) : weekDaysNames;
        return dayNames.map((day, index) => {
            const dayStyle = [style.current.dayHeader];
            if (includes(disabledDaysIndexes, index)) {
                dayStyle.push(style.current.disabledDayHeader);
            }
            const dayTextAtIndex = `dayTextAtIndex${index}`;
            if (style.current[dayTextAtIndex]) {
                dayStyle.push(style.current[dayTextAtIndex]);
            }
            return (<Text allowFontScaling={false} key={index} style={dayStyle} numberOfLines={1} accessibilityLabel={''}>
          {day}
        </Text>);
        });
    }, [firstDay, current, numberOfDaysCondition, numberOfDays, disabledDaysIndexes]);
    const _renderHeader = () => {
        const webProps = Platform.OS === 'web' ? { 'aria-level': webAriaLevel } : {};
        if (renderHeader) {
            return renderHeader(month);
        }
        if (customHeaderTitle) {
            return customHeaderTitle;
        }
        let monthFormatted = formatNumbers(month?.toString(monthFormat))
        let monthWithoutYear = monthFormatted.split(" ")[0]
        return (<Fragment>
        <Text allowFontScaling={false} style={[style.current.monthText, { marginBottom: -0 ,position: "relative", right: 10}]} testID={`${testID}.title`} {...webProps}>
          { enableYear ? monthFormatted :monthWithoutYear}
        </Text>
      </Fragment>);
    };
    const _renderArrow = (direction) => {
        if (hideArrows) {
            return <View />;
        }
        const isLeft = direction === 'left';
        const arrowId = isLeft ? 'leftArrow' : 'rightArrow';
        const shouldDisable = isLeft ? disableArrowLeft : disableArrowRight;
        const onPress = !shouldDisable ? isLeft ? onPressLeft : onPressRight : undefined;
        const onLongPress = !shouldDisable ? isLeft ? onLongPressLeft : onLongPressRight : undefined;
        const imageSource = isLeft ? require('../img/previous.png') : require('../img/next.png');
        const renderArrowDirection = isLeft ? 'left' : 'right';
        return (<TouchableOpacity  onPress={onPress} onLongPress={onLongPress} onPressOut={onRelease} disabled={shouldDisable} style={style.current.arrow} hitSlop={hitSlop} testID={`${testID}.${arrowId}`}>
        {renderArrow ? (renderArrow(renderArrowDirection)) : (<Image source={imageSource} style={shouldDisable ? style.current.disabledArrowImage : style.current.arrowImage}/>)}
      </TouchableOpacity>);
    };
    const renderIndicator = () => {
        if (displayLoadingIndicator) {
            return (<ActivityIndicator color={theme?.indicatorColor} testID={`${testID}.loader`}/>);
        }
    };
    const renderWeekNumbersSpace = () => {
        return showWeekNumbers && <View style={style.current.dayHeader}/>;
    };
    const renderDayNames = () => {
        if (!hideDayNames) {
            return (<View style={dayNamesStyle} testID={`${testID}.dayNames`}>
          {renderWeekNumbersSpace()}
          {renderWeekDays}
        </View>);
        }
    };
    return (<View testID={testID} style={propsStyle} accessible accessibilityRole={'adjustable'} accessibilityActions={accessibilityActions} onAccessibilityAction={onAccessibilityAction} accessibilityElementsHidden={accessibilityElementsHidden} // iOS
     importantForAccessibility={importantForAccessibility} // Android
    >
      <View style={[headerStyle, {marginTop: -5}]}>
        {_renderArrow('left')}
        <View style={style.current.headerContainer}>
          {_renderHeader()}
          {renderIndicator()}
        </View>
        {_renderArrow('right')}
      </View>
      {renderDayNames()}
    </View>);
});
export default CalendarHeader;
CalendarHeader.displayName = 'CalendarHeader';
CalendarHeader.defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1,
    arrowsHitSlop: 20
};
