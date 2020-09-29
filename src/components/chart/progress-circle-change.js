import React, {PureComponent} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import * as shape from 'd3-shape';
import Path from './animated-path';
import Svg, {G} from 'react-native-svg';

import {countFormat} from '../../../helpers';

class ProgressCircle extends PureComponent {
  state = {
    height: 0,
    width: 0,
  };

  _onLayout(event) {
    const {
      nativeEvent: {
        layout: {height, width},
      },
    } = event;
    // const format = countFormat();
    // const {scale, circleSize, isIOS} = format;
    // this.setState({
    //   height: isIOS ? scale(circleSize) : scale(circleSize) + 1,
    //   width: isIOS ? scale(circleSize) : scale(circleSize) + 1,
    // });
    this.setState({
      height,
      width,
    });
  }

  render() {
    const {
      style,
      progressColor,
      backgroundColor,
      strokeWidth,
      startAngle,
      endAngle,
      animate,
      animateDuration,
      children,
      cornerRadius,
      progressChange,
      secondColor,
      redColor,
      redValue,
    } = this.props;
    const format = countFormat();

    let {progress} = this.props;

    const {height, width} = this.state;

    const outerDiameter = Math.min(width, height);

    if (!isFinite(progress) || isNaN(progress)) {
      progress = 0;
    }

    const redData = [
      {
        key: 'rest',
        value: 1 - redValue,
        color: 'rgba(0,0,0,0)',
      },
      {
        key: 'red',
        value: redValue,
        color: redColor,
      },
    ];

    // important order to have progress render over "rest"
    const data = [
      {
        key: 'rest',
        value: 1 - progress - progressChange,
        color: backgroundColor,
      },
      {
        key: 'second2',
        value: progressChange / 2,
        color: secondColor,
      },
      {
        key: 'second1',
        value: progressChange / 2,
        color: secondColor,
      },
      // {
      //   key: "whiteLine",
      //   value: 0.0001,
      //   color: "white",
      // },
      {
        key: 'progress2',
        value: progress / 2,
        color: progressColor,
      },
      {
        key: 'progress1',
        value: progress / 2,
        color: progressColor,
      },
    ];

    const pieSlicesRed = shape
      .pie()
      .value((d) => d.value)
      .sort((a) => (a.key === 'rest' ? 1 : -1))
      .startAngle(startAngle)
      .endAngle(endAngle)(redData);

    const arcsRed = pieSlicesRed.map((slice, index) => ({
      ...redData[index],
      ...slice,
      path: shape
        .arc()
        .outerRadius(outerDiameter / 2) // Radius of the pie
        .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
        .startAngle(index === 0 ? startAngle : slice.startAngle)
        .endAngle(index === 0 ? endAngle : slice.endAngle)
        .cornerRadius(cornerRadius)(),
    }));

    const pieSlices = shape
      .pie()
      .value((d) => d.value)
      .sort((a) => (a.key === 'rest' ? 1 : -1))
      .startAngle(startAngle)
      .endAngle(endAngle)(data);

    const arcs = pieSlices.map((slice, index) => {
      // if (data[index].key === "whiteLine") {
      //   whiteLine = {
      //     ...data[index],
      //     ...slice,
      //     path: shape
      //       .arc()
      //       .outerRadius(outerDiameter / 2) // Radius of the pie
      //       .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
      //       .startAngle(slice.startAngle - 0.03)
      //       .endAngle(slice.endAngle + 0.03)
      //       .cornerRadius(0)(),
      //   };
      // }
      if (data[index].key === 'progress1') {
        return {
          ...data[index],
          ...slice,
          path: shape
            .arc()
            .outerRadius(outerDiameter / 2) // Radius of the pie
            .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
            .startAngle(index === 0 ? startAngle : slice.startAngle)
            .endAngle(index === 0 ? endAngle : slice.endAngle)
            .cornerRadius(cornerRadius)(),
        };
      }
      if (data[index].key === 'second2') {
        return {
          ...data[index],
          ...slice,
          path: shape
            .arc()
            .outerRadius(outerDiameter / 2) // Radius of the pie
            .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
            .startAngle(
              index === 0
                ? startAngle
                : slice.startAngle - (progressChange == 0 ? 0 : 0.08),
            )
            .endAngle(index === 0 ? endAngle : slice.endAngle)
            .cornerRadius(cornerRadius)(),
        };
      }
      if (data[index].key === 'progress2') {
        return {
          ...data[index],
          ...slice,
          path: shape
            .arc()
            .outerRadius(outerDiameter / 2) // Radius of the pie
            .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
            .startAngle(
              index === 0
                ? startAngle
                : slice.startAngle - (progress == 0 ? 0 : 0.05),
            )
            .endAngle(index === 0 ? endAngle : slice.endAngle)(),
        };
      }
      return {
        ...data[index],
        ...slice,
        path: shape
          .arc()
          .outerRadius(outerDiameter / 2) // Radius of the pie
          .innerRadius(outerDiameter / 2 - strokeWidth) // Inner radius: to create a donut or pie
          .startAngle(index === 0 ? startAngle : slice.startAngle)
          .padAngle(0.03)
          .endAngle(index === 0 ? endAngle : slice.endAngle)(),
      };
    });

    const extraProps = {
      width,
      height,
    };
    return [
      <View
        style={style}
        onLayout={(event) => this._onLayout(event)}
        key="mainChart">
        {height > 0 && width > 0 && (
          <Svg style={{height: height + 2, width: width + 2}}>
            {/* center the progress circle*/}

            <G x={width / 2} y={height / 2}>
              {React.Children.map(children, (child) => {
                if (child && child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
              {arcs.map((shape, index) => {
                return (
                  <Path
                    key={index}
                    fill={shape.color}
                    d={shape.path}
                    animate={animate}
                    animationDuration={animateDuration}
                  />
                );
              })}

              {/* <Path
                key={'whiteLine'}
                fill={whiteLine.color}
                d={whiteLine.path}
                animate={animate}
                animationDuration={animateDuration}
              /> */}
              {React.Children.map(children, (child) => {
                if (child && !child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
            </G>
          </Svg>
        )}
      </View>,
      <View
        style={{...style, marginTop: -height}}
        onLayout={(event) => this._onLayout(event)}
        key="redChart">
        {height > 0 && width > 0 && (
          <Svg style={{height: height + 2, width: width + 2}}>
            {/* center the progress circle*/}

            <G x={width / 2} y={height / 2}>
              {React.Children.map(children, (child) => {
                if (child && child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
              {arcsRed.map((shape, index) => {
                return (
                  <Path
                    key={index}
                    fill={shape.color}
                    d={shape.path}
                    animate={animate}
                    animationDuration={animateDuration}
                  />
                );
              })}

              {/* <Path
               key={'whiteLine'}
               fill={whiteLine.color}
               d={whiteLine.path}
               animate={animate}
               animationDuration={animateDuration}
             /> */}
              {React.Children.map(children, (child) => {
                if (child && !child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
            </G>
          </Svg>
        )}
      </View>,
    ];
  }
}

ProgressCircle.propTypes = {
  progress: PropTypes.number.isRequired,
  progressChange: PropTypes.number.isRequired,
  style: PropTypes.any,
  progressColor: PropTypes.any,
  secondColor: PropTypes.any,
  backgroundColor: PropTypes.any,
  strokeWidth: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  animate: PropTypes.bool,
  cornerRadius: PropTypes.number,
  animateDuration: PropTypes.number,
};

ProgressCircle.defaultProps = {
  progressColor: 'black',
  backgroundColor: '#ECECEC',
  strokeWidth: 5,
  startAngle: 0,
  endAngle: Math.PI * 2,
  cornerRadius: 45,
};

export default ProgressCircle;
