import React from 'react';

import ConnectorIssue from './connectorIssue';
import ConnectorIssueWithOperator from './connectorIssueWithOperator';

export default ({format, item, font, time, fixOversize, Colors}) => {
  if (item.issue) {
    return item.employeeSince ? (
      <ConnectorIssueWithOperator
        {...{format, font, item, time, fixOversize, Colors}}
      />
    ) : (
      <ConnectorIssue {...{format, item, font, fixOversize, Colors}} />
    );
  }
};
