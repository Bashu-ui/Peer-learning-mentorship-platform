import { Grid, Paper, makeStyles, Table, TableHead, TableCell, TableRow } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../AuthContext";
import Chatbot from './Chatbot/Chatbot';
import { G_API, API } from "../config";
import { ScoreCard } from "./ScoreCard";
import ListAltIcon from '@material-ui/icons/ListAlt';
import SearchIcon from '@material-ui/icons/Search';
import Student_View2 from "./student_View/Student_View2";
import Student_View3 from "./student_View/Student_View3";
import Page2 from "./TeacherDashboard/Page2";
import Page3 from "./TeacherDashboard/Page3";
import Spinner from "./Spinner/Spinner";
// import Button from '@material-ui/core/Button';
const Plotly = window.Plotly

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "center",
//     backgroundColor: theme.palette.primary.main,
//     color: "#ffffff",
//   },
//   table: {
//     minWidth: 650,
//   },
//   large: {
//     width: theme.spacing(3),
//     height: theme.spacing(3),
//   },
// }));

const Dashboard = () => {
  const [Spin, setSpin] = useState(true);
  const [Spin1, setSpin1] = useState(true);
  const [rev, setrev] = useState(true);
  const { id, course_id } = useParams(); //id is for assignment's _id of peer assignment
  const [assignment, setAssignment] = useState({}); //for storing info about the assignment fetched from both classroom and peer learning
  const [role, setRole] = useState("student");
  const [activities, setActivities] = useState([]); //for storing info abt a student and their reviewers info with marks and comments
  const [self, setSelf] = useState({});
  //const [reviewers, setReviewers] = useState(5); //for storing reviewers per sheet
  // const [reviewDeadline, setReviewDeadline] = useState(""); //for storing deadline for review
  const [mail, setMail] = useState("");
  const [reviewerCount, setReviewerCount] = useState(0);
  const [marks, setMarks] = useState([]); //for storing marks matrix
  const [studentRollNo, setStudentRollNo] = useState();
  const [studentInfo, setStudentInfo] = useState({
    RollNo: "",
    studentUserId: "",
  });
  const { userData, setUserData, setOpen, setMessage } = useContext(
    AuthContext
  );
  // const classes = useStyles();


  //for getting all info about the assignment
  useEffect(() => {
    if (userData.token) {
      // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${API}/api/peer/assignment?peer_assignment_id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          fetch(
            `${G_API}/courses/${course_id}/courseWork/${res.assignment_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              // console.log(r);
              // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
              setAssignment({ ...res, ...r });
              // console.log(assignment);
              setMarks(res.max_marks_per_question);
              setSpin(false);
              // if (res.reviewer_deadline) {
              //   setReviewDeadline(
              //     new Date(res.reviewer_deadline).toISOString()
              //   );
              // }
            });
        });
    }
  }, [userData.token]);
  // console.log(assignment);

  //for setting role
  useEffect(() => {
    if (userData.token) {
      // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${G_API}/courses/${course_id}/teachers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          res.teachers.forEach((teacher) => {
            if (teacher.profile.emailAddress === userData.user.email) {
              setRole("teacher");
            }
          });
        });
    }
  }, []);

  useEffect(() => {
    if (role === "student" && assignment.status === "Assigned") {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(
        `${API}/api/reviewerassignments?course_work_id=${assignment.assignment_id}&user_id=${userData.user.googleId}`
      )
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          console.log(res);
          let ac = [];
          res.forEach((r) => {
            if (r.review_score.length === 0) {
              r.review_score = Array(assignment.total_questions).fill(0);
              r.reviewer_comment = Array(assignment.total_questions).fill("");
            }
            if (r.author_id !== r.reviewer_id) {
              ac.push(r);
            } else {
              console.log(r);
              setSelf(r);
            }
          });
          setActivities(ac);
          setSpin1(false);
          console.log(ac);
          console.log(self);
          console.log(activities);
        });
    }
    if (role === "student" && assignment.status === "Grading") {
      getStudentReviews();
    }

    //   fetch(`${API}/api/plot9?Assignment_id=${assignment._id}&studentID=${userData.user.googleId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(userData);
    //       var ele = document.querySelector('#chart');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot7?peer_assignment_id=${assignment._id}&studentID=${userData.user.googleId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log("Plot 7");
    //       // console.log(res);
    //       var ele = document.querySelector('#SelfVsPeer');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot10?peerAssignment_id=${assignment._id}&author_id=${userData.user.googleId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#SelfVsPeerMarks');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot4?peer_assignment_id=${assignment._id}&studentID=${userData.user.googleId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#ConsistencyQue');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })
    // }

    if (role === "teacher") {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${API}/api/peeractivity?peer_assignment_id=${id}`) //for getting reviews and comments of students
        .then((res) => res.json())
        .then((res) => {
          // console.log("res for getting reviews and comments");
          // console.log(res);
          fetch(
            `https://classroom.googleapis.com/v1/courses/${course_id}/students`, //gets the list of all students enrolled in the course
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              setUserData((u) => ({ ...u, loader: u.loader - 1 }));
              // console.log("r for getting list of students");
              // console.log(r);
              let a = [];
              let authorMap = {};  //for storing the list of all students info with their id as key
              r.students.forEach((s) => {
                // console.log(s);
                authorMap[s.userId] = [s];
              });
              // console.log("Author Map");
              // console.log(authorMap);
              // console.log("Result res");
              // console.log(res);
              res.forEach((activity) => {
                // console.log(activity.author_id);
                // console.log(authorMap[activity.author_id]);
                if (authorMap[activity.author_id] !== undefined) {
                  authorMap[activity.author_id] = [
                    ...authorMap[activity.author_id],
                    {
                      ...activity,
                      ...authorMap[activity.reviewer_id][0].profile,
                    },
                  ];
                }
                // console.log(authorMap);
                // console.log(activity);
              });

              Object.keys(authorMap).forEach((author) => {
                a.push(authorMap[author]);
              });
              setActivities([...a]);
              // console.log(activities);
              let em = []; //store ids of students who have not submitted their reviews
              res.forEach((act) => {
                if (act.review_score.length === 0) {
                  em.push(authorMap[act.reviewer_id][0].profile.emailAddress);
                }
              });
              // console.log("em");
              // console.log(em);
              var countReviewr = 0;
              a.forEach((tttt) => {
                //console.log(tttt);
                if (countReviewr < (tttt.length)) {
                  countReviewr = tttt.length - 1;
                }
              });
              // console.log(countReviewr);
              setReviewerCount(countReviewr);
              // console.log(reviewerCount);
              setMail(
                "mailto:" +
                encodeURI(em) +
                "?subject=" +
                encodeURI("Complete the review process ASAP") +
                "&body=" +
                encodeURI(
                  "Submit the reviews on assigned answersheets. Link - https://serene-agnesi-9ee115.netlify.app/"
                )
              );
            });
        });
    }


    //   fetch(`${API}/api/plot1?Assignment_id=${assignment._id}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#consistencyScore');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })


    //   fetch(`${API}/api/plot2?Assignment_id=${assignment._id}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#AllStudentMarks');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot5?peer_assignment_id=${assignment._id}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#MarksDistribution');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot6?peerAssignment_id=${assignment._id}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#ActivityStatus');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })


    //   fetch(`${API}/api/plot7?peer_assignment_id=${assignment._id}&studentID=${studentInfo.studentUserId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       // console.log("plot 7");
    //       // console.log(res);
    //       var ele = document.querySelector('#SelfVsPeer');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot10?peerAssignment_id=${assignment._id}&author_id=${studentInfo.studentUserId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#SelfVsPeerMarks');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })

    //   fetch(`${API}/api/plot4?peer_assignment_id=${assignment._id}&studentID=${studentInfo.studentUserId}`, {
    //     method: "GET"
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // console.log(res);
    //       var ele = document.querySelector('#ConsistencyQue');
    //       Plotly.newPlot(ele, res.data, res.layout, res.config);
    //     })
  }, [role, assignment._id, assignment.status]);

  // const submitReview = (row) => {
  //   setUserData((u) => ({ ...u, loader: u.loader + 1 }));

  //   fetch(`${API}/api/reviewassignment`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       peer_activity_id: row._id,
  //       review_score: row.review_score,
  //       reviewer_comment: row.reviewer_comment,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (res) => {
  //         setOpen(true);
  //         setMessage("Successfully saved review");
  //         setUserData((u) => ({ ...u, loader: u.loader - 1 }));
  //       },
  //       (err) => {
  //         setOpen(true);
  //         setMessage("Some thing went wrong while saving review");
  //         setUserData((u) => ({ ...u, loader: u.loader - 1 }));
  //       }
  //     );
  // };

  // const handleScoreChange = (i, k, e) => {
  //   let { value, min, max } = e.target;
  //   value = Math.max(Number(min), Math.min(Number(max), Number(value)));
  //   const ac = activities;
  //   ac[i].review_score[k] = value;
  //   setActivities([...ac]);
  // };

  // const handleCommentChange = (i, k, comment) => {
  //   const ac = activities;
  //   ac[i].reviewer_comment[k] = comment;
  //   setActivities([...ac]);
  // };

  // const handleSelfScoreChange = (k, e) => {
  //   let { value, min, max } = e.target;
  //   value = Math.max(Number(min), Math.min(Number(max), Number(value)));
  //   const s = self;
  //   s.review_score[k] = value;
  //   setSelf({ ...self });
  // };

  // const handleSelfCommentChange = (k, comment) => {
  //   const s = self;
  //   s.reviewer_comment[k] = comment;
  //   setSelf({ ...self });
  // };

  // const stopReview = () => {
  //   setUserData((u) => ({ ...u, loader: 1 }));

  //   fetch(`${API}/api/closeassignment?peer_assignment_id=${id}`, {
  //     method: "POST",
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (res) => {
  //         console.log(res);
  //         setUserData((u) => ({ ...u, loader: 0 }));
  //         setOpen(true);
  //         setMessage("Peer learning process stop");
  //       },
  //       (err) => {
  //         setOpen(true);
  //         setMessage("Some thing went wrong ");
  //       }
  //     );

  // };

  const getStudentReviews = () => {
    setUserData((u) => ({ ...u, loader: u.loader + 1 }));
    fetch(
      `${API}/api/reviews?peer_assignment_id=${id}&student_id=${userData.user.googleId}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setActivities(res);
        setUserData((u) => ({ ...u, loader: u.loader - 1 }));
      });
  };

  // const handleInput = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   // console.log(name, value);
  //   setStudentInfo({ ...studentInfo, [name]: value })
  //   // setStudentUserId(value);
  // }

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   // console.log(studentRollNo);
  //   activities.forEach(a => {
  //     if (studentInfo.RollNo === ((a[0].profile.emailAddress).substring(0, 9))) {
  //       console.log(a[0].userId);
  //       var x = a[0].userId;
  //       setStudentInfo(prevState => ({
  //         RollNo: prevState.RollNo,    // keep all other key-value pairs
  //         studentUserId: x       // update the value of specific key
  //       }));
  //       console.log("studentInfo");
  //       // console.log(studentInfo);
  //     }
  //   });
  // };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {Spin && Spin1 ? (
          <Spinner />
        ) : (
          <div className="dashboard">
            <div className="contain">
              {role === "student" ? (
                assignment.status === "Assigned" ? (
                  <Student_View2
                    assg={assignment}
                    self={self}
                    activities={activities}
                    marks={marks}
                    setSelf={setSelf}
                    setActivities={setActivities}
                  />
                ) : (
                  <Student_View3
                    assg={assignment}
                    activities={activities}
                    marks={marks}
                    setActivities={setActivities}
                  />
                )
              ) : assignment.status === "Assigned" ? (
                <Page2
                  assg={assignment}
                  activities={activities}
                  marks={marks}
                  reviewerCount={reviewerCount}
                />
              ) : (
                <Page3 assg={assignment} />
              )}
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;