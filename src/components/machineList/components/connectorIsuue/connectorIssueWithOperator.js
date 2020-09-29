import React from 'react';
import moment from 'moment';
import {Text, View} from 'react-native';

import {todayDateFormat, diffLetters} from '../../../../../helpers';

export default ({format, font, item, time, fixOversize, Colors}) => {
  const {scale, tileHeightRoundedDown, stretchDirectionTile, isIOS} = format;
  const textStyle = {
    color: Colors('headerLabel'),
    fontSize: scale(5, false),
    letterSpacing: scale(0),
    ...font.normal,
  };

  const formated = todayDateFormat(item.lastModified);

  const getSubTime = (t) => {
    const diff = time.diff(moment.utc(t), 'seconds');
    let m = Math.floor(diff / 60);
    let s = diff - m * 60;
    if (s < 10) {
      s = `0${s}`;
    }
    return {m, s};
  };

  const activeSinc = getSubTime(item.ncActiveSince);
  const addActiveSinc = getSubTime(item.ncAddActiveSince);

  return (
    <View
      style={{
        height: tileHeightRoundedDown - scale(27),
        backgroundColor: Colors('tilenotproductiveBackground'),
        borderBottomLeftRadius: scale(4.5),
        borderBottomRightRadius: scale(4.5),
        flex: 1,
        marginTop: scale(item.ownerName ? -1 : 0),
      }}>
      <View
        style={{
          width: scale(48),
          height: scale(15),
          backgroundColor: Colors('tertiaryLabel'),
          paddingLeft: scale(3),
          borderBottomRightRadius: scale(3),
          opacity: item.ownerName ? 1 : 0,
          justifyContent: 'space-around',
          alignContent: 'center',
        }}>
        <Text style={textStyle}>logged in since</Text>
        <Text style={textStyle}>
          {moment.utc(item.employeeSince).local().format('DD:MM HH:mm:ss')}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View
          style={{
            marginTop: scale(isIOS ? 22 : 19) - fixOversize.issueTopOffset,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: Colors('secondaryLabel'),
              fontSize: scale(6, false),

              ...font.normal,
            }}>
            Machine Not Productive since
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors('secondaryLabel'),
              fontSize: scale(12, false),
              marginTop: scale(isIOS ? 3 : 1),
              ...font.medium,
            }}>
            {formated}
          </Text>
        </View>
        <View style={{marginTop: scale(isIOS ? 5 : 4)}}>
          <Text
            style={{
              textAlign: 'center',
              color: Colors('secondaryLabel'),
              fontSize: scale(5, false),
              ...font.normal,
            }}>
            because of
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: Colors('secondaryLabel'),
              fontSize: scale(6, false),
              marginTop: scale(isIOS ? 3 : 2),
              ...font.medium,
            }}>
            {item.reason}
          </Text>
        </View>
        <View
          style={{
            marginTop:
              scale(isIOS ? 20 : 16) -
              (isIOS
                ? fixOversize.issueTopOffset
                : fixOversize.issueTopOffset * 0.4),
            marginBottom: scale(3),
            marginLeft: scale(3),
            marginRight: scale(3),
          }}>
          <View
            style={{
              width: '100%',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: Colors('secondaryLabel'),
                fontSize: scale(6, false),
                ...font.normal,
              }}>
              unlinked NC file active
            </Text>
            <View
              style={{
                height: scale(39),
                width: scale(114),
                backgroundColor: Colors('wallboardBackground'),
                borderRadius: scale(4),
                marginTop: scale(1),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors('secondaryLabel'),
                  fontSize: scale(6, false),
                  marginTop: scale(isIOS ? 3 : 2),
                  ...font.normal,
                }}>
                {item.ncFiles[0]}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors('secondaryLabel'),
                  fontSize: scale(6, false),
                  marginTop: scale(isIOS ? 1 : 0),

                  ...font.normal,
                }}>
                {activeSinc.m}
                <Text style={{...font.light, fontSize: scale(4, false)}}>
                  m
                </Text>{' '}
                {activeSinc.s}
                <Text style={{...font.light, fontSize: scale(4, false)}}>
                  s
                </Text>
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors('secondaryLabel'),
                  fontSize: scale(6, false),
                  marginTop: scale(isIOS ? 2.5 : 1),
                  ...font.normal,
                }}>
                {item.ncFiles[1] || ' '}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors('secondaryLabel'),
                  fontSize: scale(6, false),
                  marginTop: scale(isIOS ? 1 : -1),
                  ...font.normal,
                }}>
                {addActiveSinc.m}
                <Text style={{...font.light, fontSize: scale(4, false)}}>
                  m
                </Text>{' '}
                {addActiveSinc.s}
                <Text style={{...font.light, fontSize: scale(4, false)}}>
                  s
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
