import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';


export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    subNav: []
  },
  {
    title: 'Users',
    path: '/users',
    icon: <IoIcons.IoMdPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'List',
        path: '/users',
        icon: <IoIcons.IoMdPeople />,
        cName: 'sub-nav'
      },
      {
        title: 'Create',
        path: '/users/register',
        icon: <IoIcons.IoMdPeople />,
        cName: 'sub-nav'
      },
      {
        title: 'Approve',
        path: '/users/approve',
        icon: <IoIcons.IoMdPeople />,
        cName: 'sub-nav'
      }
    ]
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
        title: 'Create',
        path: '/accounts/register',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Approve',
        path: '/accounts/approve',
        icon: <IoIcons.IoIosPaper />
      }
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
        icon: <RiIcons.RiMoneyDollarCircleFill/>
      },
      {
        title: 'Create',
        path: '/payments/register',
        icon: <RiIcons.RiMoneyDollarCircleFill/>
      },
      {
        title: 'Approve',
        path: '/payments/requests',
        icon: <RiIcons.RiMoneyDollarCircleFill/>
      }
    ]
  }
];