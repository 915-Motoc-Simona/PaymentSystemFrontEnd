import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as LogoutIcon from 'react-icons/bi'
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import {useNavigate} from "react-router-dom"
import { SidebarDataClient } from './SidebarDataClient'

const Nav = styled.div`
  background: #150E56;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #150E56;
  width: 15%;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const labelStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    margin: 20,
  };

  const [sidebar, setSidebar] = useState(true);

  const navigate = useNavigate();

  const showSidebar = () => setSidebar(true);

  const [user, setUser] = useState('');
  const [role, setRole] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/authentication/signin');
    window.location.reload(false);
  }

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
        setUser(JSON.parse(localStorage.getItem("user")).data.username)
        setRole(JSON.parse(localStorage.getItem("user")).data.role)
  }
  else{
    setUser('')
  }
}, [])

  return (
    <>
    {
      !JSON.parse(localStorage.getItem("user")) && 
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
        <br/><label style={labelStyle}>SafePay</label><br/><br/>
        </Nav>
      </IconContext.Provider>
    }
    { 
      JSON.parse(localStorage.getItem("user")) && 
      <IconContext.Provider value={{ color: '#fff' }}>
          <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon>
        <div className='login'>
            <h3> Logged in as: {user}</h3>
        </div>  
        <div className="logout">
          <NavIcon to="#">
            <LogoutIcon.BiLogOut onClick={handleLogout}/>
          </NavIcon>
        </div>
          </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
          <br/><label style={labelStyle}>SafePay</label><br/><br/>
            {role === "ROLE_ADMIN" &&
              SidebarData.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })
            }
            {role === "ROLE_CLIENT" &&
              SidebarDataClient.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })
            }
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    }
    </>
  );
};

export default Sidebar;