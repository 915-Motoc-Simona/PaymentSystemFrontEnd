import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as TbIcons from 'react-icons/tb'


export const SidebarDataClient = [
  {
    title: 'Profile',
    path: '/users',
    icon: <IoIcons.IoMdPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: <IoIcons.IoIosPaper />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'List',
        path: '/accounts',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'New account',
        path: '/accounts/register',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: <RiIcons.RiMoneyDollarCircleFill/>,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'List',
        path: '/payments',

      },
      {
        title: 'Create payment',
        path: '/payments/register',

      },
      {
        title: 'Transfer between accounts',
        path: '/payments/transfer',

      },
      {
        title: 'Transfer to PayPal account',
        path: '/payments/paypal',
      },
      {
        title: 'Approve request',
        path: '/payments/request/approve/client',
      },
    ]
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <TbIcons.TbBrandGoogleAnalytics/>,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  }
];