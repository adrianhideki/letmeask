import React from "react";
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import "../styles/room.scss";
// import { useAuth } from "../hooks/useAuth";

import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  const handleEndRoom = async () => {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  };

  const handleDeleteQuestion = async (questonId: string) => {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questonId}`).remove();
    }
  };

  const handleCheckQuestionAsAnswered = async (questonId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questonId}`).update({
      isAnswered: true,
    });
  };

  const handleHighlighQuestion = async (questonId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questonId}`).update({
      isHighlighted: true,
    });
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnsweared={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlighQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Deletar pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
};
