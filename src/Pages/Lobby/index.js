import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayerList } from '../../Components';
import { socket } from '../../services/socket';
import { Redirect } from 'react-router-dom';

const Game = () => {
  const location = useLocation();
  const [userName, setUserName] = useState(location.state.username);
  const [roomCode, setRoomCode] = useState(location.state.roomCode);
  const [owner, setOwner] = useState(location.state.roomOwner);
  const [startGame, setStartGame] = useState(false);
  const [playerList, setPlayerList] = useState([userName]);

  useEffect(() => {
    socket.emit('joinRoom', { roomName: roomCode, username: userName });

    socket.on('newPlayer', (data) => {
      if (owner) {
        setPlayerList((prevState) => {
          let newArr = prevState.slice(0);
          if (newArr.includes(data.username)) {
            return newArr;
          } else {
            newArr.push(data.username);
            return newArr;
          }
        });
      }
    });

    socket.on('updated players', (updatedPlayers) => {
      setPlayerList(updatedPlayers);
    });

    socket.on('start game', () => {
      setStartGame(true);
      console.log('hey 1');
    });
  }, []);

  useEffect(() => {
    if (owner) {
      let data = {
        roomName: roomCode,
        username: userName,
        playerList: playerList,
      };
      socket.emit('player update', data);
    }
  }, [playerList]);

  useEffect(() => {
    if (startGame) {
      socket.emit('start game', { roomCode: roomCode });
    }
  }, [startGame]);

  const handleStartGame = () => {
    console.log('hey2');
    setStartGame(true);
    // Emit start game to the socket
  };

  return (
    <>
      <h1>Game-Page</h1>
      <section>
        <h2>{roomCode}</h2>
      </section>
      <section>
        <h3>Players</h3>
        <PlayerList playerList={playerList} />
      </section>
      {owner ? <button onClick={handleStartGame}>Start Game</button> : null}
      {startGame === true ? (
        <Redirect
          to={{
            pathname: '/game',
            state: {
              roomCode: roomCode.toUpperCase(),
              owner: owner,
              playerList: playerList,
            },
          }}
        />
      ) : null}
    </>
  );
};

export default Game;
