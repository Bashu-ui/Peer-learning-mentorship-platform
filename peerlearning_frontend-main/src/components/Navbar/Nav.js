import React, { useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import { ReactComponent as Hamburger } from '../Navbar/Images/hamburger.svg';
import { ReactComponent as HelpIcon } from '../Navbar/Images/Help.svg';
import { ReactComponent as CalendarIcon } from '../Navbar/Images/Calendar.svg';
import { ReactComponent as QueryIcon } from '../Navbar/Images/Query.svg';
import { ReactComponent as TodoIcon } from '../Navbar/Images/To-do.svg';
import { ReactComponent as SkillsIcon } from '../Navbar/Images/Skills.svg';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import {useHistory} from "react-router";
import './Nav.css';
import { IconContext } from 'react-icons';

function Nav({setCourse}) {
const history = useHistory();
const [sidebar, setSidebar] = useState(false);
const showSidebar = () => setSidebar(!sidebar);
const [courses] = useState([
  { name: 'Sample Course 1', id: '1' },
  { name: 'Sample Course 2', id: '2' },
  { name: 'Sample Course 3', id: '3' }
]);

const truncate = (str) => {
if (str.length>25) {
  let substr = str.substring(0,25);
  return substr + "...";
}
else
    return str;
}


  // console.log(Value);

return (
  <>
    <IconContext.Provider value={{ color: '#fff' }}>

      <div className='navbar container-fluid'>

        <Link to='#' className='menu-bars'>
          <Hamburger onClick={showSidebar} />
        </Link>
        <Link onClick={()=>{
          setCourse({})
          history.push("/")
        }}>
        <h4 className="navbar-title-name">Peer Learning</h4>
        </Link>
        
        {/* {
          Title ? <h4 className="navbar-title-name">Peer Learning</h4>
          :<h4 className="navbar-title-name">Peer Learning</h4>
        } */}


          <div className="navbar-right-side-icon">
            <Link to="/Help" className="help_page_icon" data-toggle="tooltip" data-placement="botom" title="Help"><HelpIcon/></Link>
          </div>
      </div>

      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-closebars'>
              <AiIcons.AiOutlineClose  className="closebars"/>
            </Link>
          </li>

          <li className="top-sidebar-icon">
          <CalendarIcon/>
          <RouterLink to="/Calendar">
          <p className="top-li-elements">Calendar</p>
          </RouterLink>
          </li>

          <li className="top-sidebar-icon">
          <TodoIcon/>
          <RouterLink to="/Assigned">
          <p className="top-li-elements">To-do</p>
          </RouterLink>
          </li>

          <li className="top-sidebar-icon">
          <SkillsIcon/>
          <RouterLink to="/skills">
          <p className="top-li-elements">Skills</p>
          </RouterLink>
          </li>
          
          <li className="top-sidebar-icon">
          <HelpIcon/>
          <RouterLink to="/Help">
          <p className="top-li-elements">Help</p>
          </RouterLink>
          </li>

          <li className="top-sidebar-icon">
          <QueryIcon/>
          <p className="top-li-elements">Query</p>
          </li>
        
          <hr className="hr_line"></hr>
          
          {courses.map((item, index) => {
            return (
              <li key={index} onClick={() => {
                setCourse(item)
                history.push("/")
              }}>
                <div className="list-elements">
                <p className="first_letter">{item.name.charAt(0)}</p>
                <Link className="sidebar_name" to={item.path}>
                  <span className="sp1">{truncate(item.name)}</span>
                </Link>
                </div>
              
              </li>
            );
          })}


        </ul>
      </nav>

    </IconContext.Provider>
  </>
);
}

export default Nav;