import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Button from '@folio/stripes-components/lib/Button';

import { getFullName } from './util';

const propTypes = {
  resources: PropTypes.shape({
    sponorIds: PropTypes.object,
  }).isRequired,

  mutator: PropTypes.shape({
    sponorIds: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }).isRequired,

  user: PropTypes.object,
};

class ProxyPermissions extends React.Component {
  static manifest = Object.freeze({
    sponorIds: {},
    users: {
      type: 'okapi',
      records: 'users',
      path: 'users?query=(%{sponorIds.query})',
    },
  });

  constructor(props) {
    super(props);
    this.editItem = this.editItem.bind(this);
  }

  editItem() {
  }

  componentWillReceiveProps(nextProps) {
    const { user, resources: { sponorIds } } = nextProps;
    if (user.proxyFor && user.proxyFor.length && !sponorIds.query) {
      const query = user.proxyFor.map(id => `id=${id}`).join(' or ');
    }
  }

  render() {
    // TODO: get sponsors via manifest
    const sponsors = [
      { user: { personal: { firstName: 'John', lastName: 'Brown' } }, status: 'Active' },
    ];

    // TODO: get proxies via manifest
    const proxies = [
      { user: { personal: { firstName: 'John', lastName: 'Brown' } }, status: 'Active' },
    ];

    const sponsorsFormatter = {
      Sponsor: sp => getFullName(sp.user),
      Status: sp => sp.status,
      ' ': () => (<a id="clickable-editproxy" onClick={this.editItem}>Edit</a>),
    };

    return (<div>
      <hr />
      <Row>
        <Col xs={5}>
          <h3 className="marginTop0">Proxy Permissions</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <MultiColumnList
            id="list-sponsors"
            formatter={sponsorsFormatter}
            visibleColumns={['Sponsor', 'Status', ' ']}
            contentData={sponsors}
          />
        </Col>
      </Row>
      <Row className="marginTopHalf">
        <Col xs={12}>
          <Button aria-haspopup="true">&#43; Add Sponsor</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <MultiColumnList
            id="list-proxies"
            formatter={sponsorsFormatter}
            visibleColumns={['Sponsor', 'Status', ' ']}
            contentData={proxies}
          />
        </Col>
      </Row>
      <Row className="marginTopHalf">
        <Col xs={12}>
          <Button aria-haspopup="true">&#43; Add Proxy</Button>
        </Col>
      </Row>
    </div>);
  }
}

ProxyPermissions.propTypes = propTypes;

export default ProxyPermissions;
