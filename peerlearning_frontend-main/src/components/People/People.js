import React, { useContext, useEffect, useState } from "react";
import './people.css';
import mail from '../People/images/mail.svg';
import Line from '../People/images/Line 1.svg';
import AuthContext from "../../AuthContext";
import bottom from '../../images/bottom.png'
import { G_API, API } from "../../config";
import Spinner from '../Spinner/Spinner.js'
function People(props) {
  const [TeachersName, setTeachersName] = useState([]);
  const [spin, setspin] = useState(true);
  const [role, setRole] = useState("student");
  const { userData, setUserData, setOpen, setMessage } = useContext(AuthContext);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (!props.teach?.name?.id) return;

        const response = await fetch(
          `${G_API}/courses/${props.teach.name.id}/teachers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        const data = await response.json();

        if (data && Array.isArray(data.teachers)) {
          setTeachersName(data.teachers);
          
          // Check if current user is a teacher
          const isTeacher = data.teachers.some(
            (teacher) => 
              teacher?.profile?.emailAddress === userData?.user?.email
          );
          
          if (isTeacher) {
            setRole("teacher");
          }
        } else {
          console.error('Invalid teacher data received:', data);
          setTeachersName([]);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachersName([]);
      } finally {
        setspin(false);
      }
    };

    fetchTeachers();
  }, [props.teach?.name?.id, userData.token]);

    return (
      <>
      {spin ? <Spinner/> : <div className="Teachers"> Teachers
          <img src={Line} id="line" />
          {TeachersName && TeachersName.map((teacher) => {
            const email = teacher?.profile?.emailAddress;
            const mails = email ? `mailto:${email}` : '#';
            return(
            <>
            <div id="profile">
              <div id="left-part">
                <img 
                  src={teacher?.profile?.photoUrl ? "https:" + teacher.profile.photoUrl : 'default-avatar.png'} 
                  id="pic" 
                  alt={teacher?.profile?.name?.fullName || 'Teacher'}
                />
                <p id="name">{teacher?.profile?.name?.fullName || 'Unknown Teacher'}</p>
              </div>
              <a href={mails} target="_blank"><img src={mail} id="mail"/></a>
            </div>
            </>
            )
            })}
          </div>}
          {<img src={bottom} alt="Image" className="btm"/>}
        </>
    )
}

export default People
