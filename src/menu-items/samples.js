// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined, GoldOutlined, HomeOutlined, WalletOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  GoldOutlined,
  HomeOutlined,
  WalletOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const samples = {
  id: 'group-samples',
  type: 'group',
  children: [
    {
      id: 'samples',
      title: <FormattedMessage id="samples" />,
      type: 'collapse',
      icon: icons.WalletOutlined,
      children: [
        {
          id: 'sample-list',
          title: <FormattedMessage id="sample-list" />,
          type: 'item',
          url: '/samples/sample-list',
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default samples;
