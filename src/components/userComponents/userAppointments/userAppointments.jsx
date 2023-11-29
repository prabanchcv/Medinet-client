import { useCallback, useEffect, useState } from 'react';
import './userAppointments.css';
import axios from 'axios';
import { useSocket } from '../../../context/socket/socketProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addChatRoomId } from '../../../redux/chatSlice'
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

function UserAppointments() {

    const [appointments, setAppointments] = useState('');
    const userToken = localStorage.getItem('userToken');
    const socket = useSocket()
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);
    const email = useSelector(state => state.user.data.email)

   const date = new Date();
   const formattedDate = format(date, 'dd-MM-yyyy');

   const hours = date.getHours();
   const minutes = date.getMinutes();
   const period = hours >= 12 ? 'PM' : 'AM';

   // Convert hours to 12-hour format
   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

   // Pad minutes with leading zeros
   const formattedMinutes = minutes.toString().padStart(2, '0');

   const currentTime = `${formattedHours}.${formattedMinutes} ${period}`;

    const handleCancelAppointment = useCallback(async (id) => {
        console.log(id);
        await axios.post(import.meta.env.VITE_BASE_URL + `cancelAppoint/${id}`,

            {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.data == 'blocked') {
                    history('/login')
                    localStorage.removeItem('userToken')
                } else {
                    const updatedArray = appointments.length != 0 && appointments.map((item) => {
                        if (item._id === id) {
                            console.log(1);
                            return {
                                ...item,
                                isCancelled: true
                            }
                        }
                        return item
                    })
                    console.log(updatedArray);
                    setAppointments(updatedArray)
                }
            }
            )
    }, [appointments, userToken])

    useEffect(() => {
        async function datacall() {
            await axios
                .get(import.meta.env.VITE_BASE_URL + 'appointments', {
                })
                .then(res => {
                    console.log(res.data);
                    if (res.data == 'blocked') {
                        localStorage.removeItem('userToken')
                        history('/login')
                    } else {

                        setAppointments(res.data.appointments);
                        setUserData(res.data.user)
                    }
                });
        }
        datacall();
    }, [userToken]);


    const handleJoin = useCallback((roomId) => {
        const room = roomId
        socket.emit("room:join", { email, room })
    }, [socket, email])

    const handleJoinRoom = useCallback((data) => {
        const { room } = data
        navigate(`/call/${room}`)
    }, [navigate])

    useEffect(() => {
        socket.on('room:join', handleJoinRoom)
        return () => {
            socket.off('room:join', handleJoinRoom)
        }
    }, [socket, handleJoinRoom])

    const dispatch = useDispatch()
  const handleChat = (roomId, docterId) => {

    if (userData && appointments && docterId) {
      socket.emit('setup', userData);
      socket.emit('join-chat', roomId, userData, docterId);

      const handleRoomJoin = () => {
        dispatch(addChatRoomId(roomId))
        navigate(`/chat/${docterId}`)
      }

      socket.on('chat-connected', handleRoomJoin);

      return () => {
        socket.off('chat-connected', handleRoomJoin);
      }
    }
  }


    return (
        <>
            <div className="appoints text-center p-3 m-5 border  shadow-lg ">
                <h2>Appointments</h2>
                {appointments ? (appointments.length != 0 &&
                    appointments.map(el => (
                        <div className="appointCard text-center   border  shadow-lg  mt-3 p-3" key={el._id}>
                            <div className="row">
                                <div className="col-md-4 text-start">
                                    <h4>{el.docData[0].name}</h4>
                                    <h6 className='subText p-0 m-0'>Qualification:{el.docData[0].qualification}</h6>
                                    <h6 className='subText'>Gender:{el.docData[0].gender}</h6>
                                    <h6 className='subText'>Fees:{el.docData[0].fee}</h6>
                                </div>
                                <div className="col-md-4">
                                    <h6>Date : {el.date}</h6>
                                    <h6>Time : {el.time}</h6>
                                </div>
                                <div className="col-md-4">
                                    {
                                        <>
                                            { } <br />
                                            { (formattedDate >=el.date || el.time < currentTime) ? 'Expired' : el.isAttended ? "Attended" : !el.isCancelled ? <><button className='btn bg-danger text-white ps-2 pe-2 ' onClick={() => handleCancelAppointment(el._id)} style={{ fontSize: "15px" }}>Cancel</button> <button style={{ fontSize: "15px" }} className='btn ps-2 pe-2 btn-outline-success' onClick={() => handleJoin(el._id + el.user)}>Join</button><button style={{ fontSize: "15px" }} className='btn ps-2 pe-2 btn-outline-success' onClick={() => handleChat(el._id ,el.doctor)}>Chat</button></> : 'cancelled'}
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No appointments found.</p>
                )}
            </div>
        </>
    );
}

export default UserAppointments;
