import React from 'react';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {Image, View, Text} from 'react-native';

import img from '../../../../ios/asset/img/img.png';
import imgChange from '../../../../ios/asset/img/img-change.png';
import imgSetup from '../../../../ios/asset/img/img-setup.png';

import FileIcon from '../../../../ios/asset/icons/file.svg';

const Code = ({format, oversize, fixOversize, item, font, Colors}) => {
  const {scale, isIOS} = format;
  return item.noImg ? (
    <View //Image block
      style={{
        height: oversize ? scale(76) - fixOversize.offsetImgSize : scale(76),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: oversize ? scale(9) - fixOversize.offsetImg : scale(9),
        width: '100%',
      }}>
      <View
        style={{
          borderStyle: 'dashed',
          borderWidth: scale(1),
          borderColor: '#979797',
          height: oversize ? scale(76) - fixOversize.offsetImgSize : scale(76),
          width: oversize ? scale(114) - fixOversize.offsetImgSize : scale(114),
          alignItems: 'center',
          borderRadius: 1,
        }}>
        <FileIcon
          width={scale(15, false)}
          height={scale(20, false)}
          style={{
            marginTop: oversize
              ? scale(8) - fixOversize.offsetImgSize / 3
              : scale(8),
          }}
        />
        <Text
          style={{
            fontSize: scale(9, false),
            color: Colors('label'),
            marginTop: oversize
              ? scale(isIOS ? 4 : 3) - fixOversize.offsetImgSize / 3
              : scale(isIOS ? 4 : 3),
            ...font.medium,
          }}>
          Picture missing
        </Text>
        <View
          style={{
            ...font.normal,
            fontSize: scale(5, false),
            marginTop: oversize
              ? scale(isIOS ? 4 : 3) - fixOversize.offsetImgSize / 3
              : scale(isIOS ? 4 : 3),
          }}>
          <Text
            style={{
              ...font.normal,
              color: Colors('label'),
              fontSize: scale(5, false),
              textAlign: 'center',
            }}>
            Link a picture or drawing to this NC file
          </Text>
          <Text
            style={{
              ...font.normal,
              color: Colors('label'),
              fontSize: scale(5, false),
              textAlign: 'center',
              marginTop: scale(isIOS ? 1 : 0),
            }}>
            with the Smart Factory App
          </Text>
          <Text
            style={{
              ...font.normal,
              color: Colors('label'),
              fontSize: scale(5, false),
              textAlign: 'center',
              marginTop: scale(isIOS ? 1 : 0),
            }}>
            or in your ERP software
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View //Image block
      style={{
        // width: oversize ? scale(114) - fixOversize.offsetImgSize : scale(114),
        width: '100%',
        height: oversize ? scale(74) - fixOversize.offsetImgSize : scale(74),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: oversize ? scale(10) - fixOversize.offsetImg : scale(10),
        paddingLeft: scale(3),
        paddingRight: scale(3),
      }}>
      <View
        style={{
          // width: oversize
          //   ? scale(82.97) - fixOversize.offsetImgSize
          //   : scale(82.97),
          width: '100%',
          height: oversize
            ? scale(70.93) - fixOversize.offsetImgSize
            : scale(70.93),
        }}>
        <Image
          source={{uri: item.blobLink || ''}}
          style={{
            flex: 1,
            resizeMode: 'contain',
            width: '100%',
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const compareProps = (prev, next) => {
  return (
    prev.fixOversize.offsetImgSize === next.fixOversize.offsetImgSize &&
    prev.fixOversize.offsetImg === next.fixOversize.offsetImg &&
    prev.item.noImg === next.item.noImg &&
    prev.item.blobLink === next.item.blobLink &&
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.Colors.scheme === next.Colors.scheme
  );
};

export default React.memo(Code, compareProps);
